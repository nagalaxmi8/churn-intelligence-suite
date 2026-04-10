import React,{useState} from "react";
import ShapChart from "./ShapChart";
import RetentionChart from "./RetentionChart";
import RiskPieChart from "./RiskPieChart";

function BatchAnalysis(){

const [file,setFile]=useState(null);
const [result,setResult]=useState(null);

const upload = async () => {

    console.log("Upload started");

    const formData = new FormData();
    formData.append("file", file);

    try{

        const res = await fetch("http://localhost:8001/ecommerce/batch_predict",{
            method:"POST",
            body:formData
        });

        console.log("Response received:", res);

        const json = await res.json();
        console.log("JSON received:", json);

        setResult(json);

    }catch(err){
        console.error("Upload error:",err);
    }
};

    const customers = result?.customers || [];
    // console.log("Customers data:", customers);
return(

<div className = "batch">

<div className="card1">
<h3>Batch CSV Analysis</h3>

<input
type="file"
accept=".csv" className="batch-input"
onChange={(e)=>setFile(e.target.files[0])}
/>

<button className="predictBtn" onClick={upload}>
Run Batch Analysis
</button>

</div>

{result && (

<div className="dashboardGrid">

{/* CARD 1 */}
<div className="card center">
<h2>Dataset Summary</h2>

<h3>Total Customers: {result.total_customers}</h3>
<h3>Predicted Churn: {result.total_churn}</h3>
<h3>Churn Percentage: {(result.churn_rate*100).toFixed(2)}%</h3>
</div>

{/* CARD 2 */}
{result.risk_distribution && (
<div className="card">
<RiskPieChart
key={JSON.stringify(result.risk_distribution)}
data={result.risk_distribution}
/>
</div>
)}

{/* CARD 3 */}
{result.top_reasons && (
<div className="card">
<ShapChart data={result.top_reasons}/>
</div>
)}

{/* CARD 4 */}
{result.new_probability_after_strategy && (
<div className="card">
<RetentionChart
before={result.churn_rate}
after={result.new_probability_after_strategy}
/>
</div>
)}

</div>

)}

{/* RETENTION STRATEGIES */}

{result && result.recommended_actions && (

<div className="card">

<h3>Retention Strategies</h3>

{result.recommended_actions.map((a,i)=>(
<p key={i}>• {a}</p>
))}

</div>

)}

{/* CUSTOMER TABLE */}

{customers.length>0 && (

<div className="card">

<h3>Customer Churn Probabilities</h3>

<table className="customerTable">

<thead>
<tr>
<th>Customer</th>
<th>Probability</th>
<th>Risk</th>
</tr>
</thead>

<tbody>

{customers.map((c,i)=>(
<tr key={i}>
<td>{c.customer_id}</td>
<td>{(c.probability*100).toFixed(2)}%</td>
<td>{c.risk}</td>
</tr>
))}

</tbody>

</table>

</div>

)}

</div>

);

}

export default BatchAnalysis;