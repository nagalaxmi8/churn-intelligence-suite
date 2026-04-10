import React from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    padding: "40px",
    textAlign: "center"
  },

  header: {
    marginBottom: "50px",
    animation: "fadeIn 1s ease-in"
  },

  // ✅ FIXED VISIBILITY
  title: {
    fontSize: "42px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#ffffff",
    textShadow: "0 2px 10px rgba(0,0,0,0.6)"   // 🔥 key fix
  },

  subtitle: {
    fontSize: "18px",
    color: "#e0e0e0"
  },

  // ✅ FORCE 2x2 GRID
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",   // 🔥 FIXED
    gap: "30px",
    maxWidth: "800px",
    margin: "0 auto"
  },

  card: {
  position: "relative",
  padding: "30px",
  borderRadius: "16px",
  cursor: "pointer",
  overflow: "hidden",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "180px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
  transition: "all 0.3s ease"
},

  footer: {
    marginTop: "60px",
    fontSize: "14px",
    color: "#bbb"
  },

overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(44, 44, 44, 0.75)"   // 🔥 increase opacity → darker
},

content: {
  position: "relative",
  zIndex: 2,
  textAlign: "center"
},

cardTitle: {
  fontSize: "22px",
  fontWeight: "bold",
  marginBottom: "10px",
  color: "#ffffff",
  textShadow: "0 2px 10px rgba(0,0,0,0.9)"
}

};
  return (
    <div style={styles.page}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>Customer Churn Intelligence Platform</h1>
        <p style={styles.subtitle}>
          Analyze, predict, and reduce customer churn across multiple industries
        </p>
      </div>

      {/* DOMAIN CARDS */}
      <div style={styles.grid}>

  {/* 🏦 BANKING */}
  <div
    style={{
      ...styles.card,
      backgroundImage: `url("https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW9uZXl8ZW58MHx8MHx8fDA%3D")`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
    }}
    onClick={() => navigate("/banking")}
  >
    <div style={styles.overlay}></div>

    <div style={styles.content}>
      <h2 style={styles.cardTitle}>🏦 Banking</h2>
      <p>Analyze customer retention and financial behavior</p>
    </div>
  </div>


  {/* 🛒 E-COMMERCE */}
  <div
    style={{
      ...styles.card,
      backgroundImage: `url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWNvbW1lcmNlJTIwd2Vic2l0ZXxlbnwwfHwwfHx8MA%3D%3D")`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
    }}
    onClick={() => navigate("/ecommerce")}
  >
    <div style={styles.overlay}></div>

    <div style={styles.content}>
      <h2 style={styles.cardTitle}>🛒 E-Commerce</h2>
      <p>Understand purchase patterns and churn triggers</p>
    </div>
  </div>


  {/* 📡 TELECOM */}
  <div
    style={{
      ...styles.card,
      backgroundImage: `url("https://images.unsplash.com/photo-1504384308090-c894fdcc538d")`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
    }}
    onClick={() => navigate("/telecom")}
  >
    <div style={styles.overlay}></div>

    <div style={styles.content}>
      <h2 style={styles.cardTitle}>📡 Telecom</h2>
      <p>Detect subscription drop-offs and service dissatisfaction</p>
    </div>
  </div>


  {/* 🎬 NETFLIX */}
  <div
    style={{
      ...styles.card,
      backgroundImage: `url("https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmV0ZmxpeHxlbnwwfHwwfHx8MA%3D%3D")`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
    }}
    onClick={() => navigate("/netflix")}
  >
    <div style={styles.overlay}></div>

    <div style={styles.content}>
      <h2 style={styles.cardTitle}>🎬 Netflix</h2>
      <p>Predict user engagement and subscription cancellations</p>
    </div>
  </div>

</div>
</div>
  );
}

export default App;