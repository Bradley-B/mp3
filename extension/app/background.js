(function() {

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const getCurrentSongMetadataFromDom = () => {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ url: '*://music.youtube.com/*' }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'song_metadata_request' }, response => {
          if (response) resolve(response);
          else reject();
        });
      });
    });
  }

  const sendSongInfoHome = metadata => {
    return fetch('http://localhost:30500/', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(metadata)
    });
  }

  const parseRequestBodyToObject = requestBody => {
    return JSON.parse(decodeURIComponent(String.fromCharCode.apply(null,
      new Uint8Array(requestBody.raw[0].bytes))));
  }

  chrome.webRequest.onBeforeRequest.addListener(({ requestBody }) => {
    (async () => {
      console.log(parseRequestBodyToObject(requestBody));
      const videoId = parseRequestBodyToObject(requestBody).videoId;
      await sleep(300);
      const metadata = { ...await getCurrentSongMetadataFromDom(), id: videoId };
      sendSongInfoHome(metadata);
    })();
  }, { urls: ['*://music.youtube.com/youtubei/v1/next?key=*'] }, ['requestBody']);

}());