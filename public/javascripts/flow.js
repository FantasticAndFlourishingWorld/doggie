var moment = require('moment');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname + '/../../database/packet.db');

$(document).ready(function () {

  var lenChart = echarts.init(document.getElementById('lenChart'));
  var pktLenData = [];
  var pktNumData = [];

  db.all('SELECT * FROM PACKET ORDER BY STIME ASC', function (err, rows) {
    if (rows.length === 0) {
      // No data
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

    lenOption = {
      title : {
        text: '数据流量及数据包数量统计',
        x: 'center',
        align: 'right'
      },
      grid: {
        bottom: 80
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
        position: function (pt) {
          return [pt[0], '40%'];
        }
      },
      legend: {
        data:['流量','数据包数'],
        x: 'left'
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 10
      }, {
        start: 0,
        end: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data: pktNumData.map(function (pkt) {
            return pkt.time;
          }),
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          name: '流量',
          type: 'value',
          nameLocation: 'start',
          boundaryGap: [0, '50%'],
          splitLine: {
            show: false
          }
        },
        {
          name: '数据包数',
          nameLocation: 'start',
          type: 'value',
          boundaryGap: [0, '80%'],
          inverse: true,
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
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
          data: pktLenData
        },
        {
          name: '数据包数',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          itemStyle: {
            normal: {
              color: 'rgb(131, 70, 255)'
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(68, 158, 255)'
              }, {
                offset: 1,
                color: 'rgb(131, 70, 255)'
              }])
            }
          },
          data: pktNumData
        }
      ]
    };

    lenChart.setOption(lenOption);

  });

});
