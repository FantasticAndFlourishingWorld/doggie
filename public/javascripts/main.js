$(document).ready(function () {

  // fix table head
  $('.fixedHeadTableWrapper').scroll(function () {
    $('.fixedHeadTableWrapper thead').attr('position', 'fixed');
  });

});

function renderPcaps (data) {
  var $wrapper = $('.fixedHeadTableWrapper tbody');
  for (var i = 0, len = data.length; i < len; ++i) {
    var node = '<tr>';
    node += '<td>' + i + '</td>';
    node += '<td>' + data[i].ip + '</td>';
    node += '<td>' + data[i].protocol + '</td>';
    node += '</tr>';
    $wrapper.append(node);
  }
}
