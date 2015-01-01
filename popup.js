var git_repo = '';
var git_user = '';
var drafts_dir = '';
var token = '';

var today = new moment();

var day = today.format('YYYY-MM-DD');
var date = today.format('YYYY-MM-DD HH:mm');

var title = '';
var quote = '';
var url = '';
var filename='';



$( document ).ready(function() {
  $('#postbutton').click(postArticle);
  $('#optionslink').click(function(){
    window.open(chrome.extension.getURL("options.html"));
  });
});

var postArticle = function(){

  var content = window.btoa(unescape(encodeURIComponent($('#quote').val())))
  filename = document.getElementById('filename').value;

  var base = 'https://api.github.com';
  var url = base+'/repos/'+git_user+'/'+git_repo+'/contents/'+drafts_dir+'/'+filename;

  var request_object = {
    "message": "adding draft: "+title,
    "content": content
  }
  var request_string = JSON.stringify(request_object);

  url = url+'?access_token='+token

  $.ajax({
    type: 'PUT',
    url: url,
    data: request_string,
    dataType: 'json',
    contentType: 'application/json',
    success: function( data ) {
      $( '#result' ).html( data );
    }
  });

}

var formatPost = function(){

  body = quote.split('\n').map(function(line){
    return '> '+line;
  }).join('\n');

  body = '---\n'+  'layout: post\n'+'title: '+title+'\n'+ 'date: '+ date+'\n'+  'url: '+url+'\n'+  '---\n'+  '['+title+']('+url+')\n\n'+body;

  return body;
}

// once the popup had fully loaded get the selection from the page and populate the editor box
document.addEventListener('DOMContentLoaded', function() {

  loadSettings(function() {

    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {

      chrome.tabs.sendMessage(tabs[0].id, {
        method: 'getSelection'
      }, function(response) {
        quote = response.quote;
        title = response.title;
        url = response.url;

        var body = formatPost();

        filename = day+' '+title;
        filename = filename.replace(/\W+/g, '-')+'.markdown'


        var body_el = document.getElementById('quote');
        var filename_el = document.getElementById('filename');

        filename_el.value = filename;
        body_el.value = body;

      });
    });

    // == //
  });

});


var loadSettings = function(done) {
  chrome.storage.sync.get(["git_repo", "git_user", "drafts_dir", "token"],
    function(item) {
      git_repo = item.git_repo;
      git_user = item.git_user;
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
