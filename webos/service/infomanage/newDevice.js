const { exec } = require("child_process");
const EventEmitter = require('events');

const {uuid : UUID, command : COMMAND, status: STATUS, thread_role : ROLE} = require("./ble_info.json");
let scanSubscription = null;
let scanSignal = new EventEmitter();

function Respond(returnValue, results) {
    this.returnValue = returnValue,
    this.results = results
}

module.exports = (service) => {
    service.register("newDevice/startScan", (message) => {
        if (scanSubscription) {
            message.respond(new Respond(false, "Already Scanning!"));
            return;
        }

        scanSubscription = service.subscribe("luna://com.webos.service.bluetooth2/le/startScan", {
            subscribe: true,
            serviceUuid: {uuid: UUID.COMMISSION_SERVICE}
        });
        scanSignal = new EventEmitter();

        scanSubscription.on("response", (response) => {
            if (response.payload.returnValue && response.payload.devices) {
                const result = response.payload.devices.map(({name, address, rssi}) => ({name, address, rssi}));
                message.respond(new Respond(true, result))
            }
        });

        scanSignal.addListener("stopScan", ()=>{
            message.cancel();
        })
    });

    service.register("newDevice/stopScan", (message) => {
        if (!scanSubscription) {
            message.respond(new Respond(false, "Already Stopped"));
            return;
        }

        scanSubscription.cancel();
        scanSignal.emit("stopScan");
        scanSubscription = null;
        scanSignal = null;

        message.respond(new Respond(true, "Stopped scanning successfully"));
    });

    service.register("newDevice/connect", (message) => {
        if (!message.payload.address) {
            message.respond(new Respond(false, "Address is required."));
            return;
        }

        service.call(
            "luna://com.webos.service.bluetooth2/gatt/connect",
            { address : message.payload.address },
            async (response) => {
                if (!response.payload.returnValue) {
                    message.respond(new Respond(false, response.payload.errorText));
                    return;
                }
                
                const clientId = response.payload.clientId;
                let trial = 0;
                while (trial < 1000) {
                    try{
                        await callDiscoveryService(service, message.payload.address, clientId);
                        break;
                    }
                    catch (err) {
                        ++trial;
                        continue;
                    }
                }
                if (trial >= 1000) {
                    message.respond(new Respond(false, "Service discover failed"));
                    return;
                }

                message.respond(new Respond(true, {
                    clientId: clientId,
                    address: message.payload.address
                }));
                callDiscoveryService(service, message.payload.address, clientId);
            }
        );
    });

    service.register("newDevice/register", async (message) => {
        if (!message.payload.clientId) {
            message.respond(new Respond(false, "ClientId is required."));
        }

        const clientId = message.payload.clientId;

        if (message.payload.address) {
            await callDiscoveryService(service, message.payload.address, clientId);
        }

        // Get Thread Network key
        let networkkey = await getThreadNetworkkey().then(
            (key) => hexStringToByteArray(key)
        ).catch(
            (error) => {
                console.error("Networkkey query error ", error);
                message.respond(new Respond(false, "Can not get Thread Network key"));
                message.cancel();
                return;
            }
        );

        let haltSignal = new EventEmitter();
        let checkStatus = waitForJoiningNetwork(service, clientId, haltSignal)
            .catch((reason)=>{
                console.log("Monitoring GATT Error ", reason);
                message.respond(new Respond(false, "Failed to monitor status"));
                message.cancel();
                return;
            });

        // Write Network key and Join Network Command
        try {
            await writeGATTCharacteristic(service, clientId, UUID.COMMISSION_NETWORK_KEY, networkkey);
            await writeGATTCharacteristic(service, clientId, UUID.COMMISSION_COMMAND, [COMMAND.JOIN_NETWORK]);
        }
        catch (error) {
            console.error("GATT Write Error ", error);
            message.respond(new Respond(false, "Failed to write command"));
            message.cancel();

            haltSignal.emit("stop");
            return;
        }
        message.respond(new Respond(true, {
            message: "Command Write",
            status: 1
        }));

        await checkStatus;

        message.respond(new Respond(true, {
            message: "Network Joinning Done",
            status: 2
        }));

        // Read ML_ADDR, UNIT, TYPE(TYPE/SUBTYPE)
        let deviceInfo = await readGATTCharacteristic(service, clientId, [
            UUID.COMMISSION_TYPE, UUID.COMMISSION_ML_ADDR, UUID.COMMISSION_UNIT
        ])
        .catch((err)=> {
            console.log("Error while reading device info", err);
            message.respond(new Respond(false, "Failed to read deviceinfo"));
            message.cancel();
        });

        message.respond(new Respond(true, {
            message: "Read Device Info Done",
            status: 3
        }));

        console.log(deviceInfo);
        let devices = parseDeviceInfo(deviceInfo);

        console.log(devices);

        let devices_created = await Promise.all(devices.map((ele) => createNewDevice(service, ele)));

        console.log(devices_created);

        message.respond(new Respond(true, {
            message: "Createing New Device Done.",
            status: 4,
            devices: devices_created
        }));

        // DISABLE_BLE Write
        await writeGATTCharacteristic(service, clientId, UUID.COMMISSION_COMMAND, [COMMAND.DISABLE_BLE])
            .then(()=>{
                console.log("write DISABLE_BLE command successfully");
                message.respond(new Respond(true, {
                    message: "Disconnect Device by remote",
                    status: 5
                }));
            })
            .catch((err)=> {
                console.log("failed to write DISABLE_BLE command");
                service.call("luna://com.webos.service.bluetooth2/gatt/disconnect",
                            {clientId: clientId},
                            (response) => {
                                if (!response.payload.returnValue) {
                                    console.log("Failed to disconnect using bluetooth2");
                                }

                                message.respond(new Respond(true, {
                                    message: "Disconnect Device by host",
                                    status: 5
                                }));
                            })
        });
        
        message.cancel();
    });

    service.register("newDevice/initialize", async (message) => {
        if (!(message.payload.deviceId)) {
            message.respond(new Respond(false, "deviceId is required."));
            return;
        }
        if (!(message.payload.name)) {
            message.respond(new Respond(false, "name is required."));
            return;
        }
        if (!(message.payload.areaId)) {
            message.respond(new Respond(false, "areaId is required."));
            return;
        }

        let query = {
            id: message.payload.deviceId,
            name: message.payload.name,
            areaId: message.payload.areaId,
        }

        if (message.payload.desc) query.desc = message.payload.desc;

        await updateDevice(service, query)
            .then(()=>{
                message.respond(new Respond(true, "Initializing device successfully."));
            })
            .catch((err)=>{
                message.respond(new Respond(false, "Failed to initialize device"));
            });
    });
}

