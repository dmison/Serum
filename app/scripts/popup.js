/*global $:false */
/*global moment:false */
/*global unescape:false */

'use strict';

var gitRepo = '';
var gitUser = '';
var DraftsDir = '';
var token = '';

var today = new moment();

var day = today.format('YYYY-MM-DD');
var date = today.format('YYYY-MM-DD HH:mm');

var title = '';
var quote = '';
var url = '';
var filename = '';

var postArticle = function() {

  //check config values first, if any are missing then abort and show error message




  var content = window.btoa(unescape(encodeURIComponent($('#quote').val())));
  filename = document.getElementById('filename').value;

  var base = 'https://api.github.com';
  var url = base + '/repos/' + gitUser + '/' + gitRepo + '/contents/' + DraftsDir + '/' + filename;

  var reqObject = {
    'message': 'adding draft: ' + title,
    'content': content
  };

  var reqString = JSON.stringify(reqObject);

  $('.statusError').hide();
  $('#progress').show();

  url = url + '?access_token=' + token;
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


var formatPost = function() {

  var body = quote.split('\n').map(function(line) {
    return '> ' + line;
  }).join('\n');

  body = '---\n' + 'layout: post\n' + 'title: ' + title + '\n' + 'date: ' + date + '\n' + 'url: ' + url + '\n' + '---\n' + '[' + title + '](' + url + ')\n\n' + body;

  return body;
};

var loadSettings = function(done) {
  chrome.storage.sync.get({
      gitUser: '',
      gitRepo: '',
      DraftsDir: '_drafts',
      token: ''
    },
    function(item) {
      gitRepo = item.gitRepo;
      gitUser = item.gitUser;
      DraftsDir = item.DraftsDir;
      token = item.token;
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
      quote = response.quote;
      title = response.title;
      url = response.url;

      var body = formatPost();

      filename = day + ' ' + title;
      filename = filename.replace(/\W+/g, '-') + '.markdown';


      var bodyElement = document.getElementById('quote');
      var filenameElement = document.getElementById('filename');

      filenameElement.value = filename;
      bodyElement.value = body;

    });
  });
};


// once the popup had fully loaded get the selection from the page and populate the editor box
document.addEventListener('DOMContentLoaded', function() {

  loadSettings(function() {
    if (gitRepo === '' || gitUser === '' || DraftsDir === '' || token === '') {
      $('#editor').hide();
      $('#warning').show();
    } else {
      $('#editor').show();
      $('#warning').hide();
      createPostFromPage();
    }


    // == //
  });

});

$(document).ready(function() {

  var quoteArea = $('#quote').get(0);
  var myCodeMirror = CodeMirror.fromTextArea(quoteArea, {
    mode: 'yamlFrontMatter',
    lineNumbers: true,
    theme: 'neo',
    lineWrapping: true,
    autoFocus: true
  });

});
