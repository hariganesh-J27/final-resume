/* ==========================================================================
   YOUR CONTENT — edit this file only.
   Everything on the site is rendered from the object below.
   Content was taken from https://portfolio-1-three-dun.vercel.app/

   Items marked  // EDIT  still need a real value from you.
   ========================================================================== */
window.SITE = {
  // ---- Identity ----------------------------------------------------------
  name: "Hari Ganesh J",
  brand: "HG.J",                                   // short mark in the nav pill
  footerWord: "Hari Ganesh",                       // giant word at the bottom
  title: "AI/ML Engineer & Dual-Degree CS Student",
  email: "hariganesh.j2025@vitstudent.ac.in",
  phone: "+91 6382924624",
  location: "Chennai, Tamil Nadu, India",
  resume: "assets/resume.pdf",                     // your resume PDF (the button hides if this is left empty)
  resumeName: "Hari-Ganesh-J-Resume.pdf",          // file name the browser saves it as

  // ---- Hero --------------------------------------------------------------
  // Words appear ONE BY ONE: each slide replaces the previous one.
  // Set heroGhost to true to draw a faint outline echo of the same word behind it.
  heroGhost: false,
  heroSlides: [
    { word: "HELLO",   sub: "Hello, world." },
    { word: "HARI",    sub: "I'm Hari Ganesh J" },
    { word: "AI & ML", sub: "AI & ML Engineer" }
  ],

  // Intro block revealed at the end of the hero
  // (same layout as your old site: small hello line, huge name, typed line, outlined button + links)
  intro: {
    hello: "Hello, world.",
    heading: ["I'm Hari", "Ganesh J"],               // one entry per line
    typed: "AI & ML Engineer • Student at VIT & IIT Madras",   // typed out letter by letter
    button: "More about me",                          // scrolls to the About section
    hint: "Scroll — Click the void"                   // clicking the hero background bursts dots
  },

  // ---- About / timeline ---------------------------------------------------
  about: {
    eyebrow: "[02] Story & Journey",
    heading: "Who I Am & Where I've Been",
    stats: [
      { value: 2,  pad: 2, suffix: "",  label: "Degrees in parallel" },
      { value: 10, pad: 0, suffix: "+", label: "AI systems engineered" },
      { value: 4,  pad: 2, suffix: "",  label: "Verified certifications" }
    ],
    // cat: "core" = Core Story tab, "edu" = Education & Work tab
    items: [
      { cat: "core", label: "About", title: "Who I Am", sub: "AI & ML Engineer",
        text: "I build intelligent systems that live between silicon and cloud — from ESP32 edge nodes streaming live telemetry to PyTorch vision models and ROS2 autonomous agents.",
        tags: ["AI & ML", "Edge Robotics", "IoT", "Cloud"] },
      { cat: "edu", label: "Journey", title: "Sishya School", sub: "2023 — 2025 · Hosur, Tamil Nadu",
        text: "Completed senior secondary and secondary schooling at Sishya School, Hosur.",
        tags: ["School", "Completed"] },
      { cat: "edu", label: "Journey", title: "VIT Chennai", sub: "2025 — 2029",
        text: "B.Tech in Computer Science & Engineering (Core) at VIT Chennai.",
        tags: ["B.Tech", "CSE (Core)", "Chennai"] },
      { cat: "edu", label: "Journey", title: "IIT Madras", sub: "2025 — 2029",
        text: "BS in Data Science & Applications at IIT Madras, studied in parallel with the B.Tech (Online / Hybrid).",
        tags: ["BS", "Data Science & Applications", "Online / Hybrid"] },
      { cat: "core", label: "IoT", title: "Sensor Telemetry", sub: "Hardware systems",
        text: "ESP32 accelerometer arrays streaming ADXL345 vibration data over WebSocket telemetry pipelines — edge to dashboard in milliseconds.",
        tags: ["ESP32", "ADXL345", "WebSockets", "Edge Compute"] },
      { cat: "core", label: "AI & ML", title: "Deep Learning", sub: "Neural architectures",
        text: "Deep neural networks and PyTorch vision systems — CNNs, ResNets and Scikit-Learn ensembles engineered for clinical diagnosis and feature ranking.",
        tags: ["PyTorch", "CNN / ResNet", "Scikit-Learn", "Random Forest"] },
      { cat: "core", label: "Robotics", title: "Autonomous Robotics", sub: "ROS2 & simulation",
        text: "ROS2 Gazebo 3D simulation environments and PyTorch LSTM trajectory predictors for autonomous UAV flight and obstacle avoidance.",
        tags: ["ROS2 Humble", "Gazebo 11", "PyTorch LSTM", "C++ Nodes"] },
      { cat: "core", label: "Cloud", title: "Cloud AI & MLOps", sub: "Agent infrastructure",
        text: "Docker containerisation, FastAPI asynchronous inference endpoints and automated AWS/GCP CI/CD deployment pipelines.",
        tags: ["FastAPI", "Docker", "AWS", "CI/CD"] }
    ]
  },

  // ---- Tech stack: 5-stage pipeline --------------------------------------
  tech: {
    eyebrow: "[03] Tech Stack",
    heading: "What I Use & How I Build",
    // color = card/glow colour (r,g,b); hue = laser colour of the tunnel while this stage is active
    stages: [
      { name: "Code", color: "88,166,255", hue: 0.4,
        tools: ["Python 3.12", "C++20", "PyTorch 2.3", "CUDA"],
        text: "Production-grade algorithmic code — core data structures, low-level system calls and the maths behind AI/ML model execution." },
      { name: "Learn", color: "163,113,247", hue: 0.25,
        tools: ["Scikit-Learn", "Random Forest", "CNN / ResNet", "SQL"],
        text: "Machine learning and databases: CNNs, ResNets and ensembles for real diagnosis problems, backed by carefully designed relational data." },
      { name: "Sense", color: "34,211,238", hue: 0.5,
        tools: ["ESP32", "ADXL345", "WebSockets", "Edge Compute"],
        text: "Hardware and IoT sensor telemetry — accelerometer arrays streaming vibration data from edge to dashboard in milliseconds." },
      { name: "Cloud", color: "245,158,11", hue: 0.92,
        tools: ["FastAPI", "Docker", "AWS", "CI/CD"],
        text: "Cloud AI agents and microservices — containerised inference endpoints and automated AWS/GCP deployment pipelines." },
      { name: "Telemetry", color: "63,185,80", hue: 0.62,
        tools: ["WebGL", "GLSL", "Canvas", "ROS2 Viz"],
        text: "Real-time WebGL visualisation of sensor fields, simulation states and model internals." }
    ]
  },

  // ---- Certificates -------------------------------------------------------
  certs: {
    eyebrow: "[04] Credentials",
    heading: "Certifications & Badges",
    blurb: "Four verified credentials across modern AI, data science and agentic AI on AWS.",
    profileLabel: "Credentials directory",
    profileUrl: "https://portfolio-1-three-dun.vercel.app/credentials.html",
    // logo = the issuer's symbol shown on the card; file = the certificate PDF it opens (new tab) when clicked.
    // A card with no `file` falls back to `url`.
    items: [
      { title: "Introduction to Modern AI",         issuer: "Cisco Networking Academy · 18 Jun 2026",
        logo: "assets/certificates/logo-cisco.png",
        url: "https://portfolio-1-three-dun.vercel.app/credentials.html" },     // EDIT — add the PDF as `file:` when you have it
      { title: "Introduction to Data Science",      issuer: "Cisco Networking Academy · 19 Jun 2026",
        logo: "assets/certificates/logo-cisco.png",
        file: "assets/certificates/cisco-intro-to-data-science.pdf" },
      { title: "Introduction to Agentic AI on AWS", issuer: "AWS Training & Certification · 24 Jun 2026",
        logo: "assets/certificates/logo-aws.png",
        file: "assets/certificates/aws-intro-to-agentic-ai.pdf" },
      { title: "Introduction to AI",                issuer: "Google & Coursera · 23 Jun 2026",
        logo: "assets/certificates/logo-google.png",
        file: "assets/certificates/google-coursera-intro-to-ai.pdf" }
    ]
  },

  // ---- Projects -----------------------------------------------------------
  projects: {
    eyebrow: "[05] Projects Section · Selected Works",
    items: [
      { cat: "Featured Hardware · Apr 2024", title: "Wearable Scoliosis Detection",
        desc: "IoT wearable posture monitor using an ESP32 with ADXL345 accelerometer arrays, feeding neural regression models for real-time Cobb angle estimation.",
        tags: ["ESP32", "PyTorch", "ADXL345", "WebSockets"],
        live: "", more: "https://portfolio-1-three-dun.vercel.app/projects.html", moreLabel: "Inspect architecture", accent: "63,185,80",
        mock: { title: "Cobb Angle Monitor", badge: "LIVE", stat: "94.2%", statLabel: "COBB ANGLE ACCURACY", lines: ["< 15ms latency", "ESP32 + ADXL345"] } },
      { cat: "ML Spotlight · Oct 2024", title: "Disease Prediction",
        desc: "Clinical diagnostic ML pipeline using Random Forest, evaluating patient health parameters with cross-validation tuning and feature-importance rankings.",
        tags: ["Python", "Scikit-Learn", "Random Forest", "Pandas"],
        live: "", more: "https://portfolio-1-three-dun.vercel.app/projects.html", moreLabel: "Inspect architecture", accent: "168,85,247",
        mock: { title: "Random Forest Model", badge: "TRAINED", stat: "94.8%", statLabel: "CV ACCURACY", lines: ["Gini importance", "Cross-validated"] } },
      { cat: "Robotics AI · Jan 2025", title: "ROS2 Drone & Gazebo",
        desc: "Spatial-temporal trajectory forecasting pipeline using ROS2 nodes, PyTorch LSTM networks and Gazebo 3D simulation for autonomous UAV flight.",
        tags: ["ROS2", "Gazebo", "PyTorch", "C++"],
        live: "", more: "https://portfolio-1-three-dun.vercel.app/projects.html", moreLabel: "Inspect architecture", accent: "88,166,255",
        mock: { title: "ROS2 Flight Node", badge: "SIM", stat: "LSTM", statLabel: "TRAJECTORY FORECASTING", lines: ["Gazebo 11", "ROS2 Humble"] } },
      { cat: "DBMS & ACID · Aug 2024", title: "Movie Ticket Booking",
        desc: "High-concurrency database design for multi-theatre seat reservations, with stored-procedure transaction locks and real-time availability updates.",
        tags: ["DBMS", "SQL", "Stored Procedures"],
        live: "", more: "https://portfolio-1-three-dun.vercel.app/projects.html", moreLabel: "Inspect architecture", accent: "245,158,11",
        mock: { title: "Booking Engine", badge: "ACID", stat: "0%", statLabel: "DOUBLE BOOKING", lines: ["< 20ms query lock", "Seat locking"] } },
      { cat: "SQL Architecture · Dec 2024", title: "Hospital Management",
        desc: "End-to-end relational system for hospital operations — patient records, staff scheduling, automated billing and role-based security.",
        tags: ["PostgreSQL", "SQL", "Data Modeling"],
        live: "", more: "https://portfolio-1-three-dun.vercel.app/projects.html", moreLabel: "Inspect architecture", accent: "244,63,94",
        mock: { title: "Hospital DB", badge: "RBAC", stat: "3NF", statLabel: "NORMALISED ER MODEL", lines: ["Role-based access", "Automated billing"] } }
    ]
  },

  // ---- Contact + footer ---------------------------------------------------
  contact: {
    eyebrow: "[06] Next Steps",
    heading: ["Let's build", "something", "together."],
    blurb: "Have a project in mind, a question about my work, or just want to say hi? My inbox is always open. I'll try my best to get back to you!"
  },
  footer: {
    blurb: "AI/ML engineer and dual-degree student at VIT Chennai × IIT Madras, building intelligent systems between silicon and cloud.",
    socials: [
      { label: "GitHub",   url: "https://github.com/hariganesh-J27" },          // from your resume
      { label: "LinkedIn", url: "https://www.linkedin.com/in/hariganesh-j" },   // from your resume
      { label: "Email",    url: "mailto:hariganesh.j2025@vitstudent.ac.in" }
    ]
  }
};
