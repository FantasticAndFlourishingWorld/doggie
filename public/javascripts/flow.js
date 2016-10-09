var moment = require('moment');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname + '/../../database/packet.db');

$(document).ready(function () {

  var flowChart = echarts.init(document.getElementById('flowChart'));
  var pktData = [];

  db.all('SELECT * FROM PACKET ORDER BY STIME ASC', function (err, rows) {
    if (rows.length === 0) {
      // No data
      return;
    }
    var lastSec = new Date(rows[0].STIME).getUTCSeconds();
    var len = 0;
    rows.forEach(function (row) {
      var curSec = new Date(row.STIME).getUTCSeconds();
      if (lastSec === curSec) {
        len += row.PLEN;
      } else {
        pktData.push({
          time: moment(new Date(row.STIME)).format('GGGG.MM.D H:mm:ss'),
          value: len
        });
        len = 0;
        lastSec = curSec;
      }
    });
    if (len > 0) {
      pktData.push({
        time: moment(new Date(rows[rows.length - 1].STIME)).format('GGGG.MM.D H:mm:ss'),
        value: len
      });
    }

    option = {
      title: {
        left: 'center',
        text: '流量'
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: true
        },
        position: function (pt) {
          return [pt[0], '20%'];
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: pktData.map(function (pkt) {
          return pkt.time;
        }),
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: [{
        name: '流量',
        type: 'line',
        smooth: true,
        symbol: 'none',
        sampling: 'average',
        itemStyle: {
          normal: {
            color: 'rgb(255, 70, 131)'
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgb(255, 158, 68)'
            }, {
              offset: 1,
              color: 'rgb(255, 70, 131)'
            }])
          }
        },
        data: pktData
      }]
    };

    flowChart.setOption(option);

  });

});
