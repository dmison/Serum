/*global $:false */
/*global moment:false */
/*global unescape:false */

'use strict';

var postEditor;

var config = {
  gitRepo: '',
  gitUser: '',
  DraftsDir: '',
  token: '',
  template: ''
}


var postArticle = function() {

  //TODO: check config values first, if any are missing then abort and show error message

  var content = window.btoa(unescape(encodeURIComponent($('#quote').val())));
  var filename = $('#filename').val();

  var base = 'https://api.github.com';
  var url = base + '/repos/' + config.gitUser + '/' + config.gitRepo + '/contents/' + config.DraftsDir + '/' + filename;

  var reqObject = {
    'message': 'adding draft: ' + title,
    'content': content
  };

  var reqString = JSON.stringify(reqObject);

  $('.statusError').hide();
  $('#progress').show();

  url = url + '?access_token=' + config.token;
  $('#progress').show();
  $.ajax({
    type: 'PUT',
    url: url,
    data: reqString,
    dataType: 'json',
    contentType: 'application/json',
    error: function(jqXHR) {
      // display error message
      $('#progress').hide();
      $('#status').text(jqXHR.statusText);
      $('#code').text(jqXHR.status);
      $('#errorMessage').text(jqXHR.responseJSON.message);
      $('.statusError').show();
    },
    success: function() {

      // disable text inputs
      $('#quote').attr('disabled', 'disabled');
      $('#filename').attr('disabled', 'disabled');

      // hide post button and show close
      $('#postButton').hide();
      $('#closeButton').show();

      // display success message
      $('#progress').hide();
      $('.statusSuccess').show();

    }

  });

};

$(document).ready(function() {
  $('#postButton').click(postArticle);
  $('#closeButton').click(function() {
    window.close();
  });
  $('#optionslink').click(function() {
    window.open(chrome.extension.getURL('options.html'));
  });

});



/*

{
'readyState':4,
'responseText':'{\n \'message\': \'Bad credentials\',\n \'documentation_url\': \'https://developer.github.com/v3\'\n}\n',
'responseJSON':{'message':'Bad credentials','documentation_url':'https://developer.github.com/v3'},
'status':401,
'statusText':'Unauthorized'
}

*/


var formatPost = function(post) {
  console.log('formatPost');
  post.quote = post.quote.split('\n').map(function(line) {
    return '> ' + line;
  }).join('\n');

  var postText = post.template;
  postText = postText.replace(/<<title>>/g, post.title);
  postText = postText.replace(/<<date>>/g, post.date);
  postText = postText.replace(/<<time>>/g, post.time);
  postText = postText.replace(/<<url>>/g, post.url);
  postText = postText.replace(/<<quote>>/g, post.quote);
  console.log(postText);

  return postText;
};

var loadSettings = function(done) {
  chrome.storage.sync.get({
      gitUser: '',
      gitRepo: '',
      DraftsDir: '_drafts',
      token: '',
      template: default_template
    },
    function(item) {
      config.gitRepo = item.gitRepo;
      config.gitUser = item.gitUser;
      config.DraftsDir = item.DraftsDir;
      config.token = item.token;
      config.template = item.template;
      done();
    });
};

var createPostFromPage = function() {

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {

    chrome.tabs.sendMessage(tabs[0].id, {
      method: 'getSelection'
    }, function(response) {

      var post = {
        date:'',
        time:'',
        title:'',
        quote:'',
        url:'',
        template: config.template,
        filename:''
      }

      var today = new moment();
      post.date = today.format('YYYY-MM-DD');
      post.time = today.format('HH:mm');

      post.quote = response.quote;
      post.title = response.title;
      post.url = response.url;

      console.log(post);

      var postBody = formatPost(post);
      postEditor.setValue(postBody);

      post.filename = post.date + ' ' + post.title;
      post.filename = post.filename.replace(/\W+/g, '-') + '.markdown';

      var filenameElement = document.getElementById('filename');
      filenameElement.value = post.filename;

    });
  });
};



// once the popup had fully loaded get the selection from the page and populate the editor box
document.addEventListener('DOMContentLoaded', function() {

  loadSettings(function() {
    if (config.gitRepo === '' || config.gitUser === '' || config.DraftsDir === '' || config.token === '') {
      $('#editor').hide();
      $('#warning').show();
    } else {
      $('#editor').show();
      $('#warning').hide();
      createPostFromPage();
    }

  });

});

$(document).ready(function() {

  var quoteArea = $('#quote').get(0);
  postEditor = CodeMirror.fromTextArea(quoteArea, {
    mode: 'yamlFrontMatter',
    lineNumbers: true,
    theme: 'neo',
    lineWrapping: true,
    autoFocus: true
  });



});
