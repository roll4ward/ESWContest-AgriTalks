const pkg_info = require("./package.json");
const config = require("./config.json")
const fs = require("fs");
const { exec } = require("child_process");

const { aitalk_response, api_ask_parameters, error } = require("./dto");
const CONVESKIND =  "xyz.rollforward.app.aitalk:1";
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

  if (msg.payload.image_path) {
    const img_file = await openai.files.create({
      file: fs.createReadStream(msg.payload.image_path),
      purpose: "assistants"
    })
    const threadMessages = await openai.beta.threads.messages.create(
      thread.id, 
      { 
        role: "user", 
        content: [
          {
            "type": "text",
            "text": prompt  
          },
          {
            "type": "image_file",
            "image_file": {"file_id": img_file.id}
          },
        ]
      });
  } else {
    const threadMessages = await openai.beta.threads.messages.create(
      thread.id, 
      { 
        role: "user", 
        content: prompt 
      });
  }

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

aitalk_service.register("tts", async function (msg) {
  // 0. check msg contains "tts"

  console.log(msg);

  if (!("text" in msg.payload)) {
    msg.respond(new error('It requires text (e.g. {text: "Hello world"}).'));
    return;
  }

  const mp3 = await openai.audio.speech.create({
    model: config.openai_tts.model,
    voice: config.openai_tts.voice,
    input: msg.payload.text,
    response_format: "pcm",
  });

  console.log("audio file will be stored to " + config.store_path);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(config.store_path, buffer);
  console.log("TTS done.");

  exec("python3 /home/developer/audioCon.py " + config.store_path + " 24000 " + config.store_path + " 32000",(err, stdout, stderr) => {
      if (err) {
        console.error(`Error during conversion: ${stderr}`);
      } else {
        msg.respond(new aitalk_response({ store_path: config.store_path}));
      }
    }
  );
});

aitalk_service.register("ask_stream", async function (msg) {
  if (!("prompt" in msg.payload)) {
    msg.respond(new error("prompt is required."));
    return;
  }
  const prompt = msg.payload.prompt;

  if (thread == null) {
    thread = await openai.beta.threads.create();
  }
  console.log("thread_id", thread.id);
  if (msg.payload.image_path) {
    // 예외 처리 추가

    const img_file = await openai.files.create({
      file: fs.createReadStream(msg.payload.image_path),
      purpose: "assistants"
    })
    const threadMessages = await openai.beta.threads.messages.create(
      thread.id, 
      { 
        role: "user", 
        content: [
          {
            "type": "text",
            "text": prompt  
          },
          {
            "type": "image_file",
            "image_file": {"file_id": img_file.id}
          },
        ]
      });
  } else {
    const threadMessages = await openai.beta.threads.messages.create(
      thread.id, 
      { 
        role: "user", 
        content: prompt 
      });
  }
  await new Promise((resolve, reject) => {
    try {
      const stream = openai.beta.threads.runs.stream(thread.id, {
          assistant_id: config.openai_assistant_id
        })
        .on('textCreated', (text) => {
          console.log(text);
        })
        .on('textDelta', (textDelta, snapshot) => {
          console.log(snapshot);
          msg.respond(new aitalk_response({
              chunks: snapshot,
              is_streaming: true
          }));
        })
        .on('end', () => {
          console.log('\nStream has ended.');
          msg.respond(new aitalk_response({
              chunks: "",
              isStreaming: false
          }));
          resolve();
        });
    } catch (err) {
      console.error(err);
    }
  });
});

// 세션 & 대화 정보 데이터베이스 생성 (임시)
aitalk_service.register('createKind', function (message) {
  const kindData = {
    id: CONVESKIND,
    owner: 'xyz.rollforward.app.aitalk',
    schema: {
        type: 'object',
        properties: {
            _id: { type: 'string' },
            type: { type: 'string' },
            text: { type: 'string' },
            regdate: { type: 'string' }
        },
        required: ['type', 'text', 'regdate']
    },
    indexes: [
        { name: 'type', props: [{ name: 'type' }] },
        { name: 'text', props: [{ name: 'text' }] },
        { name: 'regdate', props: [{ name: 'regdate' }] }
    ]
  };

  aitalk_service.call('luna://com.webos.service.db/putKind', kindData, (response) => {
      if (response.payload.returnValue) {
          message.respond({ returnValue: true });
      } else {
          message.respond({ returnValue: false, result: response.error });
      }
  });
});

// 세션 & 대화 데이터베이스 삭제 (임시)
aitalk_service.register('deleteKind', function(message) {
    aitalk_service.call('luna://com.webos.service.db/delKind', { id: CONVESKIND }, (response) => {
        if (response.payload.returnValue) {
          message.respond({ returnValue: true });
        } else {
            message.respond({ returnValue: false, result: response.error });
        }
    });
});

// 세션 데이터 Create
aitalk_service.register('create', function(message) {
  const dataToStore = {
      _kind: CONVESKIND,
      text: message.payload.text,
      type: message.payload.type,
      regdate: new Date().toISOString()
  };

  if (!dataToStore.type || !dataToStore.text) {
      return message.respond({ returnValue: false, result: 'All fields are required.' });
  } 
  
  aitalk_service.call('luna://com.webos.service.db/put', { objects: [dataToStore] }, (response) => {
      console.log(response);
      if (response.payload.returnValue) {
          message.respond({ returnValue: true, result: response.payload.results[0].id});
      } else {
          message.respond({ returnValue: false, result: response.error});
      }
  });
});

// 세션 데이터 Read
aitalk_service.register('read', function(message) {
  const query  = {
      from: CONVESKIND,
      where: []
  };
  
  aitalk_service.call('luna://com.webos.service.db/find', { query: query }, (response) => {
    if(response.payload.returnValue){
      if (response.payload.results.length > 0) {
          message.respond({ returnValue: true, result: response.payload.results });
      } else {
          message.respond({ returnValue: true, result: null });
      }
    }else{
        message.respond({ returnValue: false, result: 'cannot found conversation' });
    }
  });
});

// 세션 데이터 delete
aitalk_service.register('delete', function(message) {
  const query  = {
      from: CONVESKIND,
      where: []
  };
  
  aitalk_service.call('luna://com.webos.service.db/find', { query: query }, (response) => {
    if(response.payload.returnValue){
      if (response.payload.results.length > 0) {
        const ids = [];

        for (const result of response.payload.results) {
          ids.push(result._id);
        }

        aitalk_service.call('luna://com.webos.service.db/del', { ids: ids }, (response) => {
          if (response.payload.returnValue) {
              message.respond({ returnValue: true, result: 'Item deleted successfully' });
          } else {
              message.respond({ returnValue: false, result: response.error });
          }
        });
      } else {
          message.respond({ returnValue: true, result: null });
      }
    }else{
        message.respond({ returnValue: false, result: 'cannot found conversation' });
    }
  });
});