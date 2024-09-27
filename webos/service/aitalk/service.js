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



// aitalk method
aitalk_service.register("ask", async function(msg) { 
  if (!("prompt" in msg.payload)) 
  {
    msg.respond(new error('prompt is required.'));
    return;
  }
  const prompt = msg.payload.prompt;

  if (thread == null) 
  {
    thread = await openai.beta.threads.create();    
  } 
  console.log("thread_id", thread.id);

  const threadMessages = await openai.beta.threads.messages.create(thread.id, { role: "user", content: prompt });

  let run = await openai.beta.threads.runs.createAndPoll(
      thread.id,
      {assistant_id: config.openai_assistant_id}
  );
  const messages = await openai.beta.threads.messages.list(
      run.thread_id
  );

  msg.respond(new aitalk_response(messages.data[0].content[0].text.value))
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
      model: config.openai_stt_model,
  });

  // 3. return text converted from voice file
  const voice_prompt = transcription.text;

  aitalk_service.call("luna://xyz.rollforward.app.aitalk/ask", {"prompt": voice_prompt}, async function(m2) {
    console.log("This is ask call in voice call service")
    msg.respond(new aitalk_response({
      voice_prompt: voice_prompt,
      answer: m2.payload.result    
    }))
  })
});

aitalk_service.register("stt", async function(msg) {
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
      model: config.openai_stt_model,
  });

  // 3. return text converted from voice file
  const voice_prompt = transcription.text;
  msg.respond(new aitalk_response(
    {voice_prompt: voice_prompt}
  ))
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

  const mp3 = await openai.audio.speech.create({
    model: config.openai_tts.model,
    voice: config.openai_tts.voice,
    input: msg.payload.text,
  });
  console.log("mp3 file will be stored to " + msg.payload.store_path);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(msg.payload.store_path, buffer);
  console.log("TTS done.")

  msg.respond(new aitalk_response({
    store_path: msg.payload.store_path,
  }));
});

aitalk_service.register("ask_stream", async function(msg) {
  if (!("prompt" in msg.payload)) 
  {
    msg.respond(new error('prompt is required.'));
    return;
  }
  const prompt = msg.payload.prompt;

  if (thread == null) 
  {
    thread = await openai.beta.threads.create();    
  } 
  console.log("thread_id", thread.id);

  const threadMessages = await openai.beta.threads.messages.create(thread.id, { role: "user", content: prompt });
  await new Promise((resolve, reject) => {
    try {
      const stream = openai.beta.threads.runs.stream(thread.id, {
        assistant_id: config.openai_assistant_id
      })
      .on('textCreated', (text) => {
        console.log(text)
      })
      .on('textDelta', (textDelta, snapshot) => {
        console.log(snapshot)
        msg.respond(new aitalk_response({
          chunks: snapshot,
          is_streaming: true
        }))
      })
      .on('end', () => {
        console.log('\nStream has ended.');
        resolve();
        msg.respond(new aitalk_response({
          chunks: "",
          isStreaming: false
        }))
      })
    } catch (err) {
      console.error(err)
    }
  })
  
});