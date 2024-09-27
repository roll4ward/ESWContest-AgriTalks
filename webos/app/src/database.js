/* global WebOSServiceBridge */
let bridge;

function getBridge() {
  if (!bridge) {
    bridge = new WebOSServiceBridge();
  }
  return bridge;
}
let sessionID;

// 세션 생성 함수
export const createSession = () => {
  return new Promise((resolve, reject) => {
    const bridge = getBridge();
    bridge.onservicecallback = function (msg) {
      try {
        const response = JSON.parse(msg);
        console.log(response);
        if (response.returnValue) {
          sessionID = response.results;
          console.log("sessionID", sessionID);
          resolve({
            success: true,
            result: response.results || "No result provided by DB.",
          });
        } else {
          reject({
            success: false,
            error: response.results || "Unknown error occurred.",
          });
        }
      } catch (error) {
        reject({
          success: false,
          error: `Error parsing response: ${error.message}`,
        });
      }
    };
    bridge.call("luna://xyz.rollforward.app.aitalk/session/create", "{}");
  });
};

// 대화 생성 함수
export const createConversation = (sessionId, text, type) => {
  return new Promise((resolve, reject) => {
    const bridge = getBridge();
    bridge.onservicecallback = function (msg) {
      try {
        const response = JSON.parse(msg);
        console.log(response);
        if (response.returnValue) {
          resolve({
            success: true,
            result: response.results || "No result provided by DB.",
          });
        } else {
          reject({
            success: false,
            error: response.results || "Unknown error occurred.",
          });
        }
      } catch (error) {
        reject({
          success: false,
          error: `Error parsing response: ${error.message}`,
        });
      }
    };
    bridge.call("luna://xyz.rollforward.app.aitalk/conversation/create", 
      // 여기서 sessionID는 전역변수임
      JSON.stringify({
        id: sessionID,
        text: text,
        type: type
      })
    );
  });
};

// 세션 데이터 읽기 함수
export const readSession = (sessionId) => {
  return new Promise((resolve, reject) => {
    const bridge = getBridge();
    bridge.onservicecallback = function (msg) {
      try {
        const response = JSON.parse(msg);
        console.log(response);
        if (response.returnValue) {
          resolve({
            success: true,
            result: response.results || "No result provided by DB.",
          });
        } else {
          reject({
            success: false,
            error: response.results || "Unknown error occurred.",
          });
        }
      } catch (error) {
        reject({
          success: false,
          error: `Error parsing response: ${error.message}`,
        });
      }
    };
    bridge.call("luna://xyz.rollforward.app.aitalk/read",
      // 여기서 sessionID는 전역변수임
      JSON.stringify({
        id: sessionID
      })
    );
  });
};

// 대화 삭제 함수
export const deleteConversation = (conversationId) => {
  return new Promise((resolve, reject) => {
    const bridge = getBridge();
    bridge.onservicecallback = function (msg) {
      try {
        const response = JSON.parse(msg);
        console.log(response);
        if (response.returnValue) {
          resolve({
            success: true,
            result: response.results || "No result provided by DB.",
          });
        } else {
          reject({
            success: false,
            error: response.results || "Unknown error occurred.",
          });
        }
      } catch (error) {
        reject({
          success: false,
          error: `Error parsing response: ${error.message}`,
        });
      }
    };
    bridge.call("luna://xyz.rollforward.app.aitalk/delete",
      // 여기서 sessionID는 전역변수임
      JSON.stringify({
        id: sessionID
      })
    );
  });
};

// Kind 생성 함수
export const createKind = () => {
  return new Promise((resolve, reject) => {
    const bridge = getBridge();
    bridge.onservicecallback = function (msg) {
      try {
        const response = JSON.parse(msg);
        console.log(response);
        if (response.returnValue) {
          resolve({
            success: true,
            result: response.results || "No result provided by DB.",
          });
        } else {
          reject({
            success: false,
            error: response.results || "Unknown error occurred.",
          });
        }
      } catch (error) {
        reject({
          success: false,
          error: `Error parsing response: ${error.message}`,
        });
      }
    };
    bridge.call("luna://xyz.rollforward.app.aitalk/createKind", "{}");
  });
};

// Kind 삭제 함수
export const deleteKind = () => {
  return new Promise((resolve, reject) => {
    const bridge = getBridge();
    bridge.onservicecallback = function (msg) {
      try {
        const response = JSON.parse(msg);
        console.log(response);
        if (response.returnValue) {
          resolve({
            success: true,
            result: response.results || "No result provided by DB.",
          });
        } else {
          reject({
            success: false,
            error: response.results || "Unknown error occurred.",
          });
        }
      } catch (error) {
        reject({
          success: false,
          error: `Error parsing response: ${error.message}`,
        });
      }
    };
    bridge.call("luna://xyz.rollforward.app.aitalk/deleteKind", "{}");
  });
};
