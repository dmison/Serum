/*global sendServiceRequest:false */
'use strict';

// chrome.runtime.onInstalled.addListener(function (details) {
//   console.log('previousVersion', details.previousVersion);
// });

chrome.browserAction.onClicked.addListener(function(tab) {
  console.log('sending message');
  chrome.tabs.sendRequest(
    tab.id,
  {method: 'getSelection'},
  function(response){
    sendServiceRequest(response.data);
  });
});


// chrome.browserAction.setBadgeText({text: '\'So'});
