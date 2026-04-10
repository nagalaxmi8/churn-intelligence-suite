import { bankingAdapter, ecommerceAdapter, telecomAdapter, netflixAdapter } from "./adapters";

const modelConfig = {
  banking: {
    endpoint: "http://127.0.0.1:8000/bank/predict",
    adapter: bankingAdapter,
    fields: ["credit_score","age","tenure","balance","products_number","credit_card","active_member","estimated_salary"]
  },

  ecommerce: {
    endpoint: "http://localhost:8000/ecommerce/predict",
    adapter: ecommerceAdapter,
    fields: ["Tenure","OrderCount","DaySinceLastOrder","CashbackAmount","SatisfactionScore","Complain","CouponUsed","CityTier","PreferredLoginDevice","PreferredPaymentMode"]
  },

  telecom: {
    endpoint: "http://localhost:8000/telecom_predict",
    adapter: telecomAdapter,
    fields: ["Age","Number_of_Dependents","Tenure_in_Months","Monthly_Charge","Total_Charges","City"]
  },

  netflix: {
    endpoint: "http://127.0.0.1:5000/predict",
    adapter: netflixAdapter,
    fields: ["last_login_days","watch_hours","profiles","avg_watch_time","monthly_fee"]
  }
};

export default modelConfig;