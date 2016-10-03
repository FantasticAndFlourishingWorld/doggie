$(document).ready(function () {

  readFile('drop-file');

});

function readFile (wrapId) {
  var $el = $('#' + wrapId);
  $el.on('dragover', function () {
    return false;
  });
  $el.on('dragleave', function () {
    return false;
  });
  $el.on('dragend', function () {
    return false;
  });
  $el.on('drop', function (e) {
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    alert(file);
    return false;
  });
}
