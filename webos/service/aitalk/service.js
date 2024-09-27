const pkg_info = require("./package.json");
const config = require("./config.json")
const fs = require("fs");

const { aitalk_response, api_ask_parameters, error } = require("./dto");

// API URL의 Protocl에 따라 다른 모듈 import
const http = config.api_url.startsWith("https") ? require("https") : require("http");

const Service = require("webos-service");
const OpenAI = require("openai");
const path = require("path");

const openai = new OpenAI({apiKey: config.openai_api_key});
var thread = null;

const aitalk_service = new Service(pkg_info.name);



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

async function tts(msg) {
  let speechFile = msg.store_path? msg.store_path: "/tmp/tts.mp3"
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: msg.text,
  });
  console.log("mp3 file will be stored to " + speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
  console.log("TTS done.")
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

aitalk_service.register("tts", async function(msg) {
  // 0. check msg contains "tts"

  console.log(msg)

  if (!("text" in msg.payload)) {
    msg.respond(new error('It requires text (e.g. {text: "Hello world"}).'));
    return;
  }
  if (!("store_path" in msg.payload)) {
    msg.respond(new error('It requires store_path (e.g. {store_path: "/tmp/tts.mp3"}).'));
    return;
  }

  await tts({
    text: msg.payload.text, 
    store_path: msg.payload.store_path
  })
  
  msg.respond(new aitalk_response({
    store_path: msg.payload.store_path,
  }));

  return;
});
