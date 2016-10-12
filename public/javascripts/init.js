var electron = require('electron');
var utils = require(__dirname + '/../javascripts/utils.js');

var remote = electron.remote;
var Menu = remote.Menu;
var MenuItem = remote.MenuItem;
var app = electron.remote.app;

$(document).ready(function () {

  var theme = utils.readSettings('theme');
  var themeIndex = utils.readSettings('themeIndex');

  if (theme && themeIndex > -1) {
    var $themeMenu = $('.theme-menu');
    var $themesheet = $('<link href="../../theme/' + theme[themeIndex] + '.min.css" rel="stylesheet" />');
    $('head').append($themesheet);

    for (var i = 0, len = theme.length; i < len; ++i) {
      $themeMenu.append('<li><a href="#">' + theme[i] + '</a></li>');
    }
    $themeMenu.delegate('a', 'click', function () {
      utils.saveSettings('themeIndex', $themeMenu.find('a').index($(this)[0]));
      $themesheet.attr('href', '../../theme/' + $(this).html() + '.min.css');
    });
  }

  var template = [
    {
      label: '编辑',
      submenu: [
        {
          label: '撤销',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: '重复',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: '剪贴',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: '复制',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: '粘贴',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: '全选',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        },
      ]
    },
    {
      label: '查看',
      submenu: [
        {
          label: '刷新',
          accelerator: 'CmdOrCtrl+R',
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.reload();
          }
        },
        {
          label: '全屏显示',
          accelerator: (function() {
            if (process.platform == 'darwin')
              return 'Ctrl+Command+F';
            else
              return 'F11';
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
        {
          label: '打开/关闭开发者工具',
          accelerator: (function() {
            if (process.platform == 'darwin')
              return 'Alt+Command+I';
            else
              return 'Ctrl+Shift+I';
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.toggleDevTools();
          }
        },
      ]
    },
    {
      label: '窗口',
      role: 'window',
      submenu: [
        {
          label: '最小化',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: '关闭',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },
      ]
    },
    {
      label: '帮助',
      role: 'help',
      submenu: [
        {
          label: '关于我们',
          click: function() { require('electron').shell.openExternal('https://github.com/FantasticAndFlourishingWorld') }
        },
      ]
    },
  ];

  if (process.platform == 'darwin') {
    var name = require('electron').remote.app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          label: '查看 ' + name + ' 信息',
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: '服务',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: '退出',
          accelerator: 'Command+Q',
          click: function() { app.quit(); }
        },
      ]
    });
    // Window menu.
    template[3].submenu.push(
      {
        type: 'separator'
      },
      {
        label: '全部显示',
        role: 'front'
      }
    );
  }

  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

});
