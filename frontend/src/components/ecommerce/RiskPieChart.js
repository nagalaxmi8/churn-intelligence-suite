import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
ArcElement,
Tooltip,
Legend
);

function RiskPieChart({data}){

const chartData={
labels:["High Risk","Medium Risk","Low Risk"],
datasets:[
{
data:[
data.high,
data.medium,
data.low
],
backgroundColor:["red","orange","green"]
}
]
};

return(
<div className="card">

<h3>Risk Distribution</h3>

<div style={{width:"250px",height:"250px",margin:"auto"}}>
<Pie data={chartData}/>
</div>

</div>
);

}

export default RiskPieChart;