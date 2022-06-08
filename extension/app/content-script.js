const titleSelector = '.title.style-scope.ytmusic-player-bar';
const artworkUrlSelector = 'div#song-image > yt-img-shadow#thumbnail > img#img';
const moreMetadataSelector = 'yt-formatted-string.byline.style-scope.ytmusic-player-bar.complex-string';

const trackElementSelector = 'ytmusic-responsive-list-item-renderer.style-scope.ytmusic-shelf-renderer';
const trackNameSelector = 'yt-formatted-string.title.style-scope.ytmusic-responsive-list-item-renderer.complex-string';

const getSongMetadataFromDom = () => {
  const title = document.querySelector(titleSelector).innerText;
  const artworkUrl = document.querySelector(artworkUrlSelector).src;

  const moreMetadataElements = document.querySelector(moreMetadataSelector);
  const metadataSplit = moreMetadataElements.title.split(' • ');
  const artist = metadataSplit[0], album = metadataSplit[1], date = metadataSplit[2];

  return { title, artist, album, date, artworkUrl };
}

const getSongTrackFromDom = (knownTitle) => {
  const tracks = document.querySelectorAll(trackElementSelector);
  const songIndexMap = {};
  [...tracks.entries()].forEach(([key, value]) => {
    const title = value.querySelector(trackNameSelector)?.title;
    if (title !== undefined) {
      songIndexMap[title] = key + 1;
    }
  });
  return { totalTracks: tracks.length, trackNumber: songIndexMap[knownTitle] };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.hasOwnProperty('action') && request.action === 'song_metadata_request') {
    let songMetadata = getSongMetadataFromDom();
    songMetadata = { ...songMetadata, ...getSongTrackFromDom(songMetadata.title) };
    sendResponse(songMetadata);
  } else {
    sendResponse('unknown action');
  }
});
