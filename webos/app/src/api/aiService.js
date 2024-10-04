/**
 * 서비스와 메소드에 매칭되는 URL을 생성
 * @param {*} service 
 * @param {*} method 
 * @returns 서비스의 URL
 */
const getServiceURL = (service, method) => `luna://xyz.rollforward.app.${service}/${method}`;

/**
 * ai에게 질문을 함
 * @param {string} prompt 질문할 text
 * @param {*} callback 쿼리한 결과를 처리할 콜백 함수
 */
export function askToAi(prompt, callback) {
  let bridge = new WebOSServiceBridge();
  bridge.onservicecallback = (msg) => {
      msg = JSON.parse(msg);
      if(!msg.returnValue) {
          console.log(`ask Service call failed : ${msg.result}`);
          return;
      }
  
      if(callback) callback(msg.result);
  }

  let query = {
    prompt: prompt
  };

  bridge.call(getServiceURL("aitalk", "ask"), JSON.stringify(query));
}

/**
 * ai에게 스트림으로 질문을 함
 * @param {string} prompt 질문할 text
 * @param {*} callback 쿼리한 결과를 처리할 콜백 함수
 */
export function askToAiStream(prompt, callback) {
  let bridge = new WebOSServiceBridge();
  bridge.onservicecallback = (msg) => {
      msg = JSON.parse(msg);
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

      if(callback) callback();
  }

  let query = {
    text: text
  };

  bridge.call(getServiceURL("aitalk", "tts"), JSON.stringify(query));
}

/**
 * text를 음성파일 PCM으로 변환하고 자동으로 저장
 */
export function speak() {
  let bridge = new WebOSServiceBridge();
  bridge.onservicecallback = (msg) => {
      msg = JSON.parse(msg);
      if(!msg.returnValue) {
          console.log(`speak Service call failed : ${msg.result}`);
          return;
      }
  }

  const service = "luna://com.webos.service.audio/playSound";
  let query = {
    fileName: "/home/developer/media/tts.pcm",
    sink: "default2",
    sampleRate: 32000,
    format: "PA_SAMPLE_S16LE",
    channels: 1
  };

  bridge.call(service, JSON.stringify(query));
}

/**
 * text로 새로운 대화를 생성
 * @param { string } text 대화내용 이름
 * @param { string } type user or ai
 */
export function createConversation(text, type) {
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
      type : type
  }
  bridge.call(getServiceURL("aitalk", "create"), JSON.stringify(query));
}

/**
 * 모든 대화내용을 쿼리
 * @param { (result : string)=>void } callback 서비스 호출 후 처리할 콜백 함수
 */
export function readAllConversation (callback) {
  let bridge = new WebOSServiceBridge();
  bridge.onservicecallback = (msg) => {
      msg = JSON.parse(msg);
      if (!msg.returnValue) {
          console.log(`Service call failed : ${msg.result}`);
          return null;
      }
      if (callback) callback(msg.result);
  };

  bridge.call(getServiceURL("aitalk", "read"), "{}");
}

/**
 * 모든 대화내용을 삭제
 * @param { (result : string)=>void } callback 서비스 호출 후 처리할 콜백 함수
 */
export function deleteAllConversation (callback) {
  let bridge = new WebOSServiceBridge();
  bridge.onservicecallback = (msg) => {
      msg = JSON.parse(msg);
      if (!msg.returnValue) {
          console.log(`Service call failed : ${msg.result}`);
          return;
      }
      if (callback) callback(msg.result);
      console.log("callback called", callback);
  };

  bridge.call(getServiceURL("aitalk", "delete"), "{}");
}