import { useNavigate } from "react-router-dom";
import RoadmapSection from "./RoadMap";

export default function LearnMore() {
  const navigate = useNavigate();

  return (
    <div className="learn-container">

      <nav className="learn-nav">
        <h2>USV Swarm System</h2>
        <button onClick={() => navigate("/")}>← Back</button>
      </nav>

      <section className="learn-hero">
        <h1 style={{fontSize: "50px"}}>About the Project</h1>
        <p>
          An AI-enabled Unmanned Surface Vehicle (USV) swarm system designed
          for intelligent, scalable, and continuous coastal surveillance.
        </p>
      </section>

      <section className="learn-section">
        <h2 style={{color: "#FFFFFF", fontSize: "24px"}}>Problem Statement</h2>
        <p>
          Coastal monitoring traditionally relies on expensive manned patrol ships,
          delayed response mechanisms, and high operational risk to human personnel.
        </p>
      </section>

      <section className="learn-section">
        <h2 style={{ color: "#FFFFFF", fontSize: "24px"}}>Our Solution</h2>
        <p>
          A distributed swarm of autonomous USVs equipped with geospatial mapping,
          AI-based anomaly detection, and automated alert coordination.
        </p>
      </section>

      <section className="learn-section">
        <h2 style={{color: "#FFFFFF", fontSize: "24px"}}>Key Features</h2>
        <ul>
          <li>Real-time vessel monitoring</li>
          <li>AI-driven anomaly detection</li>
          <li>Restricted zone alert system</li>
          <li>Swarm-based collaborative response</li>
          <li>Centralized command dashboard</li>
        </ul>
      </section>

    <RoadmapSection />
      {/* CONTRIBUTORS SECTION */}
      <section className="contributors-section">
        <h2 style={{color: "#white", fontSize: "40px", textAlign: "center"}}>Project Contributors</h2>

        <div className="contributors-grid">
          <div className="contributor-card">
            <h3>Yug Sharma</h3>
            <p>Frontend Developer and System Architecture</p>
          </div>

          <div className="contributor-card">
            <h3>Kakul Mittal</h3>
            <p>Backend Development & System Architecture</p>
          </div>

          <div className="contributor-card">
            <h3>Samriddhi Bansal</h3>
            <p>Backend Development and System Architecture</p>
          </div>
          </div>
        
      </section>
      {/* TERMS & CONDITIONS */}
<section className="terms-section">
  <h2>Terms & Conditions</h2>

  <div className="terms-content">
    <h3>1. Prototype Disclaimer</h3>
    <p>
      This project is a simulation-based prototype developed for academic
      and research demonstration purposes. It does not represent a deployed
      defense-grade surveillance system.
    </p>

    <h3>2. Data Usage</h3>
    <p>
      All geospatial data and vessel movement patterns used within the system
      are simulated and do not reflect real-time maritime operations.
    </p>

    <h3>3. Intellectual Property</h3>
    <p>
      The design, architecture, and implementation of the USV Swarm System
      remain the intellectual property of the development team unless
      otherwise agreed.
    </p>

    <h3>4. Limitation of Liability</h3>
    <p>
      The system is provided for educational and demonstration purposes only.
      The developers assume no liability for real-world operational use.
    </p>

    <h3>5. Future Development</h3>
    <p>
      Any integration with real satellite, radar, or maritime systems would
      require regulatory approval, compliance validation, and security review.
    </p>
  </div>
</section>

    </div>
  );
}