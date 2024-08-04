var pkg_info = require("./package.json");
let service_id = pkg_info.name;

var Service = require("webos-service");
var aitalk_service = new Service(service_id);

// ai와 talk 요청 method
aitalk_service.register("talk", (message) => {
  var command = message.payload.command
    ? message.payload.command
    : "No send message...";

  let url = "http://117.16.43.106:8000/ask";

  const result = fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: { prompt: command } }),
  })
    .then((res) => res.json())
    .then((json) => json.answer)
    .catch((e) => "Error: " + e.message);

  message.respond({
    returnValue: true,
    Response: result,
  });
});
