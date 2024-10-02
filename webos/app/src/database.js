/* global WebOSServiceBridge */
let bridge;

function getBridge() {
  if (!bridge) {
    bridge = new WebOSServiceBridge();
  }
  return bridge;
}

// 대화 생성 함수
export const createConversation = (text, type) => {
  return new Promise((resolve, reject) => {
    const bridge = getBridge();
    bridge.onservicecallback = function (msg) {
      try {
        const response = JSON.parse(msg);

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
    bridge.call("luna://xyz.rollforward.app.aitalk/create", 
      JSON.stringify({
        text: text,
        type: type
      })
    );
  });
};

// 대화내용 데이터 읽기 함수
export const readConversation = () => {
  return new Promise((resolve, reject) => {
    const bridge = getBridge();
    bridge.onservicecallback = function (msg) {
      try {
        const response = JSON.parse(msg);
        console.log(response);
        if (response.returnValue) {
          resolve({
            success: true,
            result: response.results || [],
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
      JSON.stringify({})
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
    bridge.call("luna://xyz.rollforward.app.aitalk/deleteKind",
      JSON.stringify({
        id: conversationId
      })
    );

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
      JSON.stringify({
        id: conversationId
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
