var pkg_info = require("./package.json");
let service_id = pkg_info.name;

const http = require("https");

var Service = require("webos-service");
var aitalk_service = new Service(service_id);

// ai와 talk 요청 method
aitalk_service.register("talk", (message) => { 
  var command = message.payload.command
    ? message.payload.command
    : "No send message...";

  let url = "https://rollforward.free.beeceptor.com/ask";

  const request = http.request(url, {
    method: "POST",
    timeout: 2000,
    headers: {
      "Content-Type": "application/json",
    }},
    (res)=> {
      let data = "";

      res.on("data", (chunk) => {
        console.log("data arrived");
        data += chunk;
        });

      res.on("end", () => {
        console.log("end event");
        try {
          const json = JSON.parse(data);
          console.log("parse json");
          message.respond({
            returnValue: true,
            Response: json.answer,
          });
          console.log("message sent");
        }
        catch (err) {
          console.log("error occured");
          message.respond({
            returnValue: false,
            errorMessage: "Error occured while parsing JSON",
          });
          console.log("message sent")
        }
      })
    });
  request.on("timeout", ()=> {
    console.log("timeout");
    message.respond({
      returnValue: false,
      errorMessage: "Timeout",
    });
    console.log("message sent");
  });

  console.log("before request");
  request.end(JSON.stringify({ prompt: { prompt: command } }));
  console.log("after request");
});
