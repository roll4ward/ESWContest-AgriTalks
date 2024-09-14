const pkg_info = require("./package.json");

const Service = require('webos-service');
const coap_service = new Service(pkg_info.name);

const coap = require('coap');

var interval;

coap_service.register("coap", (message) => {
    console.log("hi");
    console.log(message);

    const name = message.payload.name ? message.payload.name : "COSMOS";

    message.respond({
        returnValue: true,
        Response: "Hello, " + name + "!"
    });
});

function sendCoapMessage(method, hostIP) {
    const req = coap.request({
        host: hostIP,
        port: 5683,
        method: method,
        pathname: 'hello'
    });

    if (method === 'POST') {
        req.write('Hello from Node.js CoAP client!');
    }

    req.on('response', function(res) {
        console.log(`Response from CoAP server (${method}):`, res.payload.toString());
    });

    req.end();
}

// 서비스 메소드: CoAP 메시지 전송 시작
coap_service.register("startSending", (msg) => {
    if (!interval) {
        interval = setInterval(() => sendCoapMessage('GET', msg.payload.ip), 5000);
        msg.respond({
            returnValue: true,
            message: "Started sending CoAP messages"
        });
    } else {
        msg.respond({
            returnValue: false,
            message: "Already sending CoAP messages"
        });
    }
});

// 서비스 메소드: CoAP 메시지 전송 중지
coap_service.register("stopSending", (msg) => {
    if (interval) {
        clearInterval(interval);
        interval = null;
        msg.respond({
            returnValue: true,
            message: "Stopped sending CoAP messages"
        });
    } else {
        msg.respond({
            returnValue: false,
            message: "Not sending CoAP messages"
        });
    }
});