import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const PortChart = ({ liquidityData }) => {
  const timestampList = liquidityData.map(data =>
    new Date(data.timestamp * 1000).toLocaleString()
  );
  const dataList = liquidityData.map(data => data.liquidity);

  // Cấu hình option cho ECharts
  const option = {
    color: "#F3BA2F",
    tooltip: {
      padding: [16, 16, 8, 16],
      backgroundColor: "#121218",
      extraCssText:
        "pointer-events: all; overflow: auto; max-width: 400px; white-space: normal; box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, .1); border-radius: 4px; max-height: 200px;",
      textStyle: {
        color: "#fff",
        fontSize: 12,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, Segoe UI, "PingFang SC", "Helvetica Neue", Helvetica, Arial, "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif'
      },
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    legend: { show: false },
    grid: {
      top: "25%",
      left: "0%",
      right: "0%",
      bottom: "5%",
      containLabel: true
    },
    yAxis: {
      type: "value",
      axisLabel: { color: 'white' },
      splitLine: {
        show: false,
        lineStyle: { color: "#F3BA2F" }
      }
    },
    xAxis: {
      type: "category",
      boundaryGap: true,
      axisTick: { show: false },
      axisLabel: { color: 'white' },
      data: timestampList
    },
    series: [
      {
        type: "line",
        smooth: true,
        emphasis: { focus: "series" },
        showSymbol: false,
        data: dataList,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "#F3BA2F" },
              { offset: 0.05, color: "#F3BA2F" },
              { offset: 1, color: "#142028" }
            ],
            global: false
          }
        }
      }
    ]
  };

  // Tạo HTML nội tuyến nhúng ECharts
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>ECharts</title>
        <style>
          html, body, #chart {
            height: 100%;
            margin: 0;
            background-color: transparent;
          }
        </style>
      </head>
      <body>
        <div id="chart"></div>
        <script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
        <script>
          var chart = echarts.init(document.getElementById('chart'));
          var option = ${JSON.stringify(option)};
          chart.setOption(option);
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView 
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        // Nếu cần tương tác thêm, có thể cấu hình injectedJavaScript, onMessage, v.v.
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 350,
    borderRadius: 16,
    overflow: 'hidden'
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent'
  }
});

export default PortChart;
