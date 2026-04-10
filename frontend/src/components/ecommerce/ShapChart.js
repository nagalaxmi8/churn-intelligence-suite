
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
function ShapChart({data}){

const chartData={
labels:data.map(r=>r[0]),
datasets:[
{
label:"Impact %",
data:data.map(r=>Math.abs(r[1])*100),
backgroundColor:"steelblue"
}
]
};

return(

<div className="card">

<h3>Top Churn Drivers</h3>

<div className="chart">
<Bar data={chartData}/>
</div>

<p>
Each bar shows how much that feature increases churn probability.
Example: 6% means that feature increases churn risk by 6%.
</p>

</div>

);

}

export default ShapChart;