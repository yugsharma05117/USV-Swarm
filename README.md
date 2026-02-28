# 🌊 USV Swarm – AI-Powered Maritime Surveillance Simulator

A real-time web simulation of autonomous Unmanned Surface Vehicles (USVs) patrolling coastal zones, detecting threats, and sending alerts — visualized on a real-world map interface.

<br>
**Note:** A Mapbox public token is required. Add it in a `.env` file.

---

## 💡 Project Concept: Why “USV Swarm”?

India’s coastline spans over **7,500 km**, requiring 24/7 scalable surveillance. Manned ships are costly and limited in range.  
**USV Swarm** imagines a scalable, AI-based fleet of **unmanned surface vessels (water drones)** that autonomously patrol seas, detect intrusions (like smuggling, piracy, or unauthorized vessels), and alert nearby defense assets — all without risking human life.

This website acts as a **digital twin simulation** of such a system:
- Autonomous USVs patrolling real-world ocean maps
- Rule-based AI detecting threats within a defined radius
- Ships and naval units reacting to alerts
- Realtime dashboard logging and visualization

Built for:
- Defense hackathons and demo showcases
- DRDO, ISRO, HAL, BEL, and Indian Navy R&D
- Future-ready digital simulation of coastal command systems

---


## 📌 Project Highlights

- 🌐 Real-world map using Mapbox
- 🚤 AI-enabled USV patrol simulation
- 🔴 Manual threat injection and detection
- ⚠️ Real-time alerts and geofencing logic
- 📊 Secure dashboard for USV and ship status
- 🎯 Built for defense, drone, and surveillance innovation

---

## 🧪 Core Features

| Feature                  | Description                                                  |
|--------------------------|--------------------------------------------------------------|
| 🗺 Real Map              | Powered by Mapbox GL JS for realistic ocean visualization    |
| 🚤 Autonomous USVs      | Randomized movement with surveillance range                  |
| 🎯 Threat Detection     | Rule-based logic using geofencing and distance checks        |
| 🚨 Alert System         | Real-time UI alerts and ship notifications                   |
| 🛥 Civilian/Navy Ships  | Static and moving vessels shown on the map                   |
| 📊 Tailored Dashboard   | Tracks USV status and threat logs in real-time               |
| 🎨 Defense UI Theme     | Built using Tailwind CSS with a secure military aesthetic     |

---

## 🧰 Tech Stack

- **Frontend**: React (Vite)
- **UI Framework**: Tailwind CSS
- **Mapping Engine**: Mapbox GL JS
- **Geo Logic**: Turf.js (for threat detection + range checks)


---

## ⚙️ Local Setup

```bash
git clone https://github.com/your-username/usv-swarm.git
cd USV-Swarm
npm install
npm run dev
To build for deployment:

bash
Copy code
npm run build
🚨 Simulation Flow
The app loads with a real coastal map and active USVs.

Click Inject Threat to place a red threat marker at a random ocean location.

If any USV is within its surveillance radius, it detects the threat.

USV status turns red, and an alert is triggered on the dashboard.

Ships within threat radius are notified automatically.

📄 License
This simulation is open for educational, R&D, and non-commercial use.
To request licensing or customization for defense/enterprise deployment, contact the project maintainer.

🙌 Credits
Conceptualized with a focus on India's 7500+ km coastline security


Uses Mapbox, Turf.js, React, and Tailwind CSS
