/*global $:false */

'use strict';

var templateEditor;

// Saves options to chrome.storage
var saveOptions = function() {
  $('#saving').addClass('shown');
  $('#saving').removeClass('hidden');
  $('#saved').removeClass('shown');
  $('#saved').addClass('hidden');

  var gitUser = $('#gitUser').val();
  var gitRepo = $('#gitRepo').val();
  var DraftsDir = $('#DraftsDir').val();
  var postsDir = $('#postsDir').val();
  var token = $('#token').val();
  var template = templateEditor.getValue();

  chrome.storage.sync.set({
    gitUser: gitUser,
    gitRepo: gitRepo,
    DraftsDir: DraftsDir,
    postsDir: postsDir,
    token: token,
    template: template
  }, function() {
    // Update status to let user know options were saved.
    window.setTimeout(function() {
      $('#saving').removeClass('shown');
      $('#saving').addClass('hidden');
      $('#saved').addClass('shown');
      $('#saved').removeClass('hidden');
      window.setTimeout(function() {
        $('#saved').removeClass('shown');
        $('#saved').addClass('hidden');
      }, 750);

    }, 500);
  });
};

var validateField = function(field, group) {
  if (field.val() === '') {
    group.addClass('has-error');
  } else {
    group.removeClass('has-error');
  }
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
var restoreOptions = function() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
      gitUser: '',
      gitRepo: '',
      DraftsDir: '_drafts',
      postsDir: '_posts',
      token: '',
      template: default_template
    },
    function(item) {
      $('#gitUser').val(item.gitUser);
      $('#gitRepo').val(item.gitRepo);
      $('#DraftsDir').val(item.DraftsDir);
      $('#postsDir').val(item.postsDir);
      $('#token').val(item.token);
      templateEditor.setValue(item.template);

      validateField($('#gitUser'), $('#gitUser_grp'));
      validateField($('#gitRepo'), $('#gitRepo_grp'));
      validateField($('#DraftsDir'), $('#DraftsDir_grp'));
      validateField($('#postsDir'), $('#postsDir_grp'));
      validateField($('#token'), $('#token_grp'));

    });
};

var restoreDefaultTemplate = function(){
  templateEditor.setValue(default_template);
}

$(document).ready(function() {

  $('#saving').addClass('hidden');
  $('#saved').addClass('hidden');

  var templateArea = $('#template').get(0);
  templateEditor = CodeMirror.fromTextArea(templateArea, {
    mode: 'templateMP',
    lineNumbers: true,
    theme: 'neo',
    lineWrapping: false,
    autoFocus: false
  });


  restoreOptions();

  $('#gitUser').change(function() {
    validateField($('#gitUser'), $('#gitUser_grp'));
  });
  $('#gitUser').keyup(function() {
    validateField($('#gitUser'), $('#gitUser_grp'));
  });

  $('#gitRepo').change(function() {
    validateField($('#gitRepo'), $('#gitRepo_grp'));
  });
  $('#gitRepo').keyup(function() {
    validateField($('#gitRepo'), $('#gitRepo_grp'));
  });

  $('#DraftsDir').change(function() {
    validateField($('#DraftsDir'), $('#DraftsDir_grp'));
  });
  $('#DraftsDir').keyup(function() {
    validateField($('#DraftsDir'), $('#DraftsDir_grp'));
  });

  $('#postsDir').change(function() {
    validateField($('#postsDir'), $('#postsDir_grp'));
  });
  $('#postsDir').keyup(function() {
    validateField($('#postsDir'), $('#postsDir_grp'));
  });

  $('#token').change(function() {
    validateField($('#token'), $('#token_grp'));
  });
  $('#token').keyup(function() {
    validateField($('#token'), $('#token_grp'));
  });

  $('#restoreBtn').click(restoreDefaultTemplate);
  $('#saveBtn').click(saveOptions);
});


// document.addEventListener('DOMContentLoaded', restoreOptions);
