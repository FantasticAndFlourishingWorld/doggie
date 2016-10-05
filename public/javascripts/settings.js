var utils = require(__dirname + '/../javascripts/utils.js');

$(document).ready(function () {

  var passwordKey = utils.readSettings('password_key');
  var curPassword = window.localStorage.getItem(passwordKey);

  $('.settings-alert-danger').hide();
  $('.settings-alert-success').hide();

  $('.settings-submit').click(function () {
    var oldPassword = $('input[name=settings-old-password]').val();
    var password = $('input[name=settings-password]').val();
    if (oldPassword !== curPassword) {
      $('.settings-alert-danger').html('请输入正确的旧密码').stop(true, true).show(300).delay(3000).hide(300);
    } else if (password.length < 6) {
      $('.settings-alert-danger').html('新密码长度必须大于6位').stop(true, true).show(300).delay(3000).hide(300);
    } else {
      $('.settings-alert-success').html('修改成功').stop(true, true).show(300).delay(5000).hide(300);
      window.localStorage.setItem(passwordKey, password);
    }
  });

});
