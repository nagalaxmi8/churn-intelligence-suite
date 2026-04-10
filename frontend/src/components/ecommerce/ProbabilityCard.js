import React from "react";

function ProbabilityCard({prob}){

const p=(prob*100).toFixed(2);

let risk="low";

if(p>40) risk="high";
else if(p>20) risk="medium";

return(

<div className="card center">

<h2>Churn Probability</h2>

<h1>{p}%</h1>

<h3 className={risk}>
Risk Level: {risk.toUpperCase()}
</h3>

</div>

);

}

export default ProbabilityCard;