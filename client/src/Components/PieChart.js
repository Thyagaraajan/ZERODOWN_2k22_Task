
import React from "react";
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  PieSeries,
  Title,
  Legend
} from '@devexpress/dx-react-chart-material-ui';
import "./PieChart.css"  


const PieChart = (props)=>{

    const data = props.data;
    const city = props.city;
    console.log(data)

    return (
        <div className="chart">
        <Paper width="50%">
        <Chart
          data={data}
        >
          <PieSeries valueField="value" argumentField="place"/>
          <Title className="pieTitle" text={`Amenities in ${city}`}/>
          <Legend className="label"/>
        </Chart>
      </Paper>
      </div>
    );

}

export default PieChart;