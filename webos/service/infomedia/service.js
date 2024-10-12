const pkg_info = require("./package.json");
const Service = require('webos-service');
const { exec } = require("child_process");
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

service.register('image/convertJpg', function(message) {
    exec("python3 /home/developer/imageCon.py",(err, stdout, stderr) => {
        if (err) {
            console.error(`Error during conversion: ${stderr}`);
            message.respond({ returnValue: false, result: stderr });
        } else {
            message.respond({ returnValue: true, result: "success"});
        }
    });
});

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