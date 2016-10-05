var electron = require('electron');
var utils = require(__dirname + '/../javascripts/utils.js');

var ipc = electron.ipcRenderer;

$(document).ready(function () {

  if (utils.readSettings('notice')) {
    Notification.requestPermission(function (status) {
      if (Notification.permission !== status) {
        Notification.permission = status;
      }
    });
    var n = new Notification('Hi');
  }

  ipc.on('init', function (event, data) {
    data = JSON.parse(data);
    renderOs(data.os);
    initSettings();
    initPassword(data.passwordKey);
  });

  ipc.on('global-shortcut', function (event, key) {
    // short-cut-biding
    $('.settings-' + key).click();
  });

  $('.settings-voice').change(function (event) {
    utils.saveSettings('voice', event.target.checked);
  });

  $('.settings-notice').change(function (event) {
    utils.saveSettings('notice', event.target.checked);
    if (utils.readSettings('notice')) {
      Notification.requestPermission(function (status) {
        if (Notification.permission !== status) {
          Notification.permission = status;
        }
      });
      var n = new Notification('Hi');
    }
  });

  $('.settings-theme').change(function (event) {
    alert(event.target.selected);
  });

});

function renderOs (os) {
  for (var key in os) {
    $('.os-' + key).html(os[key]);
  }
}

function initSettings () {
  $('.settings-voice').prop('checked', utils.readSettings('voice'));
  $('.settings-notice').prop('checked', utils.readSettings('notice'));
}

function initPassword (passwordKey) {
  passwordKey = passwordKey ? passwordKey : 'password';
  var curPassword = window.localStorage.getItem(passwordKey);

  if (!curPassword) {
    $('.set-password-modal-lg').modal({
      backdrop: false,
      keyboard: false
    });
    $('.set-password-alert-danger').hide();
    $('.set-password-submit').click(function () {
      var ps1 = $('input[name=set-password]').val();
      var ps2 = $('input[name=set-password2]').val();
      if (ps1 !== ps2) {
        $('.set-password-alert-danger').html('两次输入必须一致').stop(true, true).show(300).delay(3000).hide(300);
      } else if (ps1.length < 6) {
        $('.set-password-alert-danger').html('请输入6位以上的密码').stop(true, true).show(300).delay(3000).hide(300);
      } else {
        ipc.send('encrypt-password', ps1);
      }
    });
  } else {
    $('.password-modal-lg').modal({
      backdrop: false,
      keyboard: false
    });
    $('.password-alert-danger').hide();
    $('.password-submit').click(function () {
      var password = $('input[name=password]').val();
      ipc.send('encrypt-password', password);
    });
  }

  ipc.on('encrypt-password-done', function (event, passwordHash) {
    if (!curPassword) {
      window.localStorage.setItem(passwordKey, passwordHash);
      $('.set-password-modal-lg').modal('hide');
    } else {
      if (passwordHash !== curPassword) {
        $('.password-alert-danger').html('密码不正确, 请重试').stop(true, true).show(300).delay(3000).hide(300);
      } else {
        $('.password-modal-lg').modal('hide');
      }
    }
  });
}
