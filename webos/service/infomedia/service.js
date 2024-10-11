const pkg_info = require("./package.json");
const Service = require('webos-service');

const service = new Service(pkg_info.name);

// 저장된 이미지 경로 리스트 전체 쿼리
service.register('image/readAll', function(message) {
    service.call('luna://com.webos.service.mediaindexer/requestMediaScan', {"path": ""}, (Rresponse) => {
        if (Rresponse.payload.returnValue) {
            service.call('luna://com.webos.service.mediaindexer/getImageList', {}, (Iresponse) => {
                let images = Iresponse.payload.imageList.results.map(image =>{
                    return(image.file_path.replace("file://",""));
                });

                if (Iresponse.payload.returnValue) {
                    message.respond({ returnValue: true, result:images});
                } else {
                    message.respond({ returnValue: false, result: Iresponse.errorText });
                }
            });
        } else {
            message.respond({ returnValue: false, result: Rresponse.errorText });
        }
    });
});

// 카메라는 두번 등록되면 안됨 따라서 서비스에서 한번 호출하고 handle을 계속 global하게 가지고있게 하기 위함
service.register('camera/init', function(message) {
    const query = {
        id: "camera1",
        appId: "xyz.rollforward.app"
    };

    service.call('luna://com.webos.service.camera2/open', query, (Aresponse) => {
        if (Aresponse.payload.returnValue) {
            const filepath = '/media/multimedia/';
            const Bquery = {
                handle: Aresponse.payload.handle,
                params: {
                    width: 1920,
                    height: 1080,
                    format: "JPEG",
                    mode: "MODE_ONESHOT"
                },
                path: filepath
            };
            
            service.call('luna://com.webos.service.camera2/startCapture', Bquery, (Bresponse) => {
                if (Bresponse.payload.returnValue) {
                    service.call('luna://com.webos.service.camera2/close', {handle: Aresponse.payload.handle}, (Cresponse) => {
                        console.log(Cresponse);
                        message.respond({ returnValue: true, result: filepath });
                    });
                } else {
                    message.respond({ returnValue: false, result: Bresponse.payload.errorText });
                }
            });
        }else{
            message.respond({ returnValue: false, result: "there is no camera1" });
        }
    });
});

// service.register('camera/startCamera', function(message) {
//     if (!message.payload.cameraHandle) {
//         return message.respond({ returnValue: false, result: "cameraHandle required" });
//     }

//     const query = {
//         handle: Number(message.payload.cameraHandle),
//         params: {
//             type: "sharedmemory",
//             source: "0"
//         }
//     };

//     service.call('luna://com.webos.service.camera2/startCamera', query, (response) => {
//         console.log(response);
//         if (response.payload.returnValue) {
//             message.respond({ returnValue: true, result: response.payload.key });
//         } else {
//             message.respond({ returnValue: false, result: response.payload.errorText });
//         }
//     });
// });

// // 카메라 미리보기 종료 서비스
// service.register('camera/stopCamera', function(message) {
//     if (!message.payload.cameraHandle) {
//         return message.respond({ returnValue: false, result: "cameraHandle required" });
//     }

//     const query = {
//         handle: Number(message.payload.cameraHandle)
//     };

//     service.call('luna://com.webos.service.camera2/stopCamera', query, (response) => {
//         if (response.payload.returnValue) {
//             message.respond({ returnValue: true });
//         } else {
//             message.respond({ returnValue: false, result: response.payload.errorText });
//         }
//     });
// });

// // 정지영상 촬영 및 저장 서비스
// service.register('camera/captureImage', function(message) {
//     if (!message.payload.cameraHandle) {
//         return message.respond({ returnValue: false, result: "cameraHandle required" });
//     }
//     const filepath = '/media/multimedia/';

//     const query = {
//         handle: Number(message.payload.cameraHandle),
//         params: {
//             width: 1920,
//             height: 1080,
//             format: "JPEG",
//             mode: "MODE_ONESHOT"
//         },
//         path: filepath
//     };

