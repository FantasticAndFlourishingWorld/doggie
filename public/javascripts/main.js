var electron = require('electron');
var evilscan = require('evilscan');
var utils = require(__dirname + '/../javascripts/utils.js');

var ipc = electron.ipcRenderer;

$(document).ready(function () {

  var ip = null;

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
    for (var dev in data.os.networkInterfaces) {
      data.os.networkInterfaces[dev].forEach(function (details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          ip = details.address;
        }
      });
    }
    // initPassword(data.passwordKey);
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

  $('.scan-btn').click(function () {
    var target = null;
    var concurrency = 60000;
    var timeout = 100;
    if ($(this).hasClass('disabled')) {
      return;
    }
    if ($(this).hasClass('scan-btn-localhost')) {
      target = '127.0.0.1';
      concurrency = 60000;
      timeout = 100;
    } else if ($(this).hasClass('scan-btn-ip')) {
      target = ip;
      concurrency = 60000;
      timeout = 100;
    } else {
      target = '192.168.1.1';
      concurrency = 30000;
      timeout = 5000;
    }
    var options = {
      target: target,
      port: '0-65535',
      concurrency: concurrency,
      timeout: timeout,
      status: 'TROU',
      banner: true
    };

    var scanner = new evilscan(options);

    $('.scanned-ports').html('');
    $('.scan-btn').addClass('disabled');

    scanner.on('result',function(data) {
      if (data.status === 'open') {
        $('.scanned-ports').append('<span class="label label-success scanned-port">' + data.port + '</span>');
      }
    });

    scanner.on('error',function(err) {
      $('.scan-btn').removeClass('disabled');
      scanner = null;
      throw new Error(data.toString());
    });

    scanner.on('done',function() {
      $('.scan-btn').removeClass('disabled');
      scanner = null;
    });

    scanner.run();
  });

});

function renderOs (os) {
  for (var key in os) {
    if (key === 'networkInterfaces') {
      var networkInterfaces = os[key];
      for (var k in networkInterfaces) {
        var networkInterface = networkInterfaces[k];
        $('.os-networkInterfaces').append('<tr class="active"><td colspan="7">' + k + '</td></tr>');
        networkInterface.forEach(function (n) {
          var frag = $('<tr></tr>');
          var address = n.address || '';
          var family = n.family || '';
          var internal = n.internal || false;
          var mac = n.mac || '';
          var netmask = n.netmask || '';
          var scopeid = n.scopeid || '-';
          frag.append('<td>' + address + '</td>');
          frag.append('<td>&nbsp&nbsp' + family + '&nbsp&nbsp</td>');
          frag.append('<td>&nbsp&nbsp' + (internal ? 'yes' : 'no') + '&nbsp&nbsp</td>');
          frag.append('<td>&nbsp&nbsp' + mac + '&nbsp&nbsp</td>');
          frag.append('<td>' + netmask + '</td>');
          frag.append('<td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + scopeid + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>');
          $('.os-networkInterfaces').append(frag);
        });
      }
    } else {
      $('.os-' + key).html(os[key]);
    }
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
        $('.set-password-alert-danger')
          .html('两次输入必须一致')
          .stop(true, true)
          .show(300)
          .delay(3000)
          .hide(300);
      } else if (ps1.length < 6) {
        $('.set-password-alert-danger')
          .html('请输入6位以上的密码')
          .stop(true, true)
          .show(300)
          .delay(3000)
          .hide(300);
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
        $('.password-alert-danger')
          .html('密码不正确, 请重试')
          .stop(true, true)
          .show(300)
          .delay(3000)
          .hide(300);
      } else {
        $('.password-modal-lg').modal('hide');
      }
    }
  });
}
