import React, { useState } from "react";
import InputForm from "./InputForm";
import ProbabilityCard from "./ProbabilityCard";
import ShapChart from "./ShapChart";
import RetentionChart from "./RetentionChart";
import BatchAnalysis from "./BatchAnalysis";
import "./dashboard.css";

function Main(){

const [mode,setMode] = useState("single");

const [data,setData] = useState({
Tenure:10,
OrderCount:2,
DaySinceLastOrder:5,
CashbackAmount:100,
SatisfactionScore:3,
Complain:0,
CouponUsed:0,
CityTier:1,
PreferredLoginDevice:"mobile",
PreferredPaymentMode:"upi"
});

const [result,setResult] = useState(null);

const predict = async () => {

const res = await fetch("http://localhost:8001/ecommerce/predict",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
});

const json = await res.json();
setResult(json);

};

return(

<div className="mainWrapper">

<h1 className="title">
Customer Churn Intelligence Dashboard
</h1>

<div className="modeButtons">

<button onClick={()=>setMode("single")}>
Single Customer Analysis
</button>

<button onClick={()=>setMode("batch")}>
Batch Analysis
</button>

</div>

{mode === "single" && (

<>

<InputForm
data={data}
setData={setData}
predict={predict}
/>

<div className="dashboard">

{result && (

<>

<div className="fullWidth">
  <ProbabilityCard prob={result.churn_probability}/>
</div>

<ShapChart data={result.top_reasons}/>

<RetentionChart
before={result.churn_probability}
after={result.new_probability_after_strategy}
/>

<div className="card">

<h3>Retention Strategies</h3>

{result.recommended_actions.map((a,i)=>(
<p key={i}>• {a}</p>
))}

</div>

</>

)}

</div>

</>

)}

{mode === "batch" && <BatchAnalysis/>}

</div>

);

}

export default Main;