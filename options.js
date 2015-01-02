var validateField = function(field, group) {
  if (field.val() === '') {
    group.addClass('has-error');
  } else {
    group.removeClass('has-error');
  }
}

$(document).ready(function() {
  restore_options();

  $('#git_user').change(function() {
    validateField($('#git_user'), $('#git_user_grp'));
  });
  $('#git_user').keyup(function() {
    validateField($('#git_user'), $('#git_user_grp'));
  });

  $('#git_repo').change(function() {
    validateField($('#git_repo'), $('#git_repo_grp'));
  });
  $('#git_repo').keyup(function() {
    validateField($('#git_repo'), $('#git_repo_grp'));
  });

  $('#drafts_dir').change(function() {
    validateField($('#drafts_dir'), $('#drafts_dir_grp'));
  });
  $('#drafts_dir').keyup(function() {
    validateField($('#drafts_dir'), $('#drafts_dir_grp'));
  });

  $('#token').change(function() {
    validateField($('#token'), $('#token_grp'));
  });
  $('#token').keyup(function() {
    validateField($('#token'), $('#token_grp'));
  });


  $('#saveBtn').click(save_options);
});

// Saves options to chrome.storage
function save_options() {
  var git_user = $('#git_user').val();
  var git_repo = $('#git_repo').val();
  var drafts_dir = $('#drafts_dir').val();
  var token = $('#token').val();

  chrome.storage.sync.set({
    git_user: git_user,
    git_repo: git_repo,
    drafts_dir: drafts_dir,
    token: token
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        git_user: '',
        git_repo: '',
        drafts_dir: '_drafts',
        token: ''
      },
      function(item) {
        document.getElementById('git_user').value = item.git_user;
        document.getElementById('git_repo').value = item.git_repo;
        document.getElementById('drafts_dir').value = item.drafts_dir;
        document.getElementById('token').value = item.token;

        validateField($('#git_user'), $('#git_user_grp'));
        validateField($('#git_repo'), $('#git_repo_grp'));
        validateField($('#drafts_dir'), $('#drafts_dir_grp'));
        validateField($('#token'), $('#token_grp'));

      });
  }
  // document.addEventListener('DOMContentLoaded', restore_options);