function callDiscoveryService(service, address, clientId) {
    return new Promise((res, rej) => {
        service.call(
            "luna://com.webos.service.bluetooth2/gatt/discoverServices",
            { address : address },
            (response) => {
                console.log(response);
                if (!response.payload.returnValue) {                
                    rej();
                }

                res();
            }
        );
    });
}

function getThreadNetworkkey() {
    return new Promise((res, rej)=>{
        exec("wpanctl get networkkey", (error, stdout, stderr) => {
            if (error) {
                console.log(error);
                rej();
            }
    
            let result = stdout.match(/\[(.*?)\]/)[1];
            
            res(result);
        })
    });
}

function hexStringToByteArray(hexString) {
    const byteArray = [];
    for (let i = 0; i < hexString.length; i += 2) {
      const byte = parseInt(hexString.substr(i, 2), 16);
      byteArray.push(byte);
    }
  
    return byteArray;
}

function writeGATTCharacteristic(service, clientId, characteristic, value) {
    return new Promise((res, rej) => {
        service.call("luna://com.webos.service.bluetooth2/gatt/writeCharacteristicValue", 
            {
                clientId: clientId,
                service: UUID.COMMISSION_SERVICE, 
                characteristic: characteristic,
                value: {bytes: value}
            },    
            (response) => {
                if (!response.payload.returnValue) {
                    console.log("Failed to write gatt ", response);
                    rej();
                }

                res();
            }
        );
    });
}

function readGATTCharacteristic(service, clientId, characteristics) {
    return new Promise((res, rej) => {
        service.call("luna://com.webos.service.bluetooth2/gatt/readCharacteristicValues", 
            {
                clientId: clientId,
                service: UUID.COMMISSION_SERVICE, 
                characteristics: characteristics
            },    
            (response) => {
                if (!response.payload.returnValue) {
                    console.log("Failed to read gatt ", response.payload);
                    rej();
                    return;
                }
            
                let result_arr = response.payload.values;
                let result = {};
                result_arr = result_arr.map(({characteristic, value}) => ({characteristic: characteristic, value: value.bytes}));
                result_arr = result_arr.map((ele) => {
                    switch(ele.characteristic) {
                        case UUID.COMMISSION_ML_ADDR:
                            result.ipv6 = byteArrayToIpv6(ele.value);
                            break;
                        case UUID.COMMISSION_UNIT:
                            result.unit = byteArrayToString(ele.value);
                            break;
                        case UUID.COMMISSION_TYPE:
                            result.type = byteArrayToString(ele.value);
                            break;
                        case UUID.COMMISSION_STATUS:
                            result.status = ele.value[0];
                            break;
                        case UUID.COMMISSION_ROLE:
                            result.role = ele.value[0];
                            break;
                    }
                })
                res(result);
            }
        );
    });
}

