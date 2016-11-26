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
  var maxHeight = window.screen.availHeight-50;
  var height = maxHeight < 600 ? maxHeight : 600;
  chrome.windows.create({url:'popup.html', height: height, width: 800, type: 'panel'}, (window)=>{
    setTimeout(()=>{
      chrome.tabs.sendMessage(
        tab.id, {
          method: 'getSelection'
        });
    }, 1500);
  });

});
