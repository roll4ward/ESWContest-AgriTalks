/* global WebOSServiceBridge */
let bridge;

function getBridge() {
  if (!bridge) {
    bridge = new WebOSServiceBridge();
  }
  return bridge;
}

export const sendMessageToWebOS = (prompt) => {
  return new Promise((resolve, reject) => {
    const bridge =
      typeof WebOSServiceBridge !== "undefined"
        ? getBridge()
        : {
            // 웹OS 환경이 아닐 경우의 더미 객체
            call: (service, params) => {
              console.log(`Mock call to ${service} with params: ${params}`);
              // 더미 응답으로 응답 처리
              resolve({
                success: true,
                result: `Mock response for service: ${service}`,
              });
            },
          };

    if (typeof WebOSServiceBridge === "undefined") {
      console.warn("WebOSServiceBridge is not defined, using mock bridge.");
    }

    const service = "luna://xyz.rollforward.app.aitalk/ask";

    bridge.onservicecallback = function (msg) {
      try {
        const response = JSON.parse(msg);

        if (response.returnValue) {
          resolve({
            success: true,
            result: response.result || "No result provided by AI.",
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

    try {
      const params = JSON.stringify({
        prompt: prompt,
      });

      console.log("Calling service with params:", params);
      bridge.call(service, params); // 실제 호출
    } catch (error) {
      console.error("Service call failed:", error);
      reject({
        success: false,
        error: `Service call failed: ${error.message}`,
      });
    }
  });
}

export const sendMessageToTTS = (text) => {
  return new Promise((resolve, reject) => {
    const bridge =
      typeof WebOSServiceBridge !== "undefined"
        ? getBridge()
        : {
            // 웹OS 환경이 아닐 경우의 더미 객체
            call: (service, params) => {
              console.log(`Mock call to ${service} with params: ${params}`);
              // 더미 응답으로 응답 처리
              resolve({
                success: true,
                result: `Mock response for service: ${service}`,
              });
            },
          };

    if (typeof WebOSServiceBridge === "undefined") {
      console.warn("WebOSServiceBridge is not defined, using mock bridge.");
    }

    const service = "luna://xyz.rollforward.app.aitalk/tts";

    bridge.onservicecallback = function (msg) {
      try {
        const response = JSON.parse(msg);

        if (response.returnValue) {
          resolve({
            success: true,
            result: response.result || "No result provided by AI.",
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

    try {
      const params = JSON.stringify({
        text: text,
      });

      // console.log("Calling service with params:", params);
      bridge.call(service, params); // 실제 호출
    } catch (error) {
      console.error("Service call failed:", error);
      reject({
        success: false,
        error: `Service call failed: ${error.message}`,
      });
    }
  });
};

export async function speak() {
  return new Promise((resolve, reject) => {
    const bridge =
      typeof WebOSServiceBridge !== "undefined"
        ? getBridge()
        : {
            // 웹OS 환경이 아닐 경우의 더미 객체
            call: (service, params) => {
              console.log(`Mock call to ${service} with params: ${params}`);
              // 더미 응답으로 응답 처리
              resolve({
                success: true,
                result: `Mock response for service: ${service}`,
              });
            },
          };

    if (typeof WebOSServiceBridge === "undefined") {
      console.warn("WebOSServiceBridge is not defined, using mock bridge.");
    }

    const service = "luna://com.webos.service.audio/playSound";

    bridge.onservicecallback = function (msg) {
      try {
        const response = JSON.parse(msg);

        if (response.returnValue) {
          resolve({
            success: true,
            result: response.result || "No result provided by AI.",
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

    try {
      const params = JSON.stringify({
        fileName: "/home/developer/media/tts.pcm",
        sink: "default2",
        sampleRate: 32000,
        format: "PA_SAMPLE_S16LE",
        channels: 1,
      });

      console.log("Calling service with params:", params);
      bridge.call(service, params); // 실제 호출
    } catch (error) {
      console.error("Service call failed:", error);
      reject({
        success: false,
        error: `Service call failed: ${error.message}`,
      });
    }
  });
}
// /* global webOS */
// export function sendMessageToWebOS(prompt, dryRun = false, images = []) {
//   return new Promise((resolve, reject) => {
//     // 웹 환경에서는 webOS 객체가 존재하지 않으므로, 이를 확인합니다.
//     if (typeof webOS === "undefined" || typeof webOS.service === "undefined") {
//       reject({
//         success: false,
//         error: "webOS service is not available in this environment.",
//       });
//       return;
//     }

//     const service = "luna://xyz.rollforward.app.aitalk";

//     // 서비스 호출
//     webOS.service.request(service, {
//       method: "talk",
//       parameters: {
//         prompt: prompt,
//         dryRun: dryRun,
//         images: images,
//       },
//       onSuccess: function (response) {
//         if (response.returnValue) {
//           resolve({ success: true, result: response.result });
//         } else {
//           reject({ success: false, error: response.errorText });
//         }
//       },
//       onFailure: function (error) {
//         // 실패 응답 처리
//         reject({
//           success: false,
//           error: `Service call failed: ${error.message}`,
//         });
//       },
//     });
//   });
// }

// export function sendMessageToWebOS(prompt, dryRun = false, images = []) {
//   return new Promise((resolve, reject) => {
//     const service = "luna://xyz.rollforward.app.aitalk";

//     // 서비스 호출

//     webOS.service.request(service, {
//       method: "talk",
//       parameters: {
//         prompt: prompt,
//         dryRun: dryRun,
//         images: images,
//       },
//       onSuccess: function (response) {
//         if (response.returnValue) {
//           resolve({ success: true, result: response.result });
//         } else {
//           reject({ success: false, error: response.errorText });
//         }
//       },
//       onFailure: function (error) {
//         // 실패 응답 처리
//         reject({
//           success: false,
//           error: `Service call failed: ${error.message}`,
//         });
//       },
//     });
//   });
// }

// import WebOSServiceBridge from "@procot/webostv";

// export function sendMessageToWebOS(prompt, dryRun = false, images = []) {
//   return new Promise((resolve, reject) => {
//     if (typeof WebOSServiceBridge === "undefined") {
//       reject({ success: false, error: "WebOSServiceBridge is not defined." });
//       return;
//     }

//     // WebOSServiceBridge가 객체라면 생성자 없이 바로 사용
//     const bridge = WebOSServiceBridge;

//     bridge.onservicecallback = function (msg) {
//       try {
//         const response = JSON.parse(msg);
//         if (response.returnValue) {
//           resolve({ success: true, result: response.result });
//         } else {
//           reject({ success: false, error: response.errorText });
//         }
//       } catch (error) {
//         reject({
//           success: false,
//           error: `Error parsing response: ${error.message}`,
//         });
//       }
//     };

//     const params = JSON.stringify({
//       prompt: prompt,
//       dryRun: dryRun,
//       images: images,
//     });

//     // 서비스 호출
//     bridge.call("luna://xyz.rollforward.app.aitalk/", params);
//   });
// }
