const pkg_info = require("./package.json");
const Service = require('webos-service');
const { exec } = require("child_process");
const { promisify } = require('util');

const execAsync = promisify(exec);

const service = new Service(pkg_info.name);

// Helpers
const callServiceMethod = (uri, params = {}) => {
  return new Promise((resolve, reject) => {
    service.call(uri, params, (response) => {
      if (response.payload.returnValue) {
        resolve(response.payload);
      } else {
        reject(new Error(response.payload.errorText || 'Unknown error'));
      }
    });
  });
};

// Image handlers
const imageHandlers = {
  async readAll(message) {
    try {
      await callServiceMethod('luna://com.webos.service.mediaindexer/requestMediaScan', { path: "" });
      const response = await callServiceMethod('luna://com.webos.service.mediaindexer/getImageList');
      const images = response.imageList.results.map(image => image.file_path.replace("file://", ""));
      message.respond({ returnValue: true, result: images });
    } catch (error) {
      message.respond({ returnValue: false, result: error.message });
    }
  },

  async convertJpg(message) {
    try {
      await execAsync("python3 ./imageCon.py");
      message.respond({ returnValue: true, result: "success" });
    } catch (error) {
      message.respond({ returnValue: false, result: error.stderr });
    }
  }
};

// Record handlers
const recordHandlers = {
  async init(message) {
    try {
      const { recorderId } = await callServiceMethod('luna://com.webos.service.mediarecorder/open', { audio: true });

      const formatSettings = [
        { method: 'setAudioFormat', params: { codec: "AAC", bitRate: 192000, sampleRate: 48000, channelCount: 2 } },
        { method: 'setOutputFile', params: { path: "/media/internal/" } },
        { method: 'setOutputFormat', params: { format: "M4A" } }
      ];

      for (const setting of formatSettings) {
        await callServiceMethod(`luna://com.webos.service.mediarecorder/${setting.method}`, { recorderId, ...setting.params });
        console.log(`Setting ${setting.method} success`);
      }

      message.respond({ returnValue: true, result: recorderId });
    } catch (error) {
      message.respond({ returnValue: false, result: error.message });
    }
  },

  async start(message) {
    if (!message.payload.recorderId) {
      return message.respond({ returnValue: false, result: "recorderId required" });
    }

    try {
      await callServiceMethod('luna://com.webos.service.mediarecorder/start', { recorderId: message.payload.recorderId });
      message.respond({ returnValue: true, result: "Start recording..." });
    } catch (error) {
      message.respond({ returnValue: false, result: error.message });
    }
  },

  async stop(message) {
    if (!message.payload.recorderId) {
      return message.respond({ returnValue: false, result: "recorderId required" });
    }

    try {
      const response = await callServiceMethod('luna://com.webos.service.mediarecorder/stop', { recorderId: message.payload.recorderId });
      message.respond({ returnValue: true, result: response.path });
    } catch (error) {
      message.respond({ returnValue: false, result: error.message });
    }
  }
};

// Register services
service.register('image/readAll', imageHandlers.readAll);
service.register('image/convertJpg', imageHandlers.convertJpg);
service.register('record/init', recordHandlers.init);
service.register('record/start', recordHandlers.start);
service.register('record/stop', recordHandlers.stop);

module.exports = service;