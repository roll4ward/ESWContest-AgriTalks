/**
 * 메소드에 매칭되는 URL을 생성
 * @param {*} method 
 * @returns 서비스의 URL
 */
const getServiceURL = (method) => `xyz.rollforward.app.infomanage/${method}`;

if (typeof WebOSServiceBridge === "undefined") {
    globalThis.WebOSServiceBridge = function() {
        this.onservicecallback = function(){};
        this.call = (service, params) => {
            this.onservicecallback()
            console.log(`Service ${service} is called : ${params}`);
        }
    }
}

