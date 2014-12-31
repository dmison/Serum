console.log('conentxcript');

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('got message');
  if (request.method === 'getSelection')
    sendResponse({
      quote: window.getSelection().toString(),
      title: document.title.toString(),
      url: document.location.toString()
    });
  else
    sendResponse({}); // snub them.
});
