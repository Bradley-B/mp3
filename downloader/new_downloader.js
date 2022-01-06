const fs = require('fs');
const ffmetadata = require("ffmetadata");

const { pipeline } = require('stream');
const { promisify } = require('util');
const fetch = require('node-fetch');

const exec = promisify(require("child_process").exec);
const streamPipeline = promisify(pipeline);

const sleep = async ms => await new Promise(r => setTimeout(r, ms));

const downloadSong = async entry => {
  const { id } = entry;
  await exec(`yt-dlp -x --audio-format mp3 -o "./new_songs/temp/%(channel)s-%(title)s.%(ext)s" https://www.youtube.com/watch?v=${id}`);
  return fs.readdirSync('./new_songs/temp/')[0];
}

const applyMetadata = async (filename, entry) => {
  const { artist, title, date, album, id } = entry;
  return new Promise((resolve, reject) => {
    ffmetadata.write(
      `./new_songs/temp/${filename}`,
      { artist, title, album, date },
      { 'id3v1': true, 'id3v2.3': true, attachments: [`./new_songs/artwork/${id}.jpg`] },
      (err) => {
        fs.renameSync(`./new_songs/temp/${filename}`, `./new_songs/${artist} - ${title}.mp3`);
        if (err) reject(err); else resolve();
      }
    );
  });
}

const downloadArtwork = async entry => {
  const { artworkUrl, id } = entry;
  const response = await fetch(artworkUrl);

  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
  await streamPipeline(response.body, fs.createWriteStream(`./new_songs/artwork/${id}.jpg`));
}

module.exports = { sleep, downloadSong, downloadArtwork, applyMetadata };
