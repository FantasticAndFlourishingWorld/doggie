var electron = require('electron');
var moment = require('moment');
var sqlite3 = require('sqlite3').verbose();
var PythonShell = require(__dirname + '/../javascripts/python-shell.js');

var ipc = electron.ipcRenderer;

$(document).ready(function () {

  var state = {
    page: 1,
    perPage: 10,
    pcaps: []
  };

  ipc.on('init', function (event, data) {
    // data = JSON.parse(data);
    // db.all('SELECT * FROM PACKET', function (err, rows) {
    //   data.pcaps = rows;
    //   state.pcaps = data.pcaps;
    //   renderPcaps(state.page, state.perPage, data.pcaps, false);
    // });
    $('input[name=page-number]').val(1);
  });

  $('.btn-clear-filter-rule').click(function () {
    $('.filter-rule').val('');
  });

  $('.previous').click(function () {
    if (state.page > 1) {
      state.page -= 1;
      renderPcaps(state.page, state.perPage, state.pcaps, true);
    }
  });

  $('.next').click(function () {
    if (state.page < Math.ceil(state.pcaps.length / state.perPage)) {
      state.page += 1;
      renderPcaps(state.page, state.perPage, state.pcaps, true);
    }
  });

  $('.see-history').click(function () {
    var db = new sqlite3.Database(__dirname + '/../../database/packet.db');
    db.all('SELECT * FROM PACKET ORDER BY STIME ASC', function (err, rows) {
      state.pcaps = rows;
      renderPcaps(state.page, state.perPage, state.pcaps, true);
      db.close();
    });
  });

  $('.btn-page-dump').click(function () {
    var p = parseInt($('input[name=page-number]').val(), 10);
    if (p > 0) {
      state.page = p;
      renderPcaps(state.page, state.perPage, state.pcaps, true);
    }
  });

  readFile('drop-file');

  var sniffShell = null;
  var $loadingBtn = null;

  $('.start-sniff').click(function () {
    var pktCount = 0;
    var bpf = $('input[name=filter-rule]').val();
    $loadingBtn = $(this).button('loading');
    $('.fixed-head-table-wrapper tbody').html('');
    state.pcaps = [];
    state.page = 1;
    $('.page-current').html(state.page);
    $('.page-all').html(state.page);
    $('input[name=page-number]').val(1);

    sniffShell = new PythonShell('sniffer.py', {
      mode: "json",
      scriptPath: __dirname + '/../py',
      args: [__dirname, bpf]
    });

    sniffShell.on('message', function (pktObj) {
      state.pcaps.unshift(pktObj);
      renderPcaps(state.page, state.perPage, state.pcaps, false);
    });

    sniffShell.on('end', function (err) {
      if (err) {
        console.log(err);
      }
    });

    sniffShell.on('error', function (err) {
      console.log(err);
      $loadingBtn.button('reset');
    });

  });

  $('.stop-sniff').click(function () {
    sniffShell.end(function () {});
    $loadingBtn.button('reset');
  });

  function readFile (wrapId) {
    var holder = document.getElementById(wrapId);
    holder.ondragover = function () {
      return false;
    };
    holder.ondragleave = holder.ondragend = function () {
      return false;
    };
    holder.ondrop = function (e) {
      e.preventDefault();
      var file = e.dataTransfer.files[0];
      if (!file.name.endsWith('.pcap')) {
        $('p', holder).html('只能解析pcap文件');
        setTimeout(function () {
          $('p', holder).html('将数据包文件拖拽到此处解析');
        }, 1800);
      } else {
        var rdpcapShell = new PythonShell('read_pcap.py', {
          mode: "json",
          scriptPath: __dirname + '/../py',
          args: [file.path]
        });

        rdpcapShell.on('message', function (pkts) {
          state.pcaps = pkts.pkts;
          renderPcaps(state.page, state.perPage, state.pcaps, true);
        });

        rdpcapShell.on('end', function (err) {
          if (err) {
            console.log(err);
          }
        });

        rdpcapShell.on('error', function (err) {
          alert(err);
        });
      }

      return false;
    };
  }

});

function renderPcaps (page, perPage, pcaps, reRender) {
  var protocolClasset = {
    'HTTP': 'success',
    'ARP': 'danger',
    'IPv6': 'warning',
    'IPv4': 'warning'
  };
  var pageNumber = Math.ceil(pcaps.length / perPage);
  var $wrapper = $('.fixed-head-table-wrapper tbody');
  $wrapper.html('');
  $('.page-current').html('');
  $('.page-all').html('');
  for (var i = (page - 1) * perPage, len = Math.min(pcaps.length, page * perPage); i < len; ++i) {
    var node = '<tr class="' + (protocolClasset[pcaps[i].PROTOCOL] || '') + '">';
    var pcap = pcaps[i];
    var info = '详细信息';
    node += '<td>' + moment(new Date(parseInt(pcap.STIME, 10))).format('GGGG.MM.D H:mm:ss') + '</td>';
    node += '<td>' + (pcap.SMAC || '-') + '</td>';
    node += '<td>' + (pcap.DMAC || '-') + '</td>';
    node += '<td>' + (pcap.SPORT !== '0' ? pcap.SPORT : '-') + '</td>';
    node += '<td>' + (pcap.DPORT !== '0' ? pcap.DPORT : '-') + '</td>';
    node += '<td>' + (pcap.SIP || '-') + '</td>';
    node += '<td>' + (pcap.DIP || '-') + '</td>';
    node += '<td>' + pcap.PROTOCOL + '</td>';
    node += '</tr>';
    $wrapper.append(node);
  }

  if (reRender) {
    $wrapper.hide().show(200);
  }

  if (page === 1) {
    $('.previous').addClass('disabled');
  } else {
    $('.previous').removeClass('disabled');
  }
  if (page === pageNumber) {
    $('.next').addClass('disabled');
  } else {
    $('.next').removeClass('disabled');
  }
  $('input[name=page-number]').attr('max', pageNumber);
  $('input[name=page-number]').val(parseInt(page, 10));
  $('.page-current').html(page);
  $('.page-all').html(pageNumber);
}
