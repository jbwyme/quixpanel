import { Component } from 'panel';
import counterTemplate from './app.jade';

const objToQueryString = params => {
  return Object.keys(params).map(k => [k, encodeURIComponent(params[k])].join('=')).join('&');
}

const API = {
  get: (endpoint, params = {}, secret) => {
    return fetch('https://mixpanel.com/api/2.0/' + endpoint + '?' + objToQueryString(params), {
      headers: {
        'Authorization': 'Basic ' + btoa(secret),
      },
      method: 'GET',
    })
    .then(response => {
      if (response.status < 400 || response.body) {
        return response.json();
      } else {
        return {error: response.statusText};
      }
    })
  },
};

document.registerElement('quixpanel-app', class extends Component {
  get config() {
    return {
      defaultState: {
        apiSecret: '',
        event: 'Viewed report',
        where: '',
        on: 'properties["tab"] == "segmentation"',
        from_date: '2016-09-01',
        to_date: '2016-10-01',
        unit: 'week',
      },

      helpers: {
        apiSecretChanged: e => {
          this.update({apiSecret: document.querySelector('#apiSecretInput').value});
          this.executeQuery();
        },
        eventChanged: e => {
          this.update({event: document.querySelector('#eventInput').value});
          this.executeQuery();
        },
        filterChanged: e => {
          this.update({where: document.querySelector('#filterInput').value});
          this.executeQuery();
        },
        segmentChanged: e => {
          this.update({on: document.querySelector('#segmentInput').value});
          this.executeQuery();
        }
      },

      template: counterTemplate,
    };
  }

  start() {

  }

  executeQuery() {
    API.get('segmentation', {
      event: this.state.event,
      type: 'general',
      limit: '150',
      on: this.state.on,
      where: this.state.where,
      from_date: this.state.from_date,
      to_date: this.state.to_date,
      unit: this.state.unit,
    }, this.state.apiSecret)
    .then(response => {
      console.log(JSON.stringify(response));
      const COLORS = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'];
      var vals = response.data.values;
      var data = [];
      var i = 0;
      for (var segment in vals) {
        i++;
        var values = Object.keys(vals[segment]).map(key => {
          return {
            x: new Date(key),
            y: vals[segment][key],
          }
        });
        values.sort((a, b) => a.x - b.x);
        data.push({
          values: values,
          key: segment,
          color: COLORS[i % COLORS.length],
        })
      }
      console.log(JSON.stringify(data));
      this.renderChart(data);
    })
  }

  renderChart(data) {
      var chart;
      nv.addGraph(() => {
        chart = nv.models.lineChart()
            .options({
                duration: 300,
                useInteractiveGuideline: true
            });
        chart.xAxis
            .axisLabel("Date")
            .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)); });
        chart.yAxis
            .axisLabel('Event count')
            .tickFormat(function(d) {
                if (d == null) {
                    return 'N/A';
                }
                return d3.format(',.2f')(d);
            });

        this.chartData = this.chartData || d3.select('#chart').append('svg').datum(data);

        this.chartData
            .datum(data)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });

  }
});

const app = document.createElement('quixpanel-app');
document.body.appendChild(app);
app.start();
