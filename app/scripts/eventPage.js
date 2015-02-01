/*global sendServiceRequest:false */
'use strict';

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    chrome.tabs.create({
      url: 'options.html'
    });
  }

  if (details.reason === 'upgrade') {
    chrome.tabs.create({
      url: 'release_notes.html'
    });
  }
});

chrome.browserAction.onClicked.addListener(function(tab) {

  chrome.tabs.sendRequest(
    tab.id, {
      method: 'getSelection'
    },
    function(response) {
      sendServiceRequest(response.data);
    });
});