function byteArrayToIpv6(byteArray) {
    let ipv6 = "";
    for (let i = 0; i < 16; i += 2) {
      const hex = (byteArray[i] << 8 | byteArray[i + 1]).toString(16);
      ipv6 += hex;
      if (i < 14) {
        ipv6 += ":";
      }
    }
  
    return ipv6;
  }

function byteArrayToString(byteArray) {
    return new TextDecoder('utf-8').decode(new Uint8Array(byteArray));
  }

function waitForJoiningNetwork(service, clientId, haltSignal) {
    let subscription;
    return new Promise((res, rej) => {
        let isJoiningDone = false;
        let status, role;

        readGATTCharacteristic(service, clientId, [
            UUID.COMMISSION_STATUS, UUID.COMMISSION_ROLE
        ]).then((data)=>{
            role = data.role;
            status = data.status;

            if (role >= 2 && status == 3) {
                res();
                return;
            }
            
        }).catch((err) => {
            rej("Monitoring Failed");
        })

        subscription = service.subscribe("luna://com.webos.service.bluetooth2/gatt/monitorCharacteristics",
            {
               service: UUID.COMMISSION_SERVICE,
               characteristics : [
                   UUID.COMMISSION_STATUS,
                   UUID.COMMISSION_ROLE
               ],
               clientId: clientId,
               subscribe: true
            });

        subscription.on("response", (response) => {
            console.log(response);
            if (!response.payload.returnValue) {
                console.log("Error while monitoring ", response);
                subscription.cancel();
                rej("Monitoring Failed");
                return;
            }

            if (!response.payload.changed) return;

            let {characteristic, value} = response.payload.changed;
            value = value.bytes;
            console.log(characteristic);
            console.log(value[0]);

            if ((!isJoiningDone) && characteristic == UUID.COMMISSION_ROLE) {
                isJoiningDone = (value[0] >= ROLE.CHILD);
                console.log(isJoiningDone);
            }

            if (isJoiningDone) {
                readGATTCharacteristic(service, clientId, [
                    UUID.COMMISSION_STATUS, UUID.COMMISSION_ROLE
                ]).then((data)=>{
                    role = data.role;
                    status = data.status;
        
                    if (role >= 2 && status == 3) {
                        console.log(role, status);
                        res();
                        return;
                    }

                    else {
                        console.log(role, status);
                        rej("Invalid monitoring");
                    }
                    
                }).catch((err) => {
                    rej("Monitoring Failed");
                }).finally(()=>{
                    subscription.cancel();
                });
            }
        });

        haltSignal.addListener("stop", ()=>{
            console.log("Monitoring Halted");
            rej("Monitoring Halted");
        })
    });
}

function parseDeviceInfo(deviceInfo) {
    let types = deviceInfo.type.split('^');
    let units = deviceInfo.unit.split('^');

    let result = types.map((ele, index) => {
        const split_type = ele.split('/');
        const result = {
            ip: deviceInfo.ipv6,
            type: split_type[0],
            subtype: split_type[1],
            unit: units[index]
        };

        return result;
    });

    return result;
}

function createNewDevice(service, deviceInfo) {
    console.log(deviceInfo);
    const {ip, subtype, type, unit} = deviceInfo;
    return new Promise((res, rej) => {
        service.call("luna://xyz.rollforward.app.infomanage/device/create", 
            {
                ip: ip,
                subtype: subtype,
                type: type,
                unit: unit,
                name: "새로운 기기",
                areaId: "null"
            },
            (response) => {
                if (!response.payload.returnValue) {
                    console.log("Failed to create new device");
                    rej("Error while creating new device");
                    return;
                }

                res(
                    {
                        deviceId: response.payload.results,
                        subtype: subtype
                    }
                );
            });
    });
}

function updateDevice(service, deviceInfo) {
    console.log(deviceInfo);
    return new Promise((res, rej) => {
        service.call("luna://xyz.rollforward.app.infomanage/device/update", 
            deviceInfo,
            (response) => {
                if (!response.payload.returnValue) {
                    console.log("Failed to update device");
                    rej("Error while updating device");
                    return;
                }

                res();
            });
    });
}