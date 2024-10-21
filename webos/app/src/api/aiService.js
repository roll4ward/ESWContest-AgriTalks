/**
 * 서비스와 메소드에 매칭되는 URL을 생성
 * @param {*} service 
 * @param {*} method 
 * @returns 서비스의 URL
 */
const getServiceURL = (service, method) => `luna://xyz.rollforward.app.${service}/${method}`;

/**
 * ai에게 스트림으로 질문을 함
 * @param {string} prompt 질문할 text
 * @param {string} image_path 질문할 이미지 경로
 * @param {*} callback 쿼리한 결과를 처리할 콜백 함수
 */
export function askToAiStream(prompt, image_path, callback) {
  let bridge = new WebOSServiceBridge();
  bridge.onservicecallback = (msg) => {
      msg = JSON.parse(msg);
      if(msg.subscribed === false){
        return;
      }
      
      if(!msg.returnValue) {
          console.log(`ask_stream Service call failed : ${msg.result}`);
          return;
      }
  
      if(callback) callback(msg.result);
      
  }

  let query = {
    prompt: prompt,
    subscribe: true
  };

  if(image_path) query.imagePaths = image_path
  
  bridge.call(getServiceURL("aitalk", "ask_stream"), JSON.stringify(query));
}

/**
 * text를 음성파일 PCM으로 변환하고 자동으로 저장
 * @param {string} prompt 변환 할 text
 * @param {*} callback 쿼리한 결과를 처리할 콜백 함수
 */
export function TTS(text, callback) {
  let bridge = new WebOSServiceBridge();
  bridge.onservicecallback = (msg) => {
      msg = JSON.parse(msg);
      if(!msg.returnValue) {
          console.log(`TTS Service call failed : ${msg.result}`);
          return;
      }
      console.log(msg.result);
      if(callback) callback(msg.result.store_path);
  }

  let query = {
    text: text
  };

  bridge.call(getServiceURL("aitalk", "tts"), JSON.stringify(query));
}

/**
 * m4a 음성파일을 text로 변환하고 반환
 * @param {string} prompt 변환 할 음성파일
 * @param {*} callback 결과를 처리할 콜백 함수
 */
export function STT(text, callback) {
  let bridge = new WebOSServiceBridge();
  bridge.onservicecallback = (msg) => {
      msg = JSON.parse(msg);
      if(!msg.returnValue) {
          console.log(`STT Service call failed : ${msg.result}`);
          return;
      }

      if(callback) callback(msg.result.voice_prompt);
  }
  let query = {
    voice_path: text
  };
  bridge.call(getServiceURL("aitalk", "stt"), JSON.stringify(query));
}

/**
 * 음성파일 재생
 * @param {string} ttsFile ttsFile 위치
 * @param {*} callback 결과를 처리할 콜백 함수
 */
export function audioStart(ttsFile, callback) {
  let bridge = new WebOSServiceBridge();
  bridge.onservicecallback = (msg) => {
      msg = JSON.parse(msg);
      if(!msg.returnValue) {
          console.log(`audioStart Service call failed : ${msg.result}`);
          return;
      }
      if(callback) callback(msg.playbackId);
  }

  const service = "luna://com.webos.service.audio/playSound";
  let query = {
    fileName: ttsFile,
    sink: "default1",
    sampleRate: 32000,
    format: "PA_SAMPLE_S16LE",
    channels: 1
  };

  bridge.call(service, JSON.stringify(query));
}

/**
 * 음성파일 종료
 */
export function audioStop(id) {
  let bridge = new WebOSServiceBridge();
  bridge.onservicecallback = (msg) => {
      msg = JSON.parse(msg);
      if(!msg.returnValue) {
          console.log(`speak Service call failed : ${msg.result}`);
          return;
      }
  }

  const service = "luna://com.webos.service.audio/controlPlayback";
  let query = {
    playbackId: id,
    requestType: "stop"
  };

  bridge.call(service, JSON.stringify(query));
}

/**
 *  음성 재생이 멈췄을 때
 */
export function setAudioStopHandler(id, callback) {
  let bridge = new WebOSServiceBridge();
  bridge.onservicecallback = (msg) => {
      msg = JSON.parse(msg);
      if(msg.returnValue && msg.playbackStatus === "stopped") {
          console.log(`Audio Stopped`);
          if (callback) callback();
          bridge.cancel();
          return;
      }
  }

  const service = "luna://com.webos.service.audio/getPlaybackStatus";
  let query = {
    playbackId: id,
    subscribe: true
  };

  bridge.call(service, JSON.stringify(query));
}

/**
 * text로 새로운 대화를 생성
 * @param { string } text 대화내용 이름
 * @param { string } type user or ai
 */
export function createConversation(text, type, image) {
  let bridge = new WebOSServiceBridge();
  bridge.onservicecallback = (msg) => {
      msg = JSON.parse(msg);
      if (!msg.returnValue) {
          console.log(`createConversation Service call failed : ${msg.result}`);
          return;
      }
  };

  let query = {
      text : text,
      type : type,
      image : image
  }
  bridge.call(getServiceURL("aitalk", "create"), JSON.stringify(query));
}

/**
 * 모든 대화내용을 쿼리
 * @param { string } page 이전 쿼리에서 전달받은 next 페이지
 * @param { (result : string)=>void } callback 서비스 호출 후 처리할 콜백 함수
 */
export function readConversation (page, callback) {
  let bridge = new WebOSServiceBridge();
  bridge.onservicecallback = (msg) => {
      msg = JSON.parse(msg);
      if (!msg.returnValue) {
          console.log(`readConversation Service call failed : ${msg.result}`);
          return null;
      }
      if (callback) callback(msg.result);
  };
  
  let query = {};

  if(page) query.page = page;

  bridge.call(getServiceURL("aitalk", "read"), JSON.stringify(query));
}