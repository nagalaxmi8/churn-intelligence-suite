import React from "react";
import "./dashboard.css";
function InputForm({ data, setData, predict }) {

const update = (e) => {
setData({ ...data, [e.target.name]: e.target.value });
};

return (

<div className="inputBar">

<div className="inputRow">

<div className="field">
<label>Tenure</label>
<input type="number" name="Tenure" value={data.Tenure} onChange={update}/>
</div>

<div className="field">
<label>Orders</label>
<input type="number" name="OrderCount" value={data.OrderCount} onChange={update}/>
</div>

<div className="field">
<label>Days Since Order</label>
<input type="number" name="DaySinceLastOrder" value={data.DaySinceLastOrder} onChange={update}/>
</div>

<div className="field">
<label>Cashback</label>
<input type="number" name="CashbackAmount" value={data.CashbackAmount} onChange={update}/>
</div>

<div className="field">
<label>Satisfaction</label>
<input type="number" name="SatisfactionScore" value={data.SatisfactionScore} onChange={update}/>
</div>

<div className="field">
<label>Complaint</label>
<select name="Complain" onChange={update}>
<option value="0">No</option>
<option value="1">Yes</option>
</select>
</div>

<div className="field">
<label>Coupon</label>
<select name="CouponUsed" onChange={update}>
<option value="0">No</option>
<option value="1">Yes</option>
</select>
</div>

<div className="field">
<label>City</label>
<select name="CityTier" onChange={update}>
<option value="1">Tier1</option>
<option value="2">Tier2</option>
<option value="3">Tier3</option>
</select>
</div>

<div className="field">
<label>Device</label>
<select name="PreferredLoginDevice" onChange={update}>
<option value="mobile">Mobile</option>
<option value="computer">Computer</option>
</select>
</div>

<div className="field">
<label>Payment</label>
<select name="PreferredPaymentMode" onChange={update}>
<option value="credit card">Credit</option>
<option value="debit card">Debit</option>
<option value="upi">UPI</option>
<option value="cod">COD</option>
<option value="e wallet">Wallet</option>
</select>
</div>

<button className="predictBtn" onClick={predict}>
Predict
</button>

</div>

</div>

);

}

export default InputForm;