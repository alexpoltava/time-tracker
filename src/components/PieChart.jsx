import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import highcharts3d from 'highcharts/highcharts-3d';

highcharts3d(ReactHighcharts.Highcharts);

const config = {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        }
    },
    title: {
        text: 'Time spent'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }
    },
    series: [{
        type: 'pie',
        name: 'Time by categories',
    }]
};

export default class PieChart extends Component {
  render() {
    return (
      this.props.data.length
      ? <ReactHighcharts config={{ ...config, series: [{ ...config.series[0], data: this.props.data }] }} />
      : <h3>No data...</h3>
    );
  }
}
