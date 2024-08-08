const pkg_info = require("./package.json");
const config = require("./config.json")

const { aitalk_response, api_ask_parameters, error } = require("./dto");

// API URL의 Protocl에 따라 다른 모듈 import
const http = config.api_url.startsWith("https") ? require("https") : require("http");

const Service = require("webos-service");

const aitalk_service = new Service(pkg_info.name);

// aitalk method
aitalk_service.register("talk", (msg) => { 
  if (!("prompt" in msg.payload)) {
    msg.respond(new error('prompt is required.'));
    return;
  }

  const prompt = msg.payload.prompt;

  const req = http.request(
    `${config.api_url}/ask`, 
    {
      method: "POST",
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      }
    },
    (res) => {
      let data = "";

      res.on("data", (chunk) => {
        console.log("data arrived");
        data += chunk;
        }
      );

      res.on("end", () => {
        console.log("end event");
        try {
          const json = JSON.parse(data);
          console.log("parse json");
          msg.respond(new aitalk_response(json.answer));
          console.log("message sent");
        }
        catch (err) {
          console.log("error occured");
          msg.respond(new error("Json Parsing Error."));
          console.log("message sent")
        }
      })
    }
  );
  
  req.on("timeout", ()=> {
    console.log("timeout");
    msg.respond(error("API Response Timeout"));
    console.log("message sent");
  });

  console.log("before request");
  req.end(JSON.stringify(new api_ask_parameters(prompt)));
  console.log("after request");
});
