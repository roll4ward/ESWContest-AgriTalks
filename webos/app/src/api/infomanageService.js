/**
 * 서비스와 메소드에 매칭되는 URL을 생성
 * @param {*} service 
 * @param {*} method 
 * @returns 서비스의 URL
 */
const getServiceURL = (service, method) => `luna://xyz.rollforward.app.${service}/${method}`;
console.log(typeof WebOSServiceBridge);
if (typeof WebOSServiceBridge === "undefined") {
    globalThis.WebOSServiceBridge = function() {
        this.onservicecallback = function(){};
        this.call = (service, params) => {
            this.onservicecallback()
            console.log(`Service ${service} is called : ${params}`);
        }
    }
}

/**
 *   모든 구역을 쿼리
 *   @param { (result : [object])=>void } callback 쿼리한 결과를 처리할 콜백 함수
 */
export function readAllAreas (callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if (!msg.returnValue) {
            console.log(`Service call failed : ${msg.results}`);
            return;
        }
        if (callback) callback(msg.results);
        console.log("callback called", callback);
    };

    bridge.call(getServiceURL("infomanage", "area/read"), "{}");
    console.log(`Service Called ${getServiceURL("infomanage", "area/read")}`);
}

/**
 * 구역의 이름과 설명으로 새로운 구역을 생성
 * @param { string } name 구역의 이름
 * @param { string } description 구역의 설명
 * @param { (result : string)=>void } callback 서비스 호출 후 처리할 콜백 함수
 */
export function createArea (name, description, callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if (!msg.returnValue) {
            console.log(`Service call failed : ${msg.results}`);
            return;
        }

        if (callback) callback(msg.results);
        console.log("callback called", callback);
    };

    let query = {
        name : name,
        desc: description
    }

    bridge.call(getServiceURL("infomanage", "area/create"), JSON.stringify(query));
}

/**
 * 해당 ID를 가진 구역의 이름과 설명을 수정
 * @param { string } areaID 구역의 ID 
 * @param { string } name 구역의 이름
 * @param { string } description 구역의 설명
 * @param { (result : "Item updated successfully")=>void } callback 서비스 호출 후 처리할 콜백 함수
 */
export function updateAreaInfo(areaID, name, description, callback ) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if (!msg.returnValue) {
            console.log(`Service call failed : ${msg.results}`);
            return;
        }

        if (callback) callback(msg.results);
        console.log("callback called", callback);
    };

    let query = {
        id: areaID,
        name : name,
        desc: description
    }

    bridge.call(getServiceURL("infomanage", "area/update"), JSON.stringify(query));
    console.log("call area/update");
}

/**
 * 해당 ID를 가진 구역을 삭제. 구역에 속해있는 기기가 있는 경우 구역이 삭제되지 않음
 * @param { string } areaID 구역의 ID 
 * @param { (result : boolean)=>void } callback 서비스 호출 후 처리할 콜백 함수
 */
export function deleteArea(areaID, callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        console.log(msg);
        if (callback) callback(msg.returnValue);
        console.log("callback called", callback);
    };

    let query = {
        id: areaID
    }

    bridge.call(getServiceURL("infomanage", "area/delete"), JSON.stringify(query));
}

/**
 *  구역의 ID를 사용하여 하위 기기들을 쿼리
 *  @param { string } areaID 구역의 ID
 *  @param { (result : [Object])=>void } callback 쿼리한 결과를 처리할 콜백 함수
 */
export function readDeviceswithArea(areaID, callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if (!msg.returnValue) {
            console.log(`Service call failed : ${msg.results}`);
            return;
        }

        if (callback) callback(msg.results);
        console.log("callback called", callback);
    };

    let query = {
        areaId : areaID
    }

    bridge.call(getServiceURL("infomanage", "device/read"), JSON.stringify(query));
}

/**
 *  기기의 ID를 사용하여 특정 기기를 쿼리
 *  @param { string } deviceID 기기의 ID
 *  @param { (result : Object)=>void } callback 쿼리한 결과를 처리할 콜백 함수
 */
export function readDevicewithID(deviceID, callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        console.log(msg);
        if (!msg.returnValue) {
            console.log(`Service call failed : ${msg.results}`);
            return;
        }

        if (callback) callback(msg.results[0]);
        console.log("callback called", callback, msg);
    };

    let query = {
        id : deviceID
    }

    bridge.call(getServiceURL("infomanage", "device/read"), JSON.stringify(query));
}

/**
 *  기기의 ID배열을 사용하여 기기를 쿼리
 *  @param { [string] } deviceID 기기의 ID
 *  @param { (result : Object)=>void } callback 쿼리한 결과를 처리할 콜백 함수
 */
export function readDevicewithIDs(deviceIDs, callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        console.log(msg);
        if (!msg.returnValue) {
            console.log(`Service call failed : ${msg.results}`);
            return;
        }

        if (callback) callback(msg.results);
        console.log("callback called", callback, msg);
    };

    let query = {
        ids : deviceIDs
    }

    bridge.call(getServiceURL("infomanage", "device/read/ids"), JSON.stringify(query));
}

/**
 * 해당 ID를 가진 기기의 이름과 설명을 수정
 * @param { string } deviceID 기기의 ID 
 * @param { string } name 기기의 이름
 * @param { string } description 기기의 설명
 * @param { (result : "Item updated successfully")=>void } callback 서비스 호출 후 처리할 콜백 함수
 */
export function updateDeviceInfo(deviceID, name, description, callback ) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if (!msg.returnValue) {
            console.log(`Service call failed : ${msg.results}`);
            return;
        }

        if (callback) callback(msg.results);
        console.log("callback called", callback);
    };

    let query = {
        id: deviceID,
        name : name,
        desc: description
    }

    bridge.call(getServiceURL("infomanage", "device/update"), JSON.stringify(query));
}

/**
 * 해당 ID를 가진 기기의 구역을 수정
 * @param { string } deviceID 기기의 ID 
 * @param { string } areaID 구역의 ID 
 * @param { (result : "Item updated successfully")=>void } callback 서비스 호출 후 처리할 콜백 함수
 */
export function updateDeviceParentArea(deviceID, areaID, callback ) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if (!msg.returnValue) {
            console.log(`Service call failed : ${msg.results}`);
            return;
        }

        if (callback) callback(msg.results);
        console.log("callback called", callback);
    };

    let query = {
        id: deviceID,
        areaId: areaID
    }

    bridge.call(getServiceURL("infomanage", "device/update"), JSON.stringify(query));
}

/**
 * 해당 ID를 가진 기기를 삭제
 * @param { string } deviceID 구역의 ID 
 * @param { (result : boolean)=>void } callback 서비스 호출 후 처리할 콜백 함수
 */
export function deleteDevice(deviceID, callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if (callback) callback(msg.returnValue);
        console.log("callback called", callback);
    };

    let query = {
        id: deviceID
    }

    bridge.call(getServiceURL("infomanage", "device/delete"), JSON.stringify(query));
}