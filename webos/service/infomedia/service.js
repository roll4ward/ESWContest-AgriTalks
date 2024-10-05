const pkg_info = require("./package.json");
const Service = require('webos-service');

const service = new Service(pkg_info.name);
let cameraHandle = null;
let recorderId = null;

// 저장된 이미지 경로 리스트 전체 쿼리
service.register('image/readAll', function(message) {
    service.call('luna://com.webos.service.mediaindexer/requestMediaScan', {"path": "/media/multimedia"}, (Rresponse) => {
        if (Rresponse.payload.returnValue) {
            service.call('luna://com.webos.service.mediaindexer/getImageList', {}, (Iresponse) => {
                if (Iresponse.payload.returnValue) {
                    message.respond({ returnValue: true, result:Iresponse.payload.imageList.results});
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
function initCamera(){
    service.call('luna://com.webos.service.camera2/getCameraList', {}, (Cresponse) => {
        console.log("initCamera 실행");
        if (Cresponse.payload.returnValue) {
            if (Cresponse.payload.deviceList.length > 0){
                const Hquery = coap.request({
                    id: Cresponse.payload.deviceList[0].id,
                    appId: "xyz.rollforward.app",
                    mode: 'primary'
                });

                service.call('luna://com.webos.service.camera2/open', Hquery, (Hresponse) => {
                    if (Hresponse.payload.returnValue && Hresponse.payload.deviceList.length > 0) {
                        cameraHandle = Hresponse.payload.handle;
                        const Fquery = coap.request({
                            handle: cameraHandle,
                            params: {
                                width: 1920,
                                height: 1080,
                                format: "JPEG",
                                fps: 30
                            }
                        });
                        service.call('luna://com.webos.service.camera2/setFormat', Fquery, (Fresponse) => {
                            console.log(Fresponse);
                            if (Fresponse.payload.returnValue) {
                                console.log("camera Setting Success");
                            }else{
                                console.log("camera Setting Fail");
                            }
                        });
                    }else{
                        console.log("there is no camera1");
                    }
                });
            }else{
                console.log("there is no camera2");
            }
        }else{
            console.log("fail init camera");
        }
    });
}
initCamera();

service.register('camera/startPreview', function(message) {
    if (!cameraHandle) {
        return message.respond({ returnValue: false, errorText: "Camera not initialized" });
    }

    const query = {
        handle: cameraHandle,
        params: {
            type:"sharedmemory",
            "source":"0"
        },
        windowId: "_Window_Id_1"
    };

    service.call('luna://com.webos.service.camera2/startPreview', query, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, result:{key:response.payload.key, mediaId:response.payload.mediaId} });
        } else {
            message.respond({ returnValue: false, result: response.payload.errorText });
        }
    });
});

// 카메라 미리보기 종료 서비스
service.register('camera/stopPreview', function(message) {
    if (!cameraHandle) {
        return message.respond({ returnValue: false, result: "Preview not started" });
    }

    const query = {
        handle: cameraHandle
    };

    service.call('luna://com.webos.service.camera2/stopPreview', query, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true });
        } else {
            message.respond({ returnValue: false, result: response.payload.errorText });
        }
    });
});

// 정지영상 촬영 및 저장 서비스
service.register('camera/captureImage', function(message) {
    if (!cameraHandle) {
        return message.respond({ returnValue: false, result: "Camera not initialized" });
    }
    const filepath = '/media/multimedia/images/';

    const query = {
        handle: cameraHandle,
        params: {
            width: 1920,
            height: 1080,
            format: "JPEG",
            mode: "MODE_ONESHOT"
        },
        path: filepath
    };

    service.call('luna://com.webos.service.camera2/startCapture', query, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, result: filepath });
        } else {
            message.respond({ returnValue: false, result: response.payload.errorText });
        }
    });
});

// record 객체 초기화 함수
function initRecord(){
    service.call('luna://com.webos.service.audio/listSupportedDevices', {}, (response) => {
        if (response.payload.returnValue) {
            service.call('luna://com.webos.service.mediarecorder/open', {audio: true}, (response) => {
                if (response.payload.returnValue) {
                    recorderId = response.payload.recorderId;
                    console.log(recorderId);

                    const fomat = {
                        recorderId: recorderId,
                        codec:"AAC",
                        bitRate:192000,
                        sampleRate:48000,
                        channelCount:2
                    }
                    service.call('luna://com.webos.service.mediarecorder/setAudioFormat', fomat, (response) => {
                        console.log(response);
                        if (response.payload.returnValue) {
                            console.log("Setting format success");
                        }
                    });

                    const output = {
                        recorderId: recorderId,
                        path : "/media/internal/"
                    }
                    service.call('luna://com.webos.service.mediarecorder/setOutputFile', output, (response) => {
                        console.log(response);
                        if (response.payload.returnValue) {
                            console.log("Setting output path success");
                        }
                    });

                    const outputFomat = {
                        recorderId: recorderId,
                        format:"M4A"
                    }
                    service.call('luna://com.webos.service.mediarecorder/setOutputFormat', outputFomat, (response) => {
                        console.log(response);
                        if (response.payload.returnValue) {
                            console.log("Setting format M4A success");
                        }
                    });
                }
            });
        }
        else{
            console.log("Does not support audio input.")
        }
    });
}

initRecord();

// 녹음 시작 서비스
service.register('record/start', function(message) {
    if (!recorderId) {
        return message.respond({ returnValue: false, result: "Recorder not initialized" });
    }

    service.call('luna://com.webos.service.mediarecorder/start', {recorderId: recorderId}, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, result: "Start recording..." });
        } else {
            message.respond({ returnValue: false, result: response.payload.errorText });
        }
    });
});

// 녹음 종료 서비스
service.register('record/stop', function(message) {
    if (!recorderId) {
        return message.respond({ returnValue: false, result: "Recorder not initialized" });
    }

    service.call('luna://com.webos.service.mediarecorder/stop', {recorderId: recorderId}, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, result: response.payload.path });
        } else {
            message.respond({ returnValue: false, result: response.payload.errorText });
        }
    });
});

// 녹음 중지 서비스
service.register('record/pause', function(message) {
    if (!recorderId) {
        return message.respond({ returnValue: false, result: "Recorder not initialized" });
    }

    service.call('luna://com.webos.service.mediarecorder/pause', {recorderId: recorderId}, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, result: "Stop recording" });
        } else {
            message.respond({ returnValue: false, result: response.payload.errorText });
        }
    });
});

// 녹음 재개 서비스
service.register('record/resume', function(message) {
    if (!recorderId) {
        return message.respond({ returnValue: false, result: "Recorder not initialized" });
    }

    service.call('luna://com.webos.service.mediarecorder/resume', {recorderId: recorderId}, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, result: "Restart recording" });
        } else {
            message.respond({ returnValue: false, result: response.payload.errorText });
        }
    });
});

// 녹음 중단 서비스
service.register('record/stop', function(message) {
    if (!recorderId) {
        return message.respond({ returnValue: false, result: "Recorder not initialized" });
    }

    service.call('luna://com.webos.service.mediarecorder/stop', {recorderId: recorderId}, (response) => {
        if (response.payload.returnValue) {
            message.respond({ returnValue: true, result: "Exit record" });
        } else {
            message.respond({ returnValue: false, result: response.payload.errorText });
        }
    });
});