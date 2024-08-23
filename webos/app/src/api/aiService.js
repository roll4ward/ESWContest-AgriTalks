/* global WebOSServiceBridge */
let bridge;

function getBridge() {
  if (!bridge) {
    bridge = new WebOSServiceBridge();
  }
  return bridge;
}

export function sendMessageToWebOS(prompt, dryRun = false, images = []) {
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

    const service = "luna://xyz.rollforward.app.aitalk/talk";

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
        dryRun: dryRun,
        images: images,
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
