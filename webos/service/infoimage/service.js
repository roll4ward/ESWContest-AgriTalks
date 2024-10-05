const pkg_info = require("./package.json");
const Service = require('webos-service');

const service = new Service(pkg_info.name);

// 저장된 이미지 경로 리스트 전체 쿼리
service.register('readAll', function(message) {
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