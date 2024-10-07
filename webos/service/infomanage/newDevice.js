const { exec } = require("child_process");
const EventEmitter = require('events');

const {uuid : UUID, command : COMMAND, status: STATUS, thread_role : ROLE} = require("./ble_info.json");
let scanSubscription = null;

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

        scanSubscription.on("response", (response) => {
            if (response.payload.returnValue && response.payload.devices) {
                const result = response.payload.devices.map(({name, address, rssi}) => ({name, address, rssi}));
                message.respond(new Respond(true, result))
            }
        });
    });

    service.register("newDevice/stopScan", (message) => {
        if (!scanSubscription) {
            message.respond(new Respond(false, "Already Stopped"));
            return;
        }

        scanSubscription.cancel();
        scanSubscription = null;

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
            (response) => {
                if (!response.payload.returnValue) {
                    message.respond(new Respond(false, response.payload.errorText));
                    return;
                }
                
                const clientId = response.payload.clientId;
                callDiscoveryService(service, message, response.payload.address, clientId, 0);

            }
        );
    });

    service.register("newDevice/register", async (message) => {
        if (!message.payload.clientId) {
            message.respond(new Respond(false, "ClientId is required."));
        }

        const clientId = message.payload.clientId;

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
        message.respond(new Respond(true, "Command Write"));

        await checkStatus;

        message.respond(new Respond(true, "Network Joinning Done"));
        // Read ML_ADDR, UNIT, TYPE
        // infomanage/device/create
        // "새로운 기기" / "" (이름 / 설명), areaId = null;
        // Return ID of device
        // DISABLE_BLE Write
    });

    service.register("newDevice/initialize", (message) => {
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

        // infomanage/device/update
    });
}

function callDiscoveryService(service, message, address, clientId, trial) {
    service.call(
        "luna://com.webos.service.bluetooth2/gatt/discoverServices",
        { address : address },
        (response) => {
            console.log(response);
            if (!response.payload.returnValue) {
                if (++trial < 1000) callDiscoveryService(service, message, address, clientId, trial);
                else {
                    message.respond(new Respond(false, {
                        clientId: clientId,
                        errorText: response.payload.errorText
                    }));
                    console.log(trial);
                }
                return;
            }
            console.log(trial);
            message.respond(new Respond(true, {
                clientId: clientId,
                address: response.payload.address
            }));
            
        }
    );
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

function waitForJoiningNetwork(service, clientId, haltSignal) {
    let subscription;
    return new Promise((res, rej) => {
        let isCommandDone = false, isJoiningDone = false;

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

            if ((!isCommandDone) && characteristic == UUID.COMMISSION_STATUS) {
                isCommandDone = (value[0] == STATUS.DONE);
                console.log(isCommandDone);
            }

            if ((!isJoiningDone) && characteristic == UUID.COMMISSION_ROLE) {
                isJoiningDone = (value[0] >= ROLE.CHILD);
                console.log(isJoiningDone);
            }

            if (isCommandDone && isJoiningDone) {
                subscription.cancel();
                res();
                return;
            }
        });

        haltSignal.addListener("stop", ()=>{
            console.log("Monitoring Halted");
            rej("Monitoring Halted");
        })
    });
}