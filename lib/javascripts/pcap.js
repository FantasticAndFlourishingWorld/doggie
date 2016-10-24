var electron = require('electron');
var moment = require('moment');
var sqlite3 = require('sqlite3').verbose();
var lbs = require('node-qqwry');
var utils = require(__dirname + '/../javascripts/utils.js');
var PythonShell = require(__dirname + '/../javascripts/python-shell.js');

var ipc = electron.ipcRenderer;

$(document).ready(function () {

  var pktChartWrapper = document.getElementById('pktChart');
  var pktChart = echarts.init(pktChartWrapper, 'vintage');
  var state = {
    page: 1,
    perPage: 10,
    pcaps: [],
    chartPktsLen: 0,
    chartData: [],
    chartDataMaxLength: 10,
    chartTimer: null,
    chartInterval: 1000,
    historyPerNum: 100,
    historyNum: 0
  };

  pktChart.showLoading();

  ipc.on('init', function (event, data) {
    $('input[name=page-number]').val(1);
  });

  $('.btn-clear-filter-rule').click(function () {
    $('.filter-rule').val('');
    state.historyNum = 0;
  });

  $('.previous').click(function () {
    if (state.page > 1) {
      state.page -= 1;
      renderPcaps(state, true);
    }
  });

  $('.next').click(function () {
    if (state.page < Math.ceil(state.pcaps.length / state.perPage)) {
      state.page += 1;
      renderPcaps(state, true);
    }
  });

  $('.see-history').click(function () {
    var db = new sqlite3.Database(__dirname + '/../../database/packet.db');

    db.all('SELECT * FROM PACKET ORDER BY STIME ASC LIMIT ' + state.historyPerNum + ' OFFSET ' + state.historyNum, function (err, rows) {
      state.pcaps = state.pcaps.concat(rows);
      renderPcaps(state, true);
      state.historyNum += state.historyPerNum;
      db.close();
    });
  });

  $('.btn-page-dump').click(function () {
    var p = parseInt($('input[name=page-number]').val(), 10);
    if (p > 0) {
      state.page = p;
      renderPcaps(state, true);
    }
  });

  readFile('drop-file');

  var sniffShell = null;
  var $loadingBtn = null;

  $('.start-sniff').click(function () {
    var pktCount = 0;
    var bpf = $('input[name=filter-rule]').val();
    var bpfFilters = utils.readSettings('bpf');

    state.historyNum = 0;
    $loadingBtn = $(this).button('loading');
    $('.fixed-head-table-wrapper tbody').html('');
    state.pcaps = [];
    state.page = 1;
    $('.page-current').html(state.page);
    $('.page-all').html(state.page);
    $('input[name=page-number]').val(1);

    for (var i = 0, len = bpfFilters.length; i < len; ++i) {
      if (bpfFilters[i].name === $('input[name=filter-rule]').val()) {
        bpf = bpfFilters[i].rule;
        break;
      }
    }

    sniffShell = new PythonShell('sniffer.py', {
      mode: "json",
      scriptPath: __dirname + '/../py',
      args: [__dirname, bpf]
    });

    sniffShell.on('message', function (pktObj) {
      state.pcaps.unshift(pktObj);
      renderPcaps(state, false);
      state.chartPktsLen += pktObj.length;
    });

    sniffShell.on('end', function (err) {
      if (err) {
        console.error(err);
      }
    });

    sniffShell.on('error', function (err) {
      if (err.message.endsWith("'pcap_compile')")) {
        $('input[name=filter-rule]')
          .val('')
          .attr('placeholder', '无效的规则');
      } else {
        console.error(err.message);
      }
      $loadingBtn.button('reset');
    });

    state.chartTimer = setInterval(function chartDataUpdate() {
      state.chartData.push(state.chartPktsLen);
      state.chartPktsLen = 0;
      if (state.chartData.length > state.chartDataMaxLength) {
        state.chartData.shift();
      }
      console.log(state.chartData);
    }, state.chartInterval);

  });

  $('.stop-sniff').click(function () {
    sniffShell.end(function () {});
    $loadingBtn.button('reset');
    clearInterval(state.chartTimer);
    state.historyNum = 0;
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

      state.historyNum = 0;
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
          renderPcaps(state, true);
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

function renderPcaps (state, reRender) {
  var page = state.page;
  var perPage = state.perPage;
  var pcaps = state.pcaps;
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
    var node = '<tr class="' + (protocolClasset[pcaps[i].protocol] || '') + '">';
    var pcap = pcaps[i];
    var detail = pcap.result || {};
    var info = '<td><button class="btn btn-xs btn-success pkt-info-btn">more</button></td>';

    node += '<td>' + moment(new Date(parseInt(pcap.time, 10))).format('GGGG.MM.D H:mm:ss') + '</td>';
    node += '<td>' + (detail.MAC_src || '-') + '</td>';
    node += '<td>' + (detail.MAC_dst || '-') + '</td>';
    node += '<td>' + String(detail.sport ? detail.sport : '-') + '</td>';
    node += '<td>' + String(detail.dport ? detail.dport : '-') + '</td>';
    node += '<td>' + (detail.IP_src || '-') + '</td>';
    node += '<td>' + (detail.IP_dst || '-') + '</td>';
    node += '<td>' + pcap.protocol + '</td>';
    node += info;
    node += '</tr>';
    $wrapper.append(node);
  }

  $('.fixed-head-table-wrapper').on('click', '.pkt-info-btn', function () {
    var index = (state.page - 1) * state.perPage + $('.pkt-info-btn').index($(this));

    renderPkt(state.pcaps[index]);
  });

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

function renderPkt (pkt) {
  var $wrapper = $('#pkt-info');
  var detail = pkt.result;

  for (var key in detail) {
    var $tabTitle = $('<li role="presentation"><a href="#' + key + '" role="tab" data-toggle="tab">' + key + '</a></li>');
    var $tabContent = $('<div role="tabpanel" class="tab-pane" id="' + key + '"></div>');

    $wrapper.find('.nav').append($tabTitle);
    $wrapper.find('.tab-content').append($tabContent);

    for (var name in detail) {
      $tabContent.append('<p>' + name + ':' + detail[name] + '</p>')
    }
  }

  $('.pkt-modal-lg').modal('show');

}
