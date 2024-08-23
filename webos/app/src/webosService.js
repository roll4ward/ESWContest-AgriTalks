/* global WebOSServiceBridge */
// webosService.js
function createBridge() {
  return typeof WebOSServiceBridge !== "undefined"
    ? new WebOSServiceBridge()
    : {
        call: (service, params) => {
          console.log(`Mock call to ${service} with params: ${params}`);
          return Promise.resolve({
            success: true,
            result: `Mock response for service: ${service}`,
          });
        },
      };
}

function callService(bridge, service, params) {
  return new Promise((resolve, reject) => {
    if (bridge.onservicecallback) {
      bridge.onservicecallback = function (msg) {
        try {
          console.log("Raw response received:", msg);
          const response = JSON.parse(msg);
          console.log("Parsed response:", response);

          if (response.returnValue) {
            resolve({
              success: true,
              result: response.result || "No result provided by AI.",
            });
          } else {
            console.error("Service returned an error:", response.errorText);
            reject({
              success: false,
              error: response.errorText || "Unknown error occurred.",
            });
          }
        } catch (error) {
          console.error("Error parsing response:", error);
          reject({
            success: false,
            error: `Error parsing response: ${error.message}`,
          });
        }
      };
    } else {
      reject({
        success: false,
        error: "onservicecallback is not available in this environment.",
      });
    }

    try {
      console.log("Calling service with params:", params);
      bridge.call(service, params);
    } catch (error) {
      console.error("Service call failed:", error);
      reject({
        success: false,
        error: `Service call failed: ${error.message}`,
      });
    }
  });
}

module.exports = {
  createBridge,
  callService,
};
