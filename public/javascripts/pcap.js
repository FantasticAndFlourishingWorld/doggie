var electron = require('electron');
var cp = require('child_process');

var ipc = electron.ipcRenderer;

$(document).ready(function () {

  var state = {
    page: 1,
    perPage: 10,
    pcaps: []
  };

  ipc.on('init', function (event, data) {
    data = JSON.parse(data);
    state.pcaps = data.pcaps;
    renderPcaps(state.page, state.perPage, data.pcaps);
  });

  $('.btn-clear-filter-rule').click(function () {
    $('.filter-rule').val('');
  });

  $('.previous').click(function () {
    if (state.page > 1) {
      state.page -= 1;
      renderPcaps(state.page, state.perPage, state.pcaps);
    }
  });

  $('.next').click(function () {
    if (state.page < state.pcaps.length / state.perPage) {
      state.page += 1;
      renderPcaps(state.page, state.perPage, state.pcaps);
    }
  });

  readFile('drop-file');

  var sniffer = null;
  var $loadingBtn = null;

  $('.start_sniff').click(function () {
    var pktCount = 0;
    if (!sniffer) {
      $loadingBtn = $(this).button('loading');
      sniffer = cp.spawn('python', [__dirname + '/../py/sniffer.py', $('.filter-rule').val()]);

      sniffer.stderr.setEncoding('utf8');
      sniffer.stderr.on('data', function (err) {
        console.log(err);
      });
      sniffer.stdout.on('data', function (data) {
        console.log(data.toString());
        pktCount += 1;
        $('.pkt-count').html('已抓取到' + pktCount + '个数据包');
      });
      sniffer.on('exit', function (code) {
        $('.pkt-count').html('');
        // console.log('exit' + code);
      });
    }
  });

  $('.stop_sniff').click(function () {
    if (sniffer) {
      sniffer.kill();
      sniffer = null;
    }
    $loadingBtn.button('reset');
  });

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
      var rdpcap = cp.spawn('python', [__dirname + '/../py/read_pcap.py', file.path]);
      rdpcap.stderr.setEncoding('utf8');
      rdpcap.stderr.on('data', function (err) {
        console.log(err);
      });
      rdpcap.stdout.on('data', function (data) {
        console.log(data.toString());
      });
      rdpcap.on('exit', function (code) {
        console.log('done');
      });
    }

    return false;
  };
}

function renderPcaps (page, perPage, pcaps) {
  var protocolClasset = {
    'http': 'success',
    'mailto': 'warning',
    'tcp': 'info'
  };
  var $wrapper = $('.fixed-head-table-wrapper tbody');
  $wrapper.html('');
  for (var i = (page - 1) * perPage, len = Math.min(pcaps.length, page * perPage); i < len; ++i) {
    var node = '<tr class="' + (protocolClasset[pcaps[i].protocol] || '') + '">';
    node += '<td>' + (i + 1) + '</td>';
    node += '<td>' + pcaps[i].srcIp + '</td>';
    node += '<td>' + pcaps[i].dstIp + '</td>';
    node += '<td>' + pcaps[i].protocol + '</td>';
    node += '</tr>';
    $wrapper.append(node);
  }
  $wrapper.hide().show(200);
  if (page === 1) {
    $('.previous').addClass('disabled');
  } else {
    $('.previous').removeClass('disabled');
  }
  if (page === pcaps.length / perPage) {
    $('.next').addClass('disabled');
  } else {
    $('.next').removeClass('disabled');
  }
}
