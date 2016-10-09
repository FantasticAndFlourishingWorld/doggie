var electron = require('electron');
var utils = require(__dirname + '/../javascripts/utils.js');

var ipc = electron.ipcRenderer;

$(document).ready(function () {

  $('.settings-password-alert-danger').hide(0);
  $('.settings-password-alert-success').hide(0);
  renderBlackList();
  renderBPF();

  var passwordKey = utils.readSettings('password_key');
  var curPassword = window.localStorage.getItem(passwordKey);
  var password = '';

  $('.settings-password-submit').click(function () {
    var oldPassword = $('input[name=settings-old-password]').val();
    password = $('input[name=settings-password]').val();

    $('.settings-password-alert-danger').hide();
    $('.settings-password-alert-success').hide();

    if (password.length < 6) {
      $('.settings-password-alert-danger')
        .html('新密码长度必须大于6位')
        .stop(true, true)
        .show(300)
        .delay(2000)
        .hide(300);
    } else {
      ipc.send('encrypt-old-password', oldPassword);
    }
  });

  $('.settings-blacklist-submit').click(function () {
    var url = $('input[name=settings-blacklist-url]').val();
    var urlRegExp = new RegExp('^(?:((http):\\/\\/)?[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\-\\.,@?^=%&amp;:/~\\+#]*[\\w\\-\\@?^=%&amp;/~\\+#])?)$');

    if (!url) {
      $('.settings-blacklist-alert-danger')
        .html('请输入要屏蔽的url')
        .stop(true, true)
        .show(300)
        .delay(2000)
        .hide(300);
    } else if (!urlRegExp.test(url)) {
      $('.settings-blacklist-alert-danger')
        .html('无效的url')
        .stop(true, true)
        .show(300)
        .delay(2000)
        .hide(300);
    } else {
      var blacklist = utils.readSettings('blacklist');
      if (!blacklist || !Array.isArray(blacklist)) {
        blacklist = [];
      } else if (blacklist.indexOf(url) > -1) {
        $('.settings-blacklist-alert-danger')
          .html('url已在黑名单中')
          .stop(true, true)
          .show(300)
          .delay(2000)
          .hide(300);

        return false;
      }
      $('.settings-blacklist-alert-success')
        .html('设置成功')
        .stop(true, true)
        .show(300)
        .delay(2000)
        .hide(300);
      $('input[name=settings-blacklist-url]').val('');
      blacklist.push(url);
      utils.saveSettings('blacklist', blacklist);
      renderBlackList();
      $('.settings-blacklist-delete').click(removeUrl);
    }
  });

  $('.settings-bpf-submit').click(function () {
    var name = $('input[name=settings-bpf-name]').val();
    var rule = $('input[name=settings-bpf-rule]').val();
    var bpfKeywords = utils.readSettings('bpfKeywords');
    var lowerName = name.toLowerCase();
    if (!name) {
      $('.settings-bpf-alert-danger')
        .html('请输入过滤器名称')
        .stop(true, true)
        .show(300)
        .delay(2000)
        .hide(300);
    } else if (!(/^[a-zA-Z0-9]{2,16}$/.test(name))) {
      // should validate no keyword of bpf in the name, too.

      $('.settings-bpf-alert-danger')
        .html('过滤器名称只能由2到16位字母和数字组成')
        .stop(true, true)
        .show(300)
        .delay(2000)
        .hide(300);
    } else if (bpfKeywords.some(function (keyword) {
      return keyword === lowerName;
    })) {
      $('.settings-bpf-alert-danger')
        .html('过滤器名称与bpf关键字冲突')
        .stop(true, true)
        .show(300)
        .delay(2000)
        .hide(300);
    } else if (!rule) {
      $('.settings-bpf-alert-danger')
        .html('请输入过滤器规则')
        .stop(true, true)
        .show(300)
        .delay(2000)
        .hide(300);
    } else if (false) {
      // send and get validate result of bpf

    } else {
      var bpf = utils.readSettings('bpf');
      if (!bpf || !Array.isArray(bpf)) {
        bpf = [];
      }
      var newBPF = {
        name: name,
        rule: rule
      };
      if (bpf.indexOf(newBPF) > -1) {
        $('.settings-bpf-alert-danger')
          .html('已存在同名规则')
          .stop(true, true)
          .show(300)
          .delay(2000)
          .hide(300);

        return false;
      }
      $('.settings-bpf-alert-success')
        .html('设置成功')
        .stop(true, true)
        .show(300)
        .delay(2000)
        .hide(300);
      $('input[name=settings-bpf-name]').val('');
      $('input[name=settings-bpf-rule]').val('');
      bpf.push(newBPF);
      utils.saveSettings('bpf', bpf);
      renderBPF();
      $('.settings-bpf-delete').click(removeBPF);
    }
  });

  $('.settings-blacklist-delete').click(removeUrl);
  $('.settings-bpf-delete').click(removeBPF);

  ipc.on('encrypt-old-password-done', function (event, passwordHash) {
    if (passwordHash !== curPassword) {
      $('.settings-password-alert-danger')
        .html('请输入正确的旧密码')
        .stop(true, true)
        .show(300)
        .delay(2000)
        .hide(300);
    } else {
      ipc.send('encrypt-password', password);
    }
  });

  ipc.on('encrypt-password-done', function (event, passwordHash) {
    if (passwordHash === curPassword) {
      $('.settings-password-alert-danger')
        .html('新密码不能与旧密码相同')
        .stop(true, true)
        .show(300)
        .delay(2000)
        .hide(300);
    } else {
      $('input[name=settings-old-password]').val('');
      $('input[name=settings-password]').val('');
      $('.settings-password-alert-success')
        .html('修改成功')
        .stop(true, true)
        .show(300)
        .delay(5000)
        .hide(300);
      window.localStorage.setItem(passwordKey, passwordHash);
    }
  });

});

function renderBlackList () {
  var blacklistItems = utils.readSettings('blacklist');
  var $wrapper = $('.settings-blacklist-list');
  var frag = '';
  $('.settings-blacklist-alert-danger').hide(0);
  $('.settings-blacklist-alert-success').hide(0);
  for (var i = 0, len = blacklistItems.length; i < len; ++i) {
    frag +=
      '<li class="list-group-item">' +
      blacklistItems[i] +
      '<span class="label label-danger pull-right settings-blacklist-delete">删除</span></li>';
  }
  $wrapper.html(frag);
}

function removeUrl () {
  var blacklist = utils.readSettings('blacklist');
  blacklist.splice($('.settings-blacklist-delete').index($(this)[0]), 1);
  utils.saveSettings('blacklist', blacklist);
  renderBlackList();
  $('.settings-blacklist-delete').click(removeUrl);
}

function renderBPF () {
  var bpfItems = utils.readSettings('bpf');
  var $wrapper = $('.settings-bpf-list');
  var frag = '';
  $('.settings-bpf-alert-danger').hide(0);
  $('.settings-bpf-alert-success').hide(0);
  for (var i = 0, len = bpfItems.length; i < len; ++i) {
    frag +=
      '<li class="list-group-item">' +
      bpfItems[i].name +
      '|' +
      bpfItems[i].rule +
      '<span class="label label-danger pull-right settings-bpf-delete">删除</span></li>';
  }
  $wrapper.html(frag);
}

function removeBPF () {
  var bpf = utils.readSettings('bpf');
  bpf.splice($('.settings-bpf-delete').index($(this)[0]), 1);
  utils.saveSettings('bpf', bpf);
  renderBPF();
  $('.settings-bpf-delete').click(removeBPF);
}
