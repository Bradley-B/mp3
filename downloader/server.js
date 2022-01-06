const express = require('express');
const { sleep, downloadSong, downloadArtwork, applyMetadata } = require('./new_downloader');
const app = express();
const port = 30500;

app.use(express.json());

const downloadQueue = [];

app.get('/', (req, res) => {
  res.send('👋');
});

app.post('/',(req, res) => {
  downloadQueue.push(req.body);
  console.log(`added queue item: ${req.body.artist} - ${req.body.title}. New queue size:`, downloadQueue.length);
  res.send('got it');
});

const downloadSongFromQueue = async () => {
  const songItem = downloadQueue[0];
  try {
    await downloadArtwork(songItem);
    const filename = await downloadSong(songItem);
    await applyMetadata(filename, songItem);
    console.log(`finished download for '${songItem.artist} - ${songItem.title}'. New queue size:`, downloadQueue.length);
  } catch (e) {
    console.error(`encountered an error for '${songItem.artist} - ${songItem.title}': `, e);
    await sleep(30000);
  } finally {
    downloadQueue.shift();
  }
}

const run = async () => {
  while (true) {
    if (downloadQueue.length > 0) {
      await downloadSongFromQueue();
    }
    await sleep(5000);
  }
};

run().then(() => console.log('done?')).catch(e => console.log(e));

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});