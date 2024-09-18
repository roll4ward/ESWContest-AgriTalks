const pkg_info = require("./package.json");
const Service = require('webos-service');
const coap = require('coap');

const service = new Service(pkg_info.name);
const DB_KIND = 'xyz.rollforward.app.coap:1';
let interval;

// 데이터베이스 종류(kind) 생성
service.register('createKind', function(message) {
    const kindData = {
        id: DB_KIND,
        owner: 'xyz.rollforward.app.coap',
        schema: {
            type: 'object',
            properties: {
                _id: { type: 'string' },
                sensorId: { type: 'string' },
                sensorNm: {type: 'string'},
                sensorType: { type: 'string' },
                description: { type: 'string' },
                timestamp: { type: 'string' },
                sensorValue: { type: 'number' },
                unit: {type: 'string'},
            },
            required: ['sensorId', 'sensorType', 'timestamp', 'sensorValue']
        },
        indexes: [
            { name: 'sensorId', props: [{ name: 'sensorId' }] },
            { name: 'sensorType', props: [{ name: 'sensorType' }] },
            { name: 'timestamp', props: [{ name: 'timestamp' }] }
        ]
    };

    service.call('luna://com.webos.service.db/putKind', kindData, (response) => {
        console.log(response)
        if (response.payload.returnValue) {
            message.respond({ success: true, message: 'Kind created successfully' });
        } else {
            message.respond({ success: false, message: 'Failed to create kind', error: response.error });
        }
    });
});

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

// 센서 데이터 저장 함수
function storeSensorData(sensorData) {
    const dataToStore = {
        _kind: DB_KIND,
        sensorId: sensorData.sensorId,
        sensorNm: sensorData.sensorNm,
        sensorType: sensorData.sensorType,
        description: sensorData.description,
        sensorValue: sensorData.sensorValue,
        unit: "%",
        timestamp: new Date().toISOString()
    };

    service.call('luna://com.webos.service.db/put', { objects: [dataToStore] }, (response) => {
        if (response.payload.returnValue) {
            console.log('Sensor data stored successfully:', response.payload.results[0].id);
        } else {
            console.error('Failed to store sensor data:', response.error);
        }
    });
}

// 서비스 메소드: CoAP 메시지 전송 시작
service.register("startSending", (msg) => {
    if (!interval) {
        interval = setInterval(() => sendCoapMessageAndStore(msg.payload.ip), 5000);
        msg.respond({
            returnValue: true,
            message: "Started sending CoAP messages and storing data"
        });
    } else {
        msg.respond({
            returnValue: false,
            message: "Already sending CoAP messages and storing data"
        });
    }
});

// 서비스 메소드: CoAP 메시지 전송 중지
service.register("stopSending", (msg) => {
    if (interval) {
        clearInterval(interval);
        interval = null;
        msg.respond({
            returnValue: true,
            message: "Stopped sending CoAP messages and storing data"
        });
    } else {
        msg.respond({
            returnValue: false,
            message: "Not currently sending CoAP messages"
        });
    }
});

// 센서 데이터 조회
service.register('read', function(message) {
    const query = {
        from: DB_KIND,
        where: []
    };

    if (message.payload.sensorId) {
        query.where.push({ prop: 'sensorId', op: '=', val: message.payload.sensorId });
    }
    if (message.payload.sensorType) {
        query.where.push({ prop: 'sensorType', op: '=', val: message.payload.sensorType });
    }
    if (message.payload.fromTimestamp && message.payload.toTimestamp) {
        query.where.push({ prop: 'timestamp', op: '>=', val: message.payload.fromTimestamp });
        query.where.push({ prop: 'timestamp', op: '<=', val: message.payload.toTimestamp });
    }

    service.call('luna://com.webos.service.db/find', { query: query }, (response) => {
        console.log(response);
        if (response.payload.returnValue) {
            message.respond({ success: true, results: response.payload.results });
        } else {
            message.respond({ success: false, error: response.error });
        }
    });
});