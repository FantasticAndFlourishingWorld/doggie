$(document).ready(function () {

  // fix table head
  $('.fixedHeadTableWrapper').scroll(function () {
    $('.fixedHeadTableWrapper thead').attr('position', 'fixed');
  });

});
