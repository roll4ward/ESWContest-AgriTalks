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
 * 카메라 미리보기 재생
 * @param {*} callback 미리보기 결과를 처리할 콜백 함수
 */
export function startCameraPreview(callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if(!msg.returnValue) {
            console.log(`startCameraPreview Service call failed : ${msg.result}`);
            return;
        }

        if(callback) callback(msg.result);
    }
    bridge.call(getServiceURL("infomedia", "camera/startPreview"), "{}");
}

/**
 * 카메라 미리보기 정지 함수
 */
export function stopCameraPreview() {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if(!msg.returnValue) {
            console.log(`stopCameraPreview Service call failed : ${msg.result}`);
            return;
        }
    }
    bridge.call(getServiceURL("infomedia", "camera/stopPreview"), "{}");
}

/**
 * 카메라 미리보기 재생
 * @param {*} callback 미리보기 결과를 처리할 콜백 함수
 */
export function captureImage(callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if(!msg.returnValue) {
            console.log(`captureImage Service call failed : ${msg.result}`);
            return;
        }
        
        if(callback) callback(msg.result);
    }
    bridge.call(getServiceURL("infomedia", "camera/captureImage"), "{}");
}


/**
 * 녹음 시작
 * @param {*} callback 녹음 시작 결과를 처리할 콜백 함수
 */
export function startRecord(callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if(!msg.returnValue) {
            console.log(` Service call failed : ${msg.result}`);
            return;
        }
        
        if(callback) callback(msg.result);
    }
    bridge.call(getServiceURL("infomedia", "record/start"), "{}");
}

/**
 * 녹음 중지
 * @param {*} callback 녹음 중지 결과를 처리할 콜백 함수
 */
export function pauseRecord(callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if(!msg.returnValue) {
            console.log(`pauseRecord Service call failed : ${msg.result}`);
            return;
        }
        
        if(callback) callback(msg.result);
    }
    bridge.call(getServiceURL("infomedia", "record/pause"), "{}");
}

/**
 * 녹음 재개
 * @param {*} callback 녹음 재개 결과를 처리할 콜백 함수
 */
export function resumeRecord(callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if(!msg.returnValue) {
            console.log(`resumeRecord Service call failed : ${msg.result}`);
            return;
        }
        
        if(callback) callback(msg.result);
    }
    bridge.call(getServiceURL("infomedia", "record/resume"), "{}");
}

/**
 * 녹음 중단
 * @param {*} callback 녹음 중단 결과를 처리할 콜백 함수
 */
export function stopRecord(callback) {
    let bridge = new WebOSServiceBridge();
    bridge.onservicecallback = (msg) => {
        msg = JSON.parse(msg);
        if(!msg.returnValue) {
            console.log(`stopRecord Service call failed : ${msg.result}`);
            return;
        }
        
        if(callback) callback(msg.result);
    }
    bridge.call(getServiceURL("infomedia", "record/stop"), "{}");
}

