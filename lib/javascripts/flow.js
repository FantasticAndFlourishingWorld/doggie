var electron = require('electron');
var lbs = require('node-qqwry');
var moment = require('moment');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname + '/../../database/packet.db');
var utils = require(__dirname + '/../javascripts/utils.js');

var ipc = electron.ipcRenderer;

$(document).ready(function () {

  var lenChartWrapper = document.getElementById('lenChart');
  var mapChartWrapper = document.getElementById('mapChart');
  var lenChart = echarts.init(lenChartWrapper, 'shine');
  var mapChart = echarts.init(mapChartWrapper, 'shine');

  lenChart.showLoading();
  mapChart.showLoading();

  var pktLenData = [];
  var pktNumData = [];
  var timeData = [];
  var srcMapData = [];
  var dstMapData = [];
  var mapData = [];

  db.all('SELECT * FROM PACKET ORDER BY STIME ASC', function (err, rows) {
    db.close();

    if (err || rows.length === 0) {
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
        len = Math.round(len / 1024 * 100) / 100;
        pktLenData.push({
          time: time,
          value: len
        });
        pktNumData.push({
          time: time,
          value: pacNum
        });
        timeData.push(time);
        len = 0;
        pacNum = 0;
        lastSec = curSec;

        // var srcGeoName = lbs.getArea(row.SIP);
        // var dstGeoName = lbs.getArea(row.DIP);
        // var srcLastChar = srcGeoName[srcGeoName.length - 1];
        // var dstLastChar = dstGeoName[dstGeoName.length - 1];
        var srcBounds = lbs.getBounds(row.SIP);
        // .map(function (bound) {
        //   return bound.toFixed(2);
        // });

        var dstBounds = lbs.getBounds(row.DIP);
        // .map(function (bound) {
        //   return bound.toFixed(2);
        // });

        var bounds = [
          [srcBounds[0], srcBounds[1]],
          [srcBounds[2], srcBounds[3]],
          [dstBounds[0], dstBounds[1]],
          [dstBounds[2], dstBounds[3]]
        ];

        // if (srcLastChar === '市' || srcLastChar === '省') {
        //   srcGeoName = srcGeoName.slice(0, -1);
        // }
        // if (dstLastChar === '市' || dstLastChar === '省') {
        //   dstGeoName = dstGeoName.slice(0, -1);
        // }
        // var srcGeoIndex = srcMapData.findIndex(function (data) {
        //   return srcGeoName === data.name;
        // });
        // var dstGeoIndex = dstMapData.findIndex(function (data) {
        //   return dstGeoName === data.name;
        // });
        // if (srcGeoIndex < 0) {
        //   srcMapData.push({
        //     'name': srcGeoName,
        //     'value': 1
        //   });
        // } else {
        //   srcMapData[srcGeoIndex] = {
        //     'name': srcMapData[srcGeoIndex].name,
        //     'value': srcMapData[srcGeoIndex].value + 1
        //   };
        // }
        // if (dstGeoIndex < 0) {
        //   dstMapData.push({
        //     'name': dstGeoName,
        //     'value': 1
        //   });
        // } else {
        //   dstMapData[dstGeoIndex] = {
        //     'name': dstMapData[dstGeoIndex].name,
        //     'value': dstMapData[dstGeoIndex].value + 1
        //   };
        // }

        mapData = mapData.concat(bounds);
      }

      if (len > 0) {
        var lastTime = moment(new Date(rows[rows.length - 1].STIME)).format('GGGG.MM.D H:mm:ss');
        pktLenData.push({
          time: lastTime,
          value: len
        });
        timeData.push(lastTime);
      }

    });

    lenChart.hideLoading();
    mapChart.hideLoading();

    var lenOption = {
      backgroundColor: '#FFFFFF',
      title : {
        text: '数据流量及数据包数量统计图',
        subtext: '统计抓取的数据包数量, 按时间分布',
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
          name : '流量(KB)',
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

    var mapOption = {
      backgroundColor: '#FFFFFF',
      title : {
        text: 'ip位置热力图',
        subtext: '根据持久化存储的数据包ip信息绘制的热力图',
        x: 'center',
        align: 'right'
      },
      toolbox: {
        feature: {
          restore: {},
          saveAsImage: {}
        }
      },
      visualMap: {
        min: 0,
        splitNumber: 5,
        color: ['#50a3ba', '#eac736', '#d94e5d'],
        colorAlpha: 0.5
      },
      geo: {
        map: 'china',
        label: {
          emphasis: {
            show: false
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#323c48',
            borderColor: '#111'
          },
          emphasis: {
            areaColor: '#2a333d'
          }
        }
      },
      series: [{
        name: 'ip地理位置',
        type: 'heatmap',
        // type: 'scatter',
        coordinateSystem: 'geo',
        data: mapData,
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: false
          }
        },
        itemStyle: {
          emphasis: {
            borderColor: '#fff',
            borderWidth: 1
          }
        }
      }]
    };
    mapChart.setOption(mapOption);

  });

});
