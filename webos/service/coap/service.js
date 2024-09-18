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
                name: {type: 'string'},
                type: { type: 'string' },
                desc: { type: 'string' },
                time: { type: 'string' },
                value: { type: 'number' },
                unit: {type: 'string'},
            },
            required: ['name','type', 'time', 'value']
        },
        indexes: [
            { name: 'name', props: [{ name: 'name' }] },
            { name: 'type', props: [{ name: 'type' }] },
            { name: 'time', props: [{ name: 'time' }] }
        ]
    };

    service.call('luna://com.webos.service.db/putKind', kindData, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true});
        } else {
            message.respond({ returnValue: false, error: response.error });
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
        name: sensorData.name,
        type: sensorData.type,
        desc: sensorData.desc,
        value: sensorData.value,
        unit: "%",
        time: new Date().toISOString()
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
        interval = setInterval(() => sendCoapMessageAndStore(msg.payload.ip), msg.payload.interval * 1000);
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

    if (message.payload.name) {
        query.where.push({ prop: 'name', op: '=', val: message.payload.name });
    }
    if (message.payload.type) {
        query.where.push({ prop: 'type', op: '=', val: message.payload.type });
    }
    if (message.payload.fromTime && message.payload.toTime) {
        query.where.push({ prop: 'time', op: '>=', val: message.payload.fromTime });
        query.where.push({ prop: 'time', op: '<=', val: message.payload.toTime });
    }

    service.call('luna://com.webos.service.db/find', { query: query }, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, results: response.payload.results });
        } else {
            message.respond({ returnValue: false, results: response.error });
        }
    });
});