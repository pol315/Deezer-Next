// Saves options to chrome.storage.sync.
function save_options() {
  var uid = document.getElementById('uid').value;
  var auto = document.getElementById('autoplay').checked;
  chrome.storage.sync.set({
    UserID: uid,
	Autoplay: auto
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
  chrome.storage.sync.get({
    UserID: '447219283',
	Autoplay: true
  }, function(items) {
    document.getElementById('uid').value = items.UserID;
	document.getElementById('autoplay').checked = items.Autoplay;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);