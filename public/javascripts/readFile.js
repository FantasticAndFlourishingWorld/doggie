function readFile (wrapId) {
  var $el = $('#' + wrapId);
  $el.ondragover = function () {
    return false;
  }
  $el.ondragleave = $el.ondragleave = function () {
    return false;
  }
  $el.ondrop = function (e) {
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    console.log(file.path);
    return false;
  }
}
