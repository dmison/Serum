'use strict';

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.method === 'getSelection'){
    sendResponse({
      quote: window.getSelection().toString(),
      title: document.title.toString(),
      url: document.location.toString(),
      height: window.innerHeight
    });
  }
  else {
    sendResponse({
      quote: '',
      title: '',
      url: ''
    }); // snub them.
  }
});
