
chrome.browserAction.onClicked.addListener(function(tab) {
  console.log('sending message');
    chrome.tabs.sendRequest(
      tab.id,
      {method: "getSelection"},
      function(response){
        sendServiceRequest(response.data);
      });
});
