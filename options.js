// Saves options to chrome.storage
function save_options() {
  var git_url = document.getElementById('git_url').value;
  var drafts_dir = document.getElementById('drafts_dir').value;
  var token = document.getElementById('token').value;

  chrome.storage.sync.set({
    git_url: git_url,
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
  chrome.storage.sync.get(
    [
      "git_url",
      "drafts_dir",
      "token"
    ],
    function(item) {
      document.getElementById('git_url').value = item.git_url;
      document.getElementById('drafts_dir').value = item.drafts_dir;
      document.getElementById('token').value = item.token;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);