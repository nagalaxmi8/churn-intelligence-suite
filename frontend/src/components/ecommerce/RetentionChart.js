import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);

function RetentionChart({before,after}){

const chartData={
labels:["Before Strategy","After Strategy"],
datasets:[
{
label:"Churn %",
data:[before*100,after*100],
backgroundColor:["red","green"]
}
]
};

return(

<div className="card">

<h3>Retention Impact</h3>

<div className="chart">
<Bar data={chartData}/>
</div>

</div>

);

}

export default RetentionChart;