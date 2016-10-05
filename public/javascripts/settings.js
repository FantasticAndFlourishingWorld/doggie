var url = require('url');
var utils = require(__dirname + '/../javascripts/utils.js');

$(document).ready(function () {

  $('.settings-password-alert-danger').hide(0);
  $('.settings-password-alert-success').hide(0);
  $('.settings-blacklist-alert-danger').hide(0);
  $('.settings-blacklist-alert-success').hide(0);

  $('.settings-password-submit').click(function () {

    var passwordKey = utils.readSettings('password_key');
    var curPassword = window.localStorage.getItem(passwordKey);
    var oldPassword = $('input[name=settings-old-password]').val();
    var password = $('input[name=settings-password]').val();

    $('.settings-password-alert-danger').hide();
    $('.settings-password-alert-success').hide();

    if (oldPassword !== curPassword) {
      $('.settings-password-alert-danger').html('请输入正确的旧密码').stop(true, true).show(300).delay(2000).hide(300);
    } else if (password.length < 6) {
      $('.settings-password-alert-danger').html('新密码长度必须大于6位').stop(true, true).show(300).delay(2000).hide(300);
    } else {
      $('input[name=settings-old-password]').val('');
      $('input[name=settings-password]').val('');
      $('.settings-password-alert-success').html('修改成功').stop(true, true).show(300).delay(5000).hide(300);
      window.localStorage.setItem(passwordKey, password);
    }

  });

  $('.settings-blacklist-submit').click(function () {

    var url = $('input[name=settings-blacklist-url]').val();
    var urlRegExp = new RegExp('^(?:((http|ftp|https):\\/\\/)?[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\-\\.,@?^=%&amp;:/~\\+#]*[\\w\\-\\@?^=%&amp;/~\\+#])?)$');

    if (!url) {
      $('.settings-blacklist-alert-danger').html('请输入要屏蔽的url').stop(true, true).show(300).delay(2000).hide(300);
    } else if (!urlRegExp.test(url)) {
      $('.settings-blacklist-alert-danger').html('无效的url').stop(true, true).show(300).delay(2000).hide(300);
    } else {
      var blacklist = utils.readSettings().blacklist;
      $('.settings-blacklist-alert-success').html('设置成功').stop(true, true).show(300).delay(2000).hide(300);
      blacklist.push(url);
      utils.saveSettings('blacklist', url.parse(blacklist), false, true);
    }

  });

});
