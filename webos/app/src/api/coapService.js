/**
 * 서비스와 메소드에 매칭되는 URL을 생성
 * @param {*} service 
 * @param {*} method 
 * @returns 서비스의 URL
 */
const getServiceURL = (service, method) => `luna://xyz.rollforward.app.${service}/${method}`;

/**
 * 해당 기기의 모든 측정값을 읽어옴
 * @param {string} deviceID 값을 조회할 기기의 ID
 * @param {*} callback 쿼리한 결과를 처리할 콜백 함수
 */
export function readAllValues(deviceID, callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if(!msg.returnValue) {
            console.log(`Service call failed : ${msg.results}`);
            return;
        }

        if(callback) callback(msg.results);
        console.log("Callback called ", callback);
    }

    let query = {
        deviceId: deviceID
    };

    bridge.call(getServiceURL("coap", "read"), JSON.stringify(query));
}

/**
 * 해당 기기의 가장 최근 측정값을 읽어옴
 * @param {*} deviceID 
 * @param {*} callback 
 */
export function readLatestValue(deviceID, callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if(!msg.returnValue) {
            console.log(`Service call failed : ${msg.results}`);
            return;
        }

        if(callback) callback(msg.results);
        console.log("Callback called ", callback);
    }

    let query = {
        deviceId: deviceID
    };

    bridge.call(getServiceURL("coap", "read/latest"), JSON.stringify(query));
}