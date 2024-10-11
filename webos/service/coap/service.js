const pkg_info = require("./package.json");
const Service = require('webos-service');
const coap = require('coap');

const service = new Service(pkg_info.name);
const DB_KIND = 'xyz.rollforward.app.coap:1';
let interval;

// 센서 값 데이터베이스 생성 (임시)
service.register('createKind', function(message) {
    const kindData = {
        id: DB_KIND,
        owner: 'xyz.rollforward.app.coap',
        schema: {
            type: 'object',
            properties: {
                _id: { type: 'string' },
                deviceId: { type: 'string' },
                value: { type: 'number' },
                time: { type: 'string' }
            },
            required: ['deviceId', 'time', 'value']
        },
        indexes: [
            { name: 'deviceId', props: [{ name: 'deviceId' }] }
        ]
    };

    service.call('luna://com.webos.service.db/putKind', kindData, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, results: 'Kind created successfully'});
        } else {
            message.respond({ returnValue: false, error: response.error });
        }
    });
});

// 센서 값 데이터베이스 삭제 (임시)
service.register('deleteKind', function(message) {
    service.call('luna://com.webos.service.db/delKind', {id: DB_KIND}, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, results: 'Kind deleted successfully'});
        } else {
            message.respond({ returnValue: false, error: response.error });
        }
    });
});

// 센서 값 데이터 Create (임시)
service.register('create', function(message) {
    if (!(message.payload.deviceId && typeof message.payload.value !== 'undefined')) {
        message.respond({
            returnValue: false,
            results: "Value & deviceId is required"
        })
    }
    const dataToStore = {
        _kind: DB_KIND,
        deviceId: message.payload.deviceId,
        time: new Date().toISOString(),
        value: message.payload.value
    };

    service.call('luna://com.webos.service.db/put', { objects: [dataToStore] }, (response) => {
        console.log(response);
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, results: response.payload.results[0].id});
        } else {
            message.respond({ returnValue: false, results: response.error});
        }
    });
});

// 센서 값 데이터 Update (임시)
service.register('update', function(message) {
    const updatedItem = {
        _id: message.payload.id,
        _kind: DB_KIND
    };

    if (message.payload.deviceId) {
        updatedItem.deviceId = message.payload.deviceId;
    }

    if (message.payload.value) {
        updatedItem.value = message.payload.value;
    }

    if (message.payload.time) {
        updatedItem.time = message.payload.time;
    }

    service.call('luna://com.webos.service.db/merge', { objects: [updatedItem] }, (response) => {
        console.log(response);
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, results: 'Item updated successfully' });
        } else {
            message.respond({ returnValue: false, results: response.error });
        }
    });
});

// 센서 값 데이터 read
service.register('read', function(message) {
    const query = {
        from: DB_KIND,
        where: []
    };

    if (message.payload.id) {
        query.where.push({ prop: '_id', op: '=', val: message.payload.id });
    }

    if (message.payload.deviceId) {
        query.where.push({ prop: 'deviceId', op: '=', val: message.payload.deviceId });
    }

    service.call('luna://com.webos.service.db/find', { query: query }, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, results: response.payload.results });
        } else {
            message.respond({ returnValue: false, results: response.error });
        }
    });
});

// 가장 최근에 측정된 값 read
service.register('read/latest', function(message) {
    const query = {
        from: DB_KIND,
        where: []
    };

    if (!message.payload.deviceId) {
        message.respond({ returnValue: false, results: "deviceId is required."});
    }
    query.where.push({ prop: 'deviceId', op: '=', val: message.payload.deviceId });

    service.call('luna://com.webos.service.db/find', { query: query }, (response) => {
        if (response.payload.returnValue) {
            let result = response.payload.results;
            console.log(result);
            if (result.length < 1) message.respond({returnValue: false, results: "No Data"});

            result.sort((a, b) => {
                const dateA = new Date(Date.parse(a.time));
                const dateB = new Date(Date.parse(b.time));

                if (dateA > dateB) return 1;
                if (dateA < dateB) return -1;
                return 0;
            });
            result.reverse();

            console.log(result);
            
            message.respond({ returnValue: true, results: result[0] });
        } else {
            message.respond({ returnValue: false, results: response.error });
        }
    });
});

// 센서 값 데이터 Delete
service.register('delete', function(message) {
    const ids = [message.payload.id];
    
    if (!("id" in message.payload)) {
        message.respond({ returnValue: false, results: 'id is required.' });
    }

    service.call('luna://com.webos.service.db/del', { ids: ids }, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, results: 'Item deleted successfully' });
        } else {
            message.respond({ returnValue: false, results: response.error });
        }
    });
});

// CoAP 관련 함수

// 센서 데이터 저장 함수
function storeSensorData(sensorData) {
    const dataToStore = {
        _kind: DB_KIND,
        deviceId: sensorData.deviceId,
        value: sensorData.value,
        time: new Date().toISOString()
    };

    service.call('luna://com.webos.service.db/put', { objects: [dataToStore] }, (response) => {
        // if (response.payload.returnValue) {
        //     message.respond({ returnValue: true, results: response.payload.results[0].id});
        // } else {
        //     message.respond({ returnValue: false, results: response.error});
        // }
    });
}

// CoAP 메시지 전송 및 데이터 저장 함수
function sendCoapMessageAndStore(hostIP) {
    const req = coap.request({
        host: hostIP,
        port: 5683,
        method: 'GET',
        pathname: 'sensor'
    });

    req.on('response', function(res) {
        console.log('Response from CoAP server:', res.payload.toString());
        try {
            const sensorData = JSON.parse(res.payload.toString());
            storeSensorData(sensorData);
        } catch (error) {
            console.error('Error parsing sensor data:', error);
        }
    });

    req.end();
}

// 서비스 메소드: CoAP 메시지 전송 시작
service.register("startSending", (message) => {
    if (!interval) {
        interval = setInterval(() => sendCoapMessageAndStore(message.payload.ip), message.payload.interval * 1000);
        message.respond({
            returnValue: true,
            message: "Started sending CoAP messages and storing data"
        });
    } else {
        message.respond({
            returnValue: false,
            message: "Already sending CoAP messages and storing data"
        });
    }
});

// 서비스 메소드: CoAP 메시지 전송 중지
service.register("stopSending", (message) => {
    if (interval) {
        clearInterval(interval);
        interval = null;
        message.respond({
            returnValue: true,
            message: "Stopped sending CoAP messages and storing data"
        });
    } else {
        message.respond({
            returnValue: false,
            message: "Not currently sending CoAP messages"
        });
    }
});