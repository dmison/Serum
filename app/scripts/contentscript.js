'use strict';

chrome.extension.onMessage.addListener(function(request, sender) {

  let response = {
    quote: '',
    title: '',
    url: ''
  };

  if (request.method === 'getSelection'){
    response = {
      quote: window.getSelection().toString(),
      title: document.title.toString(),
      url: document.location.toString(),
      height: window.innerHeight
    };
  }
  chrome.runtime.sendMessage(response);

});
