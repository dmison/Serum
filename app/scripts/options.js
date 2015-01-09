/*global $:false */

'use strict';

// Saves options to chrome.storage
var saveOptions = function() {
  $('#saving').show();
  $('#saved').hide();

  var gitUser = $('#gitUser').val();
  var gitRepo = $('#gitRepo').val();
  var DraftsDir = $('#DraftsDir').val();
  var token = $('#token').val();

  chrome.storage.sync.set({
    gitUser: gitUser,
    gitRepo: gitRepo,
    DraftsDir: DraftsDir,
    token: token
  }, function() {
    // Update status to let user know options were saved.
    window.setTimeout(function() {
      $('#saving').hide();
      $('#saved').show();
      window.setTimeout(function() {
        $('#saved').hide();
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
      token: ''
    },
    function(item) {
      $('#gitUser').val(item.gitUser);
      $('#gitRepo').val(item.gitRepo);
      $('#DraftsDir').val(item.DraftsDir);
      $('#token').val(item.token);

      validateField($('#gitUser'), $('#gitUser_grp'));
      validateField($('#gitRepo'), $('#gitRepo_grp'));
      validateField($('#DraftsDir'), $('#DraftsDir_grp'));
      validateField($('#token'), $('#token_grp'));

    });
};


$(document).ready(function() {
  // $('#status').hide();
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

  $('#token').change(function() {
    validateField($('#token'), $('#token_grp'));
  });
  $('#token').keyup(function() {
    validateField($('#token'), $('#token_grp'));
  });


  $('#saveBtn').click(saveOptions);
});


// document.addEventListener('DOMContentLoaded', restoreOptions);
