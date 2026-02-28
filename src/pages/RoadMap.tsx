import { useEffect, useRef, useState } from "react";


const roadmapData = [
  {
    title: "Phase 1 – Prototype Simulation",
    description:
      "Developed geospatial simulation with real-time USV movement and threat detection logic.",
  },
  {
    title: "Phase 2 – AI Threat Classification",
    description:
      "Integrating anomaly detection models to classify suspicious vessel behavior patterns.",
  },
  {
    title: "Phase 3 – Satellite & Radar Integration",
    description:
      "Connecting real-time maritime satellite feeds and radar systems for live deployment.",
  },
  {
    title: "Phase 4 – Autonomous Swarm Communication",
    description:
      "Implementing decentralized communication protocol between USVs for adaptive coordination.",
  },
  {
    title: "Phase 5 – Defense Deployment Ready",
    description:
      "Scalable deployment with secure encrypted channels and centralized command intelligence.",
  },
];

export default function RoadmapSection() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisible((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.4 }
    );

    refs.current.forEach((ref) => ref && observer.observe(ref));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="roadmap-section">
      <h2>Future Roadmap</h2>
      <div className="timeline">
        {roadmapData.map((item, index) => (
          <div
            key={index}
            data-index={index}
            ref={(el) => (refs.current[index] = el)}
            className={`timeline-item ${
              visible.includes(index) ? "show" : ""
            }`}
          >
            <div className="timeline-dot" />
            <div className="timeline-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}