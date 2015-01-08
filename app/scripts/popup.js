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
var filename='';

var postArticle = function(){

  //check config values first, if any are missing then abort and show error message

  var content = window.btoa(unescape(encodeURIComponent($('#quote').val())));
  filename = document.getElementById('filename').value;

  var base = 'https://api.github.com';
  var url = base+'/repos/'+gitUser+'/'+gitRepo+'/contents/'+DraftsDir+'/'+filename;

  var reqObject = {
    'message': 'adding draft: '+title,
    'content': content
  };

  var reqString = JSON.stringify(reqObject);

  url = url+'?access_token='+token;

  $.ajax({
    type: 'PUT',
    url: url,
    data: reqString,
    dataType: 'json',
    contentType: 'application/json',
    error: function (jqXHR) {
      // display error message
      $('#status').text(jqXHR.statusText);
      $('#code').text(jqXHR.status);
      $('#errorMessage').text(jqXHR.responseJSON.message);
      $('.status').show();
    },
    success: function( data, textStatus, jqXHR ){
      $('.status').show();
      console.log(JSON.stringify(jqXHR));

      // disable text inputs and change post button to close
      // display success message + 'this window will close in 5 seconds'
      // set timeout to dismiss pop-up in 5 seconds
    }

  });

};

$( document ).ready(function() {
  $('#postbutton').click(postArticle);
  $('#optionslink').click(function(){
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


var formatPost = function(){

  var body = quote.split('\n').map(function(line){
    return '> '+line;
  }).join('\n');

  body = '---\n'+  'layout: post\n'+'title: '+title+'\n'+ 'date: '+ date+'\n'+  'url: '+url+'\n'+  '---\n'+  '['+title+']('+url+')\n\n'+body;

  return body;
};

var loadSettings = function(done) {
  chrome.storage.sync.get(['gitRepo', 'gitUser', 'DraftsDir', 'token'],
  function(item) {
    gitRepo = item.gitRepo;
    gitUser = item.gitUser;
    DraftsDir = item.DraftsDir;
    token = item.token;
    done();
  });
};

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
        filename = filename.replace(/\W+/g, '-')+'.markdown';


        var bodyElement = document.getElementById('quote');
        var filenameElement = document.getElementById('filename');

        filenameElement.value = filename;
        bodyElement.value = body;

      });
    });

    // == //
  });

});
