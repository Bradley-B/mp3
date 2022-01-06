const titleSelector = '.title.style-scope.ytmusic-player-bar';
const artworkUrlSelector = 'div#song-image > yt-img-shadow#thumbnail > img#img';
const moreMetadataSelector = 'yt-formatted-string.byline.style-scope.ytmusic-player-bar.complex-string';

const getSongMetadataFromDom = () => {
  const title = document.querySelector(titleSelector).innerText;
  const artworkUrl = document.querySelector(artworkUrlSelector).src;

  const moreMetadataElements = document.querySelector(moreMetadataSelector);
  const metadataSplit = moreMetadataElements.title.split(' • ');
  const artist = metadataSplit[0], album = metadataSplit[1], date = metadataSplit[2];

  return { title, artist, album, date, artworkUrl };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.hasOwnProperty('action') && request.action === 'song_metadata_request') {
    sendResponse(getSongMetadataFromDom());
  } else {
    sendResponse('unknown action');
  }
});
