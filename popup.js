var git_url = '';
var drafts_dir = '';
var token = '';

var today = new Date();
var date = today.getFullYear()+'-'+today.getMonth()+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes();

var post = {
  title: '',
  body: ''
}

$( document ).ready(function() {
  $('#postbutton').click(postArticle);
});

var postArticle = function(){

  //var content = window.btoa($('#quote').val());
  var content = window.btoa(unescape(encodeURIComponent($('#quote').val())))


  var base = 'https://api.github.com';
  var url = base+'/repos/dmison/dmison.github.com/contents/'+drafts_dir+'/testfile.markdown';

  var request_object = {
    "message": "adding testfile",
    "content": content
  }
  var request_string = JSON.stringify(request_object);

  url = url+'?access_token='+token
  console.log(url);

  $.ajax({
    type: 'PUT',
    url: url,
    data: request_string,
    dataType: 'json',
    // username: token,
    // password: 'x-oauth-basic',
    contentType: 'application/json',
    success: function( data ) {
      $( '#result' ).html( data );
    }
  });

  // $.post( url, request_string, function( data ) {
  //   $( '#result' ).html( data );
  // });


}

var formatPost = function(quote, title, url){


  body = quote.split('\n').map(function(line){
    return '> '+line;
  }).join('\n');

  body = '---\n'+  'layout: post\n'+'title: '+title+'\n'+ 'date: '+ date+'\n'+  'url: '+url+'\n'+  '---\n'+  '['+title+']('+url+')\n\n'+body;

  return body;
}

document.addEventListener('DOMContentLoaded', function() {
  console.log("go");
  loadSettings(function() {

    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      console.log('sending message');
      chrome.tabs.sendMessage(tabs[0].id, {
        method: 'getSelection'
      }, function(response) {
        var quote = response.quote;
        var title = response.title;
        var url = response.url;

        var body = formatPost(quote, title, url);

        var body_el = document.getElementById('quote');

        body_el.value = body;

      });
    });

    // == //
  });

});


var loadSettings = function(done) {
  chrome.storage.sync.get(["git_url", "drafts_dir", "token"],
    function(item) {
      git_url = item.git_url;
      drafts_dir = item.drafts_dir;
      token = item.token;
      done();
    });
}

var getUserInfo = function(done) {

  var req = new XMLHttpRequest();
  req.open('GET', 'https://api.github.com/user', true);
  req.setRequestHeader('Authorization', 'token ' + token);
  req.onload = function() {
    if (req.status === 200) {
      done(req);
    } else {
      console.log('error: ' + req.status);
    }
  };
  req.send();
}
