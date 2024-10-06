const pkg_info = require("./package.json");
const Service = require('webos-service');
const registerAreaMethod = require("./area.js")
const registerDeviceMethod = require("./device.js")
const service = new Service(pkg_info.name);

registerAreaMethod(service);
registerDeviceMethod(service);