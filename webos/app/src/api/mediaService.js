/**
 * 서비스와 메소드에 매칭되는 URL을 생성
 * @param {*} service 
 * @param {*} method 
 * @returns 서비스의 URL
 */
const getServiceURL = (service, method) => `luna://xyz.rollforward.app.${service}/${method}`;

/**
 * 저장된 이미지 경로 리스트 전체 쿼리
 * @param {*} callback 쿼리한 결과를 처리할 콜백 함수
 */
export function readAllImages(callback) {
  let bridge = new WebOSServiceBridge();
  bridge.onservicecallback = (msg) => {
      msg = JSON.parse(msg);
      if(!msg.returnValue) {
          console.log(`readAllImages Service call failed : ${msg.result}`);
          return;
      }
  
      if(callback) callback(msg.result);
  }
  bridge.call(getServiceURL("infomedia", "image/readAll"), "{}");
}

/**
 * 저장된 이미지 경로에 yuv파일을 jpg로 변환
 * @param {*} callback 쿼리한 결과를 처리할 콜백 함수
 */
export function convertJpg(callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if(!msg.returnValue) {
            console.log(`convertJpg Service call failed : ${msg.result}`);
            return;
        }
    
        if(callback) callback(msg.result);
    }
    bridge.call(getServiceURL("infomedia", "image/convertJpg"), "{}");
  }

/**
 * 녹음기 초기화 * @param {*} callback 녹음 시작 결과를 처리할 콜백 함수
 */
export function initRecord(callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if(!msg.returnValue) {
            console.log(`initRecord Service call failed : ${msg.result}`);
            if(callback) callback("");
            return;
        }
        
        if(callback) callback(msg.result);
    }
    bridge.call(getServiceURL("infomedia", "record/init"), "{}");
}

/**
 * 녹음 시작
 * @param {*} callback 녹음 시작 결과를 처리할 콜백 함수
 */
export function startRecord(id, callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if(!msg.returnValue) {
            console.log(`startRecord Service call failed : ${msg.result}`);
            return;
        }
        
        if(callback) callback(msg.result);
    }
        
    let query = {
        recorderId: id
    };

    bridge.call(getServiceURL("infomedia", "record/start"), JSON.stringify(query));
}

/**
 * 녹음 중단
 * @param {*} callback 녹음 중단 결과를 처리할 콜백 함수
 */
export function stopRecord(id, callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if(!msg.returnValue) {
            console.log(`stopRecord Service call failed : ${msg.result}`);
            return;
        }
        
        if(callback) callback(msg.result);
    }
    
    let query = {
        recorderId: id
    };

    bridge.call(getServiceURL("infomedia", "record/stop"), JSON.stringify(query));
}

