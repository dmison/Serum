/*global sendServiceRequest:false */
'use strict';

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    chrome.tabs.create({
      url: 'options.html'
    });
  }
});

chrome.browserAction.onClicked.addListener(function(tab) {
  console.log('sending message');
  chrome.tabs.sendRequest(
    tab.id, {
      method: 'getSelection'
    },
    function(response) {
      sendServiceRequest(response.data);
    });
});
