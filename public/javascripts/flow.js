var moment = require('moment');
var utils = require(__dirname + '/../javascripts/utils.js');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname + '/../../database/packet.db');

$(document).ready(function () {

  var lenChartWrapper = document.getElementById('lenChart');
  var lenChart = echarts.init(lenChartWrapper, 'dark');
  var pktLenData = [];
  var pktNumData = [];

  db.all('SELECT * FROM PACKET ORDER BY STIME ASC', function (err, rows) {
    if (rows.length === 0) {
      lenChartWrapper.innerHTML = '<p class="text-muted">没有流量数据, 请先抓取</p>';
      return;
    }
    var lastSec = new Date(rows[0].STIME).getUTCSeconds();
    var len = 0;
    var pacNum = 0;
    rows.forEach(function (row) {
      var curSec = new Date(row.STIME).getUTCSeconds();
      if (lastSec === curSec) {
        len += row.PLEN;
        pacNum += 1;
      } else {
        var time = moment(new Date(row.STIME)).format('GGGG.MM.D H:mm:ss');
        pktLenData.push({
          time: time,
          value: len
        });
        pktNumData.push({
          time: time,
          value: pacNum
        });
        len = 0;
        pacNum = 0;
        lastSec = curSec;
      }
    });
    if (len > 0) {
      pktLenData.push({
        time: moment(new Date(rows[rows.length - 1].STIME)).format('GGGG.MM.D H:mm:ss'),
        value: len
      });
    }

    var timeData = pktNumData.map(function (pkt) {
      return pkt.time;
    });

    lenOption = {
      title : {
        text: '数据流量及数据包数量统计',
        x: 'center',
        align: 'right'
      },
      toolbox: {
        feature: {
          restore: {},
          saveAsImage: {}
        }
      },
      tooltip : {
        trigger: 'axis',
        axisPointer: {
          animation: true
        },
        position: [0, 0]
      },
      grid: [{
        'top': '15%',
        height: '35%'
      }, {
        top: '55%',
        height: '35%'
      }],
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 30,
          end: 70,
          xAxisIndex: [0, 1]
        },
        {
          type: 'inside',
          realtime: true,
          start: 30,
          end: 70,
          xAxisIndex: [0, 1]
        }
      ],
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          axisLine: {
            onZero: true
          },
          data: timeData
        },
        {
          gridIndex: 1,
          type : 'category',
          boundaryGap : false,
          axisLine: {
            onZero: true
          },
          data: timeData,
          show: false,
          position: 'top'
        }
      ],
      yAxis : [
        {
          name : '流量',
          type : 'value',
          splitLine: {
            show: false
          }
        },
        {
          gridIndex: 1,
          name : '数据包数量',
          type : 'value',
          inverse: true,
          splitLine: {
            show: false
          }
        }
      ],
      series : [
        {
          name:'流量',
          type:'line',
          symbol: 'none',
          sampling: 'average',
          data: pktLenData
        },
        {
          name:'数据包数量',
          type:'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbol: 'none',
          sampling: 'average',
          data: pktNumData
        }
      ]
    };

    lenChart.setOption(lenOption);

  });

});
