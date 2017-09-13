import React, { Component } from 'react';
import { connect } from 'react-redux';
import PieChart from './PieChart.jsx'
import DatePicker from 'material-ui/DatePicker';
import { defaultCategories } from '../config/constants';


const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const style = {
  root: {
    width: '60%'
  }
};

const mapStateToProps = (state) => ({
  list: state.tasks.list,
  categories: [...defaultCategories, ...state.settings.categories]
});

@connect(mapStateToProps)
export default class ViewAnalytics extends Component {
    state = {
      dateFrom: Date.parse(new Date(Date.now() - 30 * MILLISECONDS_PER_DAY).toDateString()),
      dateTo: Date.parse(new Date(Date.now() + 1 * MILLISECONDS_PER_DAY).toDateString()),
      data: []
    }

    componentDidMount() {
      this.updateData();
    }

    componentWillReceiveProps() {
      this.updateData();
    }

    getTotalTime = (periods) => {
      const { dateFrom, dateTo } = this.state;
      return periods
        ? periods.reduce((total, period) => {
                const start = ((period.dateStart < dateFrom) && ((period.dateComplete || Date.now()) > dateFrom))
                ? dateFrom
                : period.dateStart;
                const finish = ((period.dateStart < dateTo) && ((period.dateComplete || Date.now()) > dateTo))
                ? dateTo
                : period.dateComplete || Date.now();
                return total + (finish - start);
              }
          , 0)
        : 0;
    };

    updateData = () => {
      const { list, categories } = this.props;
      const data = Object.keys(list).reduce((result, el) =>
          result.find(item => item.category === list[el].category)
          ? result.map(item => item.category === list[el].category
              ? { ...item, time: item.time + this.getTotalTime(list[el].periods) }
              : item)
          : [...result, { category: list[el].category, time: this.getTotalTime(list[el].periods) }]
        , []);
      this.setState({
        data: data.map(el => ({
            name: categories.find(cat => cat.id === el.category).name,
            y: el.time
        }))
      });
    }

    handleDateFromChange = (event, dateFrom) => {
      this.setState({ dateFrom: Date.parse(dateFrom) }, this.updateData);
    };

    handleDateToChange = (event, dateTo) => {
      this.setState({ dateTo: Date.parse(dateTo) }, this.updateData);
    };

    render() {
        return (
            <div style={style.root}>
                <h2>Analytics</h2>
                <DatePicker
                    autoOk
                    hintText='From'
                    maxDate={new Date()}
                    value={new Date(this.state.dateFrom)}
                    onChange={this.handleDateFromChange}
                />
                <DatePicker
                    autoOk
                    hintText='To'
                    value={new Date(this.state.dateTo)}
                    onChange={this.handleDateToChange}
                />
                <PieChart
                  data={this.state.data}
                />
            </div>
        );
    }
}
