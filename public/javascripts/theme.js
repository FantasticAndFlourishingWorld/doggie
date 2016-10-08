var utils = require(__dirname + '/../javascripts/utils.js');

$(document).ready(function () {

  var theme = utils.readSettings('theme');
  var themeIndex = utils.readSettings('themeIndex');
  var $themeMenu = $('.theme-menu');
  var themesheet = $('<link href="../../theme/' + theme[themeIndex] + '.min.css" rel="stylesheet" />');
  themesheet.appendTo('head');
  for (var i = 0, len = theme.length; i < len; ++i) {
    $themeMenu.append('<li><a href="#">' + theme[i] + '</a></li>');
  }
  $themeMenu.delegate('a', 'click', function () {
    utils.saveSettings('themeIndex', $themeMenu.find('a').index($(this)[0]));
    themesheet.attr('href', '../../theme/' + $(this).html() + '.min.css');
  });

});
