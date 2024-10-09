/**
 * 메소드에 매칭되는 URL을 생성
 * @param {*} method 
 * @returns 서비스의 URL
 */
const getServiceURL = (method) => `luna://xyz.rollforward.app.infomanage/${method}`;

if (typeof WebOSServiceBridge === "undefined") {
    globalThis.WebOSServiceBridge = function() {
        this.onservicecallback = function(){};
        this.call = (service, params) => {
            this.onservicecallback()
            console.log(`Service ${service} is called : ${params}`);
        }
    }
}

export function startBLEScan(callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if(!msg.returnValue) {
            console.log(`Service call failed : ${msg.results}`);
            return;
        }
        if(msg.results){
            if(callback) callback(msg.results);
        }
    }

    bridge.call(getServiceURL("newDevice/startScan"), '{"subscribe" : true}');
    console.log("start Scan ", getServiceURL("newDevice/startScan"));
}

export function stopBLEScan(callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if(!msg.returnValue) {
            console.log(`Service call failed : ${msg.results}`);
            return;
        }
        if(msg.results){
            if(callback) callback(msg.results);
        }
    }

    bridge.call(getServiceURL("newDevice/stopScan"), '{}');
}