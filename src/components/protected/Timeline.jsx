import React, { Component } from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock.src';
import { Highcharts } from 'react-highcharts';

Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

const config = {
    chart: {
          type: 'column'
    },
    rangeSelector: {
        selected: 1
    },
    title: {
        text: 'Timeline'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y:.1f}h</b>'
    },
    series: [{
        name: 'Time per day',
    }]
};


export default class Timeline extends Component {
  state = {
      taskID: '',
  }

  shouldComponentUpdate(nextProps) {
    if (this.state.taskID === nextProps.id) {
      return false;
    }
    this.setState({ taskID: nextProps.id });
    return true;
  }

  render() {
    return (
      <div style={{width: '95%', border: 'thin lightgrey dashed'}}>
        {
          this.props.data
          ? <ReactHighstock config={{ ...config, series: [{ ...config.series[0], data: this.props.data }] }} />
          : <h3>No data...</h3>
        }
      </div>
    );
  }
}
