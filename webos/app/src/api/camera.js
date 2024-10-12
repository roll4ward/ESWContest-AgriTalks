export function openCamera(isPrimary) {
    return new Promise((res, rej)=>{
        let bridge = new WebOSServiceBridge();
        bridge.onservicecallback = (response) => {
            response = JSON.parse(response);
            if(!response.returnValue) {
                console.log(response);
                rej(`failed to open ${isPrimary ? "primary" : "secondary"}`);
                return;
            }

            res(response.handle);
        }

        const param = {
            id : "camera1"
        }

        if (isPrimary) param["mode"] = "primary";
        
        bridge.call("luna://com.webos.service.camera2/open", JSON.stringify(param));
    })
}

export function closeCamera(handle) {
    return new Promise((res, rej)=>{
        let bridge = new WebOSServiceBridge();
        bridge.onservicecallback = (response) => {
            response = JSON.parse(response);
            if(!response.returnValue) {
                console.log(response);
                rej("failed to close");
                return;
            }

            res();
        }

        const param = {
            handle : handle
        }
        
        bridge.call("luna://com.webos.service.camera2/close", JSON.stringify(param));
    })
}

export function captureCamera(handle) {
    return new Promise((res, rej)=>{
        let bridge = new WebOSServiceBridge();
        bridge.onservicecallback = (response) => {
            response = JSON.parse(response);
            if(!response.returnValue) {
                rej("failed to capture");
                return;
            }

            res();
        }

        const param = {
            handle: handle,
            params: {
             width: 1280,
             height: 720,
             format: "JPEG",
             mode:"MODE_ONESHOT"
            },
            path: "/media/multimedia"
        }
        
        bridge.call("luna://com.webos.service.camera2/startCapture", JSON.stringify(param));
    })
}