import React, { Fragment } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class PieChart extends React.Component {
  chartComponentRef: any;
  constructor(props: any) {
    super(props);
    const { active = 0, inActive = 0 } = props as any;
    this.state = {
      chartOptions: {
        chart: {
          type: 'pie',
          height: '220px',
          backgroundColor: null, // Chart background is transparent
          events: {
            load: function () {
              const chart = this as any;
              // Coordinates for the center of the chart
              const centerX = chart.plotLeft + (chart.plotWidth * 0.5);
              const centerY = chart.plotTop + (chart.plotHeight * 0.52);
              const radius = 98; // Radius for the surrounding circle, if necessary

              // Use the renderer to add an image in the middle
              // Replace 'https://example.com/your-image.png' with the URL of your image
              chart.renderer.image(
                '/images/Graphuser.svg',
                centerX - (radius * 0.5), // Adjust these values as needed to position your image
                centerY - (radius * 0.5),
                radius, // width of the image
                radius // height of the image
              ).add();
            }
          }
        },
        title: {
          text: '' // No title
        },
        plotOptions: {
          pie: {
            innerSize: '50%',
            borderWidth: 0,
            size: 180,
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b><br />{point.percentage:.1f}%'
            },
            accessibility: {
              point: {
                valueSuffix: '%'
              }
            },
          }
        },
        series: [{
          data: [
            { name: 'Active', color: '#F47954', y: active, percentage: (active / (active + inActive)) * 100 },
            { name: 'InActive', color: '#565656', y: inActive, percentage: (inActive / (active + inActive)) * 100 }
          ]
        }]
      }
    } as any;

    this.chartComponentRef = React.createRef();
  }

  render() {

    const { chartOptions = {} } = this.state as any;

    return (
      <Fragment>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          ref={this.chartComponentRef}
        //containerProps={{ style: { height: "215px", width: "350px" } }}
        />
      </Fragment>
    );
  }
}

export default PieChart;
