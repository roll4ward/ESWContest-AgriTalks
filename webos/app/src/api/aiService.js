export function sendMessageToWebOS(prompt, dryRun = false, images = []) {
  return new Promise((resolve, reject) => {
    const service = "luna://xyz.rollforward.app.aitalk";

    // 서비스 호출
    webOS.service.request(service, {
      method: "talk",
      parameters: {
        prompt: prompt,
        dryRun: dryRun,
        images: images,
      },
      onSuccess: function (response) {
        // 성공적인 응답 처리
        if (response.returnValue) {
          resolve({ success: true, result: response.result });
        } else {
          reject({ success: false, error: response.errorText });
        }
      },
      onFailure: function (error) {
        // 실패 응답 처리
        reject({
          success: false,
          error: `Service call failed: ${error.message}`,
        });
      },
    });
  });
}
