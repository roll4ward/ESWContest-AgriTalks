/**
 * 전달받은 메시지를 Toast로 띄움
 * @param {string} message 전송할 메시지
 */
export function createToast (message) {
    let bridge = new WebOSServiceBridge();
    let param = {
        message: message
    }
    bridge.call("luna://com.webos.notification/createToast", JSON.stringify(param));
    console.log("Create Toast : " , message);
}