const pkg_info = require("./package.json");
const config = require("./config.json")
const fs = require("fs");

const { aitalk_response, api_ask_parameters, error } = require("./dto");

// API URL의 Protocl에 따라 다른 모듈 import
const http = config.api_url.startsWith("https") ? require("https") : require("http");

const Service = require("webos-service");
const OpenAI = require("openai");

const openai = new OpenAI({apiKey: config.openai_api_key});
var thread = null;

const aitalk_service = new Service(pkg_info.name);



// aitalk method
aitalk_service.register("talk", (msg) => { 
  if (!("prompt" in msg.payload)) {
    msg.respond(new error('prompt is required.'));
    return;
  }

  const prompt = msg.payload.prompt;

  if (msg.payload.dryRun === true) {
    msg.respond(new aitalk_response(`AI response on Dry-run mode.\n prompt : ${prompt}`));
    return;
  }

  const req = http.request(
    `${config.api_url}/ask`, 
    {
      method: "POST",
      timeout: 30000,
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
          console.log(data);
          const json = JSON.parse(data);
          console.log("parse json");
          msg.respond(new aitalk_response(json.answer));
          console.log("message sent");
        }
        catch (err) {
          console.log("error occured :", err);
          msg.respond(new error("Json Parsing Error."));
          console.log("message sent")
        }
      })
    }
  );
  
  req.on("timeout", ()=> {
    console.log("timeout");
    msg.respond(new error("API Response Timeout"));
    console.log("message sent");
  });

  console.log("before request");
  req.end(JSON.stringify(new api_ask_parameters(prompt)));
  console.log("after request");
});

aitalk_service.register("hello_api", (message) => {
  console.log("Hello wolrd!");

  message.respond(new aitalk_response("Hello World! hello_api is invoked successfully!"))
});



// aitalk method
aitalk_service.register("talk2", async function(msg) { 
  if (!("prompt" in msg.payload)) {
    msg.respond(new error('prompt is required.'));
    return;
  }

  const prompt = msg.payload.prompt;

  const stream = await openai.completions.create({
    model: "gpt-4o-mini",
    prompt: prompt,
    stream: true,
  });

  let answer = "";
  for await (const chunk of stream) {
    answer += chunk.choices[0].text;
    console.log(answer);
    msg.respond(new aitalk_response(answer));
  }
});

async function ask(msg) {
  if (!("prompt" in msg.payload)) {
    msg.respond(new error('prompt is required.'));
    return;
  }
  const prompt = msg.payload.prompt;

  if (thread == null) {
    thread = await openai.beta.threads.create();    
  } 
  console.log("thread_id", thread.id);

  const threadMessages = await openai.beta.threads.messages.create(
      thread.id,
      { role: "user", content: prompt }
    );

  let run = await openai.beta.threads.runs.createAndPoll(
      thread.id,
      {assistant_id: config.openai_assistant_id}
  );
  const messages = await openai.beta.threads.messages.list(
      run.thread_id
  );

  return messages.data[0].content[0].text.value
}

// aitalk method
aitalk_service.register("ask", async function(msg) { 
  const answer = await ask(msg)
  console.log(answer)

  msg.respond(new aitalk_response(answer));
});

aitalk_service.register("voice_ask", async function(msg) {
  // 0. check msg contains "voice_path"
  if (!("voice_path" in msg.payload)) {
    msg.respond(new error('It requires voice_path (e.g. voice_text.mp3).'));
    return;
  }

  // 1. check is voice file (e.g. mp3) is exist
  // 1.1. if doesn't exist, then raise RuntimeError
  if (!fs.existsSync(msg.payload.voice_path)) {
    msg.respond(new error("File not found. ", msg.payload.voice_path))
    return;
  }

  // 2. send voice file to API servce
  const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(msg.payload.voice_path),
      model: "whisper-1",
  });

  // 3. return text converted from voice file
  const voice_prompt = transcription.text;

  const answer = await ask({payload: {prompt: voice_prompt}});
  
  msg.respond(new aitalk_response({
    voice_prompt: voice_prompt,
    answer: answer,
  }));
  return;
});