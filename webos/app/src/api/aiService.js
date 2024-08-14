// Define a function to send a message to the webOS service
function sendMessageToWebOS(prompt, dryRun = false, images = []) {
  return new Promise((resolve, reject) => {
    const service = "luna://xyz.rollforward.app.aitalk/";
    const bridge = new WebOSServiceBridge(); // Create a WebOSServiceBridge object

    // Register the callback for service responses
    bridge.onservicecallback = function (msg) {
      try {
        const response = JSON.parse(msg);
        if (response.returnValue) {
          resolve({ success: true, result: response.result });
        } else {
          reject({ success: false, error: response.errorText });
        }
      } catch (error) {
        reject({
          success: false,
          error: `Error parsing response: ${error.message}`,
        });
      }
    };

    // Define parameters
    const params = JSON.stringify({
      prompt: prompt,
      dryRun: dryRun,
      images: images,
    });

    // Make the service call
    bridge.call(service, params);
  });
}

// export async function sendMessageToWebOS(prompt, dryRun = false, images = []) {
//   const API_URL = "http://rollforward.xyz:3000";
//   try {
//     const response = await fetch(API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         prompt: prompt,
//         dryRun: dryRun,
//         images: images,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();

//     // 응답 데이터 구조에 맞추기
//     if (data.returnValue) {
//       return { success: true, result: data.result };
//     } else {
//       return { success: false, error: data.errorText };
//     }
//   } catch (error) {
//     return { success: false, error: `API 호출 실패: ${error.message}` };
//   }
// }
