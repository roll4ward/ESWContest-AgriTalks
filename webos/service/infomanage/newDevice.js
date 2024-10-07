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