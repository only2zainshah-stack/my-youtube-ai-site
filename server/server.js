// server/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// serve frontend and audio
app.use(express.static(path.join(__dirname, '../public')));
app.use('/audio', express.static(path.join(__dirname, '../downloads/audio')));

// Google TTS client (we'll write credentials.json at deploy time)
const client = new TextToSpeechClient({
  keyFilename: path.join(__dirname, 'credentials.json')
});

app.post('/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).send('No text provided');

    const request = {
      input: { text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' }
    };

    const [response] = await client.synthesizeSpeech(request);
    const audioPath = path.join(__dirname, '../downloads/audio/output.mp3');
    fs.writeFileSync(audioPath, response.audioContent, 'binary');

    res.json({ audioPath: '/audio/output.mp3' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating TTS');
  }
});

app.listen(port, () => {
  console.log('✅ Server running at http://localhost:' + port);
});