//     service.call('luna://com.webos.service.camera2/startCapture', query, (response) => {
//         if (response.payload.returnValue) {
//             message.respond({ returnValue: true, result: filepath });
//         } else {
//             message.respond({ returnValue: false, result: response.payload.errorText });
//         }
//     });
// });

// record 객체 초기화 함수
service.register('record/init', function(message) {
    service.call('luna://com.webos.service.audio/listSupportedDevices', {}, (response) => {
        if (response.payload.returnValue) {
            service.call('luna://com.webos.service.mediarecorder/open', {audio: true}, (response) => {
                if (response.payload.returnValue) {
                    const recorderId = response.payload.recorderId;

                    const fomat = {
                        recorderId: recorderId,
                        codec:"AAC",
                        bitRate:192000,
                        sampleRate:48000,
                        channelCount:2
                    }
                    service.call('luna://com.webos.service.mediarecorder/setAudioFormat', fomat, (response) => {
                        if (response.payload.returnValue) {
                            console.log("Setting format success");
                        }
                    });

                    const output = {
                        recorderId: recorderId,
                        path : "/media/internal/"
                    }
                    service.call('luna://com.webos.service.mediarecorder/setOutputFile', output, (response) => {
                        if (response.payload.returnValue) {
                            console.log("Setting output path success");
                        }
                    });

                    const outputFomat = {
                        recorderId: recorderId,
                        format:"M4A"
                    }
                    service.call('luna://com.webos.service.mediarecorder/setOutputFormat', outputFomat, (response) => {
                        if (response.payload.returnValue) {
                            console.log("Setting format M4A success");
                        }
                    });
                    message.respond({ returnValue: true, result: recorderId });
                }
            });
        }
        else{
            console.log("Does not support audio input.")
        }
    });
});

// 녹음 시작 서비스
service.register('record/start', function(message) {
    if (!message.payload.recorderId) {
        return message.respond({ returnValue: false, result: "recorderId required" });
    }

    service.call('luna://com.webos.service.mediarecorder/start', {recorderId: message.payload.recorderId}, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, result: "Start recording..." });
        } else {
            message.respond({ returnValue: false, result: response.payload.errorText });
        }
    });
});

// 녹음 종료 서비스
service.register('record/stop', function(message) {
    if (!message.payload.recorderId) {
        return message.respond({ returnValue: false, result: "recorderId required" });
    }

    service.call('luna://com.webos.service.mediarecorder/stop', {recorderId: message.payload.recorderId}, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, result: response.payload.path });
        } else {
            message.respond({ returnValue: false, result: response.payload.errorText });
        }
    });
});

// 녹음 중지 서비스
service.register('record/pause', function(message) {
    if (!message.payload.recorderId) {
        return message.respond({ returnValue: false, result: "recorderId required" });
    }

    service.call('luna://com.webos.service.mediarecorder/pause', {recorderId: message.payload.recorderId}, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, result: "Stop recording" });
        } else {
            message.respond({ returnValue: false, result: response.payload.errorText });
        }
    });
});

// 녹음 재개 서비스
service.register('record/resume', function(message) {
    if (!message.payload.recorderId) {
        return message.respond({ returnValue: false, result: "recorderId required" });
    }

    service.call('luna://com.webos.service.mediarecorder/resume', {recorderId: message.payload.recorderId}, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, result: "Restart recording" });
        } else {
            message.respond({ returnValue: false, result: response.payload.errorText });
        }
    });
});

// 녹음 중단 서비스
service.register('record/stop', function(message) {
    if (!message.payload.recorderId) {
        return message.respond({ returnValue: false, result: "recorderId required" });
    }

    service.call('luna://com.webos.service.mediarecorder/stop', {recorderId: message.payload.recorderId}, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, result: "Exit record" });
        } else {
            message.respond({ returnValue: false, result: response.payload.errorText });
        }
    });
});