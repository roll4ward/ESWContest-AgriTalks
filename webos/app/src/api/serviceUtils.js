/**
 * 서비스와 메소드에 매칭되는 URL을 생성
 * @param {string} service 
 * @param {string} method 
 * @returns {string} 서비스의 URL
 */
export const getServiceURL = (baseURL, service, method) => `${baseURL}.${service}/${method}`;

/**
 * WebOSServiceBridge를 사용하여 서비스를 호출하는 함수
 * @param {string} service 서비스 이름
 * @param {string} method 메소드 이름
 * @param {Object} [params={}] 파라미터 객체
 * @param {Function} callback 결과를 처리할 콜백 함수
 */
export function callService(baseURL, service, method, params = {}, callback) {
    const bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        const response = JSON.parse(msg);
        if (!response.returnValue) {
            console.error(`${service}/${method} Service call failed:`, response.result);
            if (callback) callback(null, new Error(response.result));
            return;
        }
        if (callback) callback(response.result);
    };
    bridge.call(getServiceURL(baseURL, service, method), JSON.stringify(params));
}