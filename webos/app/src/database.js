/* global WebOSServiceBridge */
let bridge;

function getBridge() {
  if (!bridge) {
    bridge = new WebOSServiceBridge();
  }
  return bridge;
}

// 세션 생성 함수
export const createSession = () => {
  return new Promise((resolve, reject) => {
    const bridge = getBridge();
    bridge.call(
      "luna://xyz.rollforward.app.aitalk/session/create",
      {},
      (response) => {
        if (response.returnValue) {
          console.log("Session created successfully:", response.results);
          resolve(response.results); // 생성된 세션 ID 반환
        } else {
          console.error(`Error creating session: ${response.results}`);
          reject(new Error(response.results)); // 에러 발생 시 reject
        }
      }
    );
  });
};

// 대화 생성 함수
export const createConversation = (sessionId, text, type) => {
  return new Promise((resolve, reject) => {
    const bridge = getBridge();
    bridge.call(
      "luna://xyz.rollforward.app.aitalk/conversation/create",
      { id: sessionId, text, type },
      (response) => {
        if (response.returnValue) {
          console.log("Conversation created successfully:", response.results);
          resolve(response.results); // 생성된 대화 ID 반환
        } else {
          console.error(`Error creating conversation: ${response.results}`);
          reject(new Error(response.results)); // 에러 발생 시 reject
        }
      }
    );
  });
};

// 세션 데이터 읽기 함수
export const readSession = (sessionId) => {
  return new Promise((resolve, reject) => {
    const bridge = getBridge();
    bridge.call(
      "luna://xyz.rollforward.app.aitalk/read",
      { id: sessionId },
      (response) => {
        if (response.returnValue) {
          console.log("Session data retrieved successfully:", response.results);
          resolve(response.results); // 세션 데이터 반환
        } else {
          console.error(`Error reading session: ${response.results}`);
          reject(new Error(response.results)); // 에러 발생 시 reject
        }
      }
    );
  });
};

// 대화 삭제 함수
export const deleteConversation = (conversationId) => {
  return new Promise((resolve, reject) => {
    const bridge = getBridge();
    bridge.call(
      "luna://xyz.rollforward.app.aitalk/delete",
      { id: conversationId },
      (response) => {
        if (response.returnValue) {
          console.log("Conversation deleted successfully");
          resolve(response.results);
        } else {
          console.error(`Error deleting conversation: ${response.results}`);
          reject(new Error(response.results)); // 에러 발생 시 reject
        }
      }
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

        if (response.returnValue) {
          resolve({
            success: true,
            result: response.result || "No result provided by DB.",
          });
        } else {
          reject({
            success: false,
            error: response.errorText || "Unknown error occurred.",
          });
        }
      } catch (error) {
        reject({
          success: false,
          error: `Error parsing response: ${error.message}`,
        });
      }
    };
    bridge.call("xyz.rollforward.app.aitalk/createKind", "{}");
    // bridge.call(
    //   "luna://xyz.rollforward.app.aitalk/createKind",
    //   JSON.stringify({}),
    //   (response) => {
    //     console.log("API Response:", response);

    //     if (response.returnValue) {
    //       console.log("Kind 생성 완료");
    //       resolve(true); // 정상적으로 작동된 경우 true 반환
    //     } else {
    //       console.error("Kind 생성:", response.error);
    //       reject(new Error(response.error || "Failed to create Kind")); // 에러 발생 시 reject
    //     }
    //   }
    // );
  });
};

// Kind 삭제 함수
export const deleteKind = () => {
  return new Promise((resolve, reject) => {
    const bridge = getBridge();
    bridge.call(
      "luna://xyz.rollforward.app.aitalk/deleteKind",
      {},
      (response) => {
        if (response.returnValue) {
          console.log("Kind deleted successfully");
          resolve(response);
        } else {
          console.error(`Error deleting kind: ${response.error}`);
          reject(new Error(response.error)); // 에러 발생 시 reject
        }
      }
    );
  });
};
