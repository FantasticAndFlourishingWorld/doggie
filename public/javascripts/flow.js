var electron = require('electron');
var utils = require(__dirname + '/../javascripts/utils.js');

var ipc = electron.ipcRenderer;

$(document).ready(function () {

  var lenChartWrapper = document.getElementById('lenChart');
  var mapChartWrapper = document.getElementById('mapChart');
  var lenChart = echarts.init(lenChartWrapper, 'dark');
  var mapChart = echarts.init(mapChartWrapper, 'dark');

  lenChart.showLoading();
  mapChart.showLoading();

  ipc.on('getChartDataDone', function (event, data) {
    data = JSON.parse(data);
    lenChart.hideLoading();
    mapChart.hideLoading();

    var lenOption = {
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
          data: data.timeData
        },
        {
          gridIndex: 1,
          type : 'category',
          boundaryGap : false,
          axisLine: {
            onZero: true
          },
          data: data.timeData,
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
          data: data.pktLenData
        },
        {
          name:'数据包数量',
          type:'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbol: 'none',
          sampling: 'average',
          data: data.pktNumData
        }
      ]
    };
    lenChart.setOption(lenOption);

    var mapOption = {
      title : {
        text: 'ip地理位置',
        x: 'center',
        align: 'right'
      },
      visualMap: {
        min: 0,
        max: 10000,
        splitNumber: 5,
        color: ['#d94e5d','#eac736','#50a3ba'],
        textStyle: {
          color: '#fff'
        }
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
        // type: 'scatter',
        type: 'heatmap',
        coordinateSystem: 'geo',
        // data: convertData(srcMapData),
        data: data.mapData,
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: true
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

  ipc.send('getChartData');

});
