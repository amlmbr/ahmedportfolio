/* ============================================================
   AHMED_PROFILE — single canonical source of truth
   Used by: the client chatbot (retrieval + curated answers) and,
   via the context it builds, the Llama 3.2 server route.
   Loaded as a global BEFORE portfolio.js so it works offline (file://),
   on the local dev server, and on Vercel — no fetch, no duplication.
   Keep facts here only; UI text lives in index.html.
   ============================================================ */
window.AHMED_PROFILE = {
  identity: {
    name: 'Ahmed Moubarak Lahlyal',
    role: 'AI Engineer',
    tagline: 'Trustworthy AI · Generative AI · Data Engineering',
    email: 'lahlyalmoubarak@gmail.com',
    linkedin: 'https://linkedin.com/in/ahmed-moubarak-lahlyal-015839257',
    github: 'https://github.com/amlmbr'
  },

  // ---- Professional & R&D experience (rendered as a timeline) ----
  experiences: [
    {
      id: 'listic', org: 'LISTIC Laboratory', sub: 'Université Savoie Mont Blanc / Polytech Annecy-Chambéry',
      location: 'Annecy, France', start: 'Feb 2026', end: 'Jul 2026', current: true,
      role: 'Final-Year R&D Internship — Secure Document AI, LLMs & Agentic Security',
      project: 'SecureDocAI', target: 'securedocai',
      problem: 'How can an organization use LLMs over sensitive documents without giving every user access to everything?',
      worked: ['Document ingestion & OCR / native PDF parsing', 'Information extraction → canonical JSON', 'PII / PHI detection & protected storage', 'Vector index + Knowledge Graph, RAG / Graph-RAG', 'Agent orchestration, RBAC, prompt-injection & jailbreak filtering', 'Secure retrieval, output validation, risk classification', 'FastAPI services, Docker, evaluation & scientific writing'],
      contribution: 'I designed and implemented major parts of the end-to-end system as part of the LISTIC research team — from document processing and knowledge retrieval to security mechanisms, LLM orchestration and experimental evaluation.',
      tech: ['Python', 'FastAPI', 'LangGraph', 'CrewAI', 'LangChain', 'RAG', 'Graph-RAG', 'Neo4j', 'ChromaDB', 'Presidio', 'SBERT', 'XGBoost', 'OCR', 'Docker'],
      result: '500 documents · 6,000 scenarios · 97.8% RBAC compliance · 95% authorized utility · leakage 15.39% → 0.21% · PII/PHI micro-F1 0.96 · ROC-AUC 0.98.',
      takeaway: 'For sensitive AI, access control, provenance and output validation cannot be afterthoughts.'
    },
    {
      id: 'um6p', org: 'Mohammed VI Polytechnic University (UM6P)', sub: 'Smart Data Analysis Systems Research Group',
      location: 'Morocco', start: 'Jul 2025', end: 'Oct 2025',
      role: 'Research Internship — Multimodal AI & Biomedical Time Series',
      project: 'NeurologiqueTWIN', target: 'projects',
      problem: 'How can heterogeneous EEG and IMU signals be combined to support neurological monitoring and early-event prediction?',
      worked: ['EEG & IMU signal cleaning and synchronization', 'Segmentation / windowing & time-series representation', 'Feature extraction', 'Deep learning: CNN architectures + attention', 'Multimodal learning', 'Real-time monitoring & risk indicators', 'Digital-twin visualization'],
      contribution: 'Designed and implemented the experimental pipeline for preprocessing, synchronizing and modelling multimodal EEG/IMU signals, and developed the deep-learning and visualization components for neurological monitoring.',
      tech: ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'Pandas', 'NumPy', 'CNN', 'Attention', 'EEG', 'IMU', 'Streamlit'],
      result: '≈92% internal classification accuracy · 6–10 pp improvement in pre-crisis recall · 2nd Prize Innov\'Boost 2025.',
      takeaway: 'In multimodal AI, synchronization and signal quality can matter as much as model architecture.'
    },
    {
      id: 'aquadviser', org: 'AQUADVISER', sub: 'Data Science Internship',
      location: '', start: 'May 2025', end: 'Jul 2025',
      role: 'Data Science Internship — Graph-RAG & Knowledge Graphs',
      project: 'Graph-RAG Decision Support', target: 'projects',
      problem: 'How can business information be retrieved using both semantic similarity and the explicit relationships between entities?',
      worked: ['Data ingestion & cleaning', 'Entity & relationship modelling', 'Neo4j knowledge graph construction', 'Vector embeddings & semantic search', 'Graph traversal & hybrid retrieval', 'LLM integration (RAG / Graph-RAG)', 'FastAPI, provenance & traceability, architecture documentation'],
      contribution: 'Developed a Graph-RAG architecture combining semantic vector retrieval with knowledge-graph relationships to produce more contextual and traceable decision-support responses.',
      tech: ['Python', 'FastAPI', 'Neo4j', 'Embeddings', 'Vector Search', 'SQL', 'LLMs', 'RAG', 'Graph-RAG'],
      result: 'Grounded, source-attributed answers that use both similarity and explicit relationships.',
      takeaway: 'Vector similarity and explicit graph relationships solve different retrieval problems and can complement each other.'
    },
    {
      id: 'ocp', org: 'OCP Group', sub: 'Software Development & Data Analytics Internship',
      location: 'Morocco', start: 'Jul 2024', end: 'Aug 2024',
      role: 'Software Development & Data Analytics Internship — the data foundation',
      project: 'Survey & Analytics Platform', target: 'projects',
      problem: 'Transform collected business information into structured data, operational indicators and decision-support reporting.',
      worked: ['Web application development', 'Data collection', 'SQL database design', 'Data analysis & KPIs', 'Operational reporting & dashboards', 'Data visualization'],
      contribution: 'Developed a web-based survey and analytics platform connected to a SQL database and created operational indicators and reporting views.',
      tech: ['SQL', 'Web Development', 'Data Visualization', 'KPI Design', 'Reporting'],
      result: 'A working survey → SQL → KPI reporting platform.',
      takeaway: 'This experience gave me the data and software foundations that later supported my Machine Learning and AI projects.'
    }
  ],

  // ---- SecureDocAI headline metrics (reused by the interview deck) ----
  secureDoc: {
    metrics: [
      { v: '500', k: 'Documents', c: 'c' },
      { v: '6,000', k: 'Scenarios', c: 'c' },
      { v: '97.8%', k: 'RBAC compliance', c: 'g' },
      { v: '95%', k: 'Authorized utility', c: 'g' }
    ],
    leakageFrom: '15.39%', leakageTo: '0.21%', leakageReduction: '98.6%',
    small: [ { v: '0.96', k: 'PII / PHI micro-F1' }, { v: '0.98', k: 'Risk classifier ROC-AUC' } ]
  },

  // ---- Reusable animated pipelines (nodes; t = optional tooltip; branch = parallel pair) ----
  pipelines: {
    'securedocai-doc': { title: 'Document Intelligence', accent: 'cyan', nodes: [
      { l: 'Documents' }, { l: 'OCR / Native PDF Parsing', t: 'Scanned pages are OCR-ed; native PDFs are parsed directly.' }, { l: 'Layout Analysis', t: 'Detects structure — headings, tables, sections.' }, { l: 'Document Profiling' }, { l: 'Language / Domain Routing', t: 'Routes each document to the right domain pipeline.' }, { l: 'Information Extraction' }, { l: 'Canonical JSON', t: 'Heterogeneous documents become one normalized schema.' }, { l: 'PII / PHI Detection', t: 'Sensitive personal / health data is detected and tagged.' }, { l: 'Protected Storage' }, { l: 'Vector Index' }, { l: 'Knowledge Graph', t: 'Explicit entities and relationships for relationship-aware retrieval.' }
    ] },
    'securedocai-sec': { title: 'Secure AI Governance', accent: 'amber', nodes: [
      { l: 'User Query' }, { l: 'Authenticated Role', t: "The user's verified role drives what they may access." }, { l: 'Security Guard' }, { l: 'Injection / Jailbreak Detection', t: 'Adversarial prompts are detected and filtered.' }, { l: 'Session / Query Risk Analysis' }, { l: 'Policy Filtering' }, { l: 'Authorized Retrieval', t: "Only information permitted by the user's role and policy enters the context." }, { l: 'Context Minimization', t: 'The prompt is reduced to the minimum needed to answer.' }, { l: 'Controlled LLM' }, { l: 'Output Firewall', t: 'The generated answer is checked before it leaves the system.' }, { l: 'Final Validation' }, { l: 'Audited Answer' }
    ] },
    'securedocai-eval': { title: 'Evaluation', accent: 'cyan', nodes: [
      { l: '500 Documents' }, { l: '5 Domains' }, { l: '6,000 Scenarios' }, { l: 'Normal Queries' }, { l: 'Sensitive Queries' }, { l: 'Adversarial Queries' }, { l: 'RBAC Tests' }, { l: 'PII / PHI Tests' }, { l: 'Leakage Evaluation' }, { l: 'Utility Evaluation' }, { l: 'Final Metrics' }
    ] },
    'neurologiquetwin': { title: 'EEG + IMU → Digital Twin', accent: 'cyan', nodes: [
      { l: 'EEG + IMU Signals' }, { l: 'Signal Cleaning' }, { l: 'Temporal Synchronization' }, { l: 'Segmentation / Windowing' }, { l: 'Feature Extraction' }, { l: 'CNN + Attention' }, { l: 'Risk / Event Classification' }, { l: 'Real-Time Monitoring' }, { l: 'Digital Twin' }
    ] },
    'graphrag': { title: 'Hybrid Graph-RAG', accent: 'cyan', nodes: [
      { l: 'Domain Data' }, { l: 'Ingestion & Cleaning' }, { l: 'Entity + Relationship Modelling' }, { branch: ['Neo4j Knowledge Graph', 'Embeddings / Vector Retrieval'] }, { l: 'Hybrid Retrieval' }, { l: 'Context Fusion' }, { l: 'LLM' }, { l: 'Traceable Answer' }
    ] },
    'multiagent': { title: 'Controlled Agent Workflow', accent: 'cyan', nodes: [
      { l: 'Business Question' }, { l: 'Understanding Agent' }, { l: 'SQL Generation Agent' }, { l: 'Consistency / Safety Check' }, { l: 'Controlled Execution' }, { l: 'KPI Computation' }, { l: 'Visualization' }, { l: 'NL Synthesis' }, { l: 'Human Validation' }
    ] },
    'gear5': { title: 'Teacher → Student Distillation', accent: 'amber', nodes: [
      { l: 'Dataset' }, { l: 'Shared Tokenization' }, { l: 'TinyLLaMA Teacher' }, { l: 'Teacher Signals' }, { l: 'Adaptive Multi-Signal Gating', t: 'Gates on confidence, token cross-entropy, sequence difficulty and energy budget.' }, { l: 'DistilGPT2 Student' }, { l: 'Knowledge Distillation' }, { l: 'INT8 Quantization' }, { l: 'Evaluation' }
    ] },
    'forex': { title: 'Big Data + RL Trading', accent: 'cyan', nodes: [
      { l: 'Market Data' }, { l: 'Kafka Streams' }, { l: 'Spark Processing' }, { l: 'Feature Engineering' }, { l: 'NoSQL Storage' }, { l: 'Forecasting Models', t: 'LSTM, RNN, Random Forest.' }, { l: 'RL Trading Agents' }, { l: 'Risk Constraints' }, { l: 'Dashboard' }
    ] },
    'swim': { title: 'Vision + Sensor Fusion', accent: 'cyan', nodes: [
      { l: 'Cameras + Wearable Sensors' }, { l: 'Pose / Key-Point Detection' }, { l: 'Lane-to-Athlete Association' }, { l: 'Sensor Fusion' }, { l: 'Movement Analysis' }, { l: 'Technical Indicators' }, { l: 'Automated Feedback' }, { l: 'Digital Twin' }
    ] },
    'ecommerce': { title: 'Real-Time E-commerce', accent: 'cyan', nodes: [
      { l: 'Customer Events' }, { l: 'Kafka' }, { l: 'Spark Streaming' }, { l: 'Session / Basket Transforms' }, { l: 'PostgreSQL' }, { l: 'Business KPIs' }, { l: 'Superset Dashboard' }
    ] },
    'cvjob': { title: 'Semantic Matching', accent: 'cyan', nodes: [
      { l: 'CV + Job Description' }, { l: 'Text Processing' }, { l: 'Skill Extraction' }, { branch: ['TF-IDF', 'SBERT Embeddings'] }, { l: 'Similarity Scoring' }, { l: 'Candidate Ranking' }, { l: 'Explainable Match Score' }, { l: 'Interface' }
    ] },
    'flightdelay': { title: 'ETL → BI', accent: 'amber', nodes: [
      { l: '500k+ Flight Records' }, { l: 'Talend ETL' }, { l: 'Data Quality' }, { l: 'Transformations' }, { l: 'MySQL' }, { l: 'Analytical Model' }, { l: 'BI Dashboards' }, { l: 'Delay KPIs / Bottlenecks' }
    ] },
    'ahmedai': { title: 'Profile-grounded AI', accent: 'cyan', nodes: [
      { l: 'User Question' }, { l: 'Intent Analysis' }, { l: 'Profile Retrieval' }, { l: 'Relevant Ahmed Context' }, { l: 'Prompt Construction' }, { l: 'Llama 3.2' }, { l: 'Grounded Answer' }
    ] }
  },

  // ---- Retrieval corpus: each entry is one grounding unit ----
  // group is used to assemble balanced overviews; kw drives lexical retrieval.
  sections: [
    { id: 'identity', group: 'profile', kw: 'who is ahmed about yourself profile overview introduce presentation different makes 60 second',
      text: 'Ahmed Moubarak Lahlyal is an AI & Data Engineer with a strong data-engineering foundation and hands-on experience across machine learning, deep learning, generative AI, knowledge graphs, multimodal systems and trustworthy AI. He works across the full AI lifecycle — data, models, retrieval, agents, APIs, security, evaluation and deployment — and has both research and applied-engineering experience.' },
    { id: 'summary', group: 'profile', kw: 'summary strengths what does he do value engineer',
      text: 'Ahmed combines research rigor with engineering delivery. His profile spans industrial data analytics (OCP), knowledge graphs and Graph-RAG (AQUADVISER), multimodal deep-learning research (UM6P) and trustworthy generative AI (LISTIC, SecureDocAI). He is a co-author of a peer-reviewed publication (CityEcoScout) and has a scientific manuscript in preparation (SecureDocAI).' },
    { id: 'education', group: 'profile', kw: 'education degree school university efrei ensa master studies graduate diploma',
      text: 'Engineering degree in Computer Science and Emerging Technologies from ENSA El Jadida (June 2026). Next: Advanced Master in Data and Generative AI Engineering at EFREI Paris (2026–2027), on an apprenticeship rhythm of 2 weeks in company / 1 week at school.' },
    { id: 'apprenticeship', group: 'practical', kw: 'apprenticeship alternance schedule rhythm availability contract work study',
      text: 'Ahmed is starting the Advanced Master at EFREI Paris (2026–2027) on a work-study contract: 2 weeks in the company and 1 week at school — strong continuity on real engineering work with a regular academic anchor.' },

    // Professional / research experiences
    { id: 'exp-ocp', group: 'experience', kw: 'ocp group data analytics analyst industrial reporting sql dashboard 2024 experience when dates software web survey',
      text: 'OCP Group (Jul 2024 – Aug 2024) — Software Development & Data Analytics internship in a large industrial environment. Ahmed built a web-based survey and analytics platform connected to a SQL database, with KPIs, operational reporting and dashboards. This is his data / software foundation — an industrial experience, not a research internship.' },
    { id: 'exp-aquadviser', group: 'experience research', kw: 'aquadviser graph rag knowledge graph neo4j retrieval hybrid embeddings 2025 experience knowledge representation when dates data science',
      text: 'AQUADVISER (May 2025 – Jul 2025) — Data Science internship on knowledge representation and Graph-RAG: Ahmed built a hybrid retrieval architecture combining vector embeddings and a Neo4j knowledge graph with LLMs, served via FastAPI, for traceable decision-support answers.' },
    { id: 'exp-um6p', group: 'experience research', kw: 'um6p research multimodal eeg imu deep learning digital twin signals 2025 experience neurologiquetwin sdas when dates mohammed vi',
      text: 'UM6P — Smart Data Analysis Systems Research Group (Jul 2025 – Oct 2025) — Research internship in multimodal AI & biomedical time series: NeurologiqueTWIN, fusing EEG and IMU signals with deep learning (CNN + attention) for neurological monitoring and early-event prediction (≈92% internal accuracy; 6–10 pp pre-crisis recall improvement; 2nd Prize Innov\'Boost 2025).' },
    { id: 'exp-listic', group: 'experience research', kw: 'listic universite savoie mont blanc polytech annecy chambery secure document ai research 2026 experience trustworthy when dates final year internship',
      text: 'LISTIC Laboratory, Université Savoie Mont Blanc / Polytech Annecy-Chambéry, Annecy (Feb 2026 – Jul 2026) — Final-year R&D internship on secure document AI, LLMs & agentic security: SecureDocAI. Ahmed designed and implemented major parts of the end-to-end system. Scientific manuscript in preparation with Faiza Loukil and Hervé Verjus.' },

    // Research
    { id: 'research-interests', group: 'research', kw: 'research interests focus topics areas explore studying',
      text: 'Research interests: Trustworthy Generative AI, Secure RAG, Agentic AI, Knowledge Graphs, Multimodal Learning, Predictive Modeling, Document Intelligence, Digital Twins, Industrial AI, AI Security, Human-in-the-Loop AI and Model Evaluation. Focus: AI systems that combine strong predictive or generative capabilities with security, traceability, evaluation and real-world engineering constraints.' },
    { id: 'research-progression', group: 'research', kw: 'research progression journey evolved moved knowledge representation multimodal trustworthy',
      text: 'Ahmed\'s research progressed from knowledge representation (AQUADVISER — Graph-RAG + Knowledge Graphs), to multimodal intelligence (UM6P — EEG + IMU + deep learning), to trustworthy generative AI (LISTIC — SecureDocAI, RAG, agents and security).' },
    { id: 'pub-cityecoscout', group: 'research publications', kw: 'cityecoscout publication published paper ijceds sustainable smart city geospatial gemini co-author first publication article journal',
      text: 'PUBLISHED — CityEcoScout: "A Platform for Exploring Sustainable Locations Worldwide." Peer-reviewed original software publication in the International Journal of Computer Engineering and Data Science (IJCEDS), Vol. 4, Issue 1, 2025, pp. 41–54. Authors: Bader Eddine Benhirt, Yasmine Fihri, Ahmed Moubarak Lahlyal, Rahhal Errattahi — Ahmed is a co-author. An AI-enabled platform for exploring sustainable urban locations by combining geographic services (Google Maps, Street View, Places APIs), environmental analytics and generative AI (Gemini). It is collaborative work, not Ahmed\'s solo project. Page: https://www.ijceds.com/ijceds/article/view/81' },
    { id: 'manuscript-securedocai', group: 'research publications', kw: 'securedocai manuscript preparation publication research listic loukil verjus in progress not published paper writing',
      text: 'IN PREPARATION — SecureDocAI: "Trustworthy Document AI and Secure LLM-Based Information Access." Scientific manuscript in preparation at the LISTIC Laboratory (Université Savoie Mont Blanc / Polytech Annecy-Chambéry) with Faiza Loukil and Hervé Verjus. NOT yet published. It covers secure document intelligence and controlled LLM-based access for sensitive multi-domain documents.' },

    // Projects
    { id: 'proj-securedocai', group: 'projects flagship', kw: 'securedocai flagship secure document rbac governance leakage pii phi access control output firewall prompt injection agents',
      text: 'SecureDocAI (flagship trustworthy-AI research project, LISTIC 2026) answers: how can an organization use LLMs over sensitive documents without giving every user access to everything? Two layers — Document Intelligence (OCR, extraction, canonical JSON, PII/PHI detection, vector index, knowledge graph) and Secure AI Governance (authenticated role, prompt-injection/jailbreak detection, policy filtering, authorized retrieval, context minimization, controlled LLM, output firewall, final validation). Ahmed designed and implemented major parts as part of the research team. It is one important part of his profile — not the whole profile.' },
    { id: 'proj-securedocai-metrics', group: 'projects', kw: 'securedocai results metrics evaluation rbac leakage scenarios documents utility roc auc micro f1',
      text: 'SecureDocAI evaluation: 500 documents, 6,000 scenarios, 97.8% RBAC compliance, 95% authorized utility, unauthorized leakage cut from 15.39% to 0.21% (98.6% relative reduction), PII/PHI micro-F1 0.96, risk-classifier ROC-AUC 0.98. Insight: security without utility is not enough. Tech: Python, FastAPI, LangGraph, CrewAI, LangChain, RAG, Graph-RAG, Neo4j, ChromaDB, Presidio, SBERT, XGBoost, OCR, Docker.' },
    { id: 'proj-neurologiquetwin', group: 'projects', kw: 'neurologiquetwin multimodal digital twin eeg imu deep learning cnn attention pytorch signals classification um6p innovboost prize',
      text: 'NeurologiqueTWIN (UM6P, 2025) — multimodal AI / digital twin fusing EEG + IMU signals for neurological monitoring: synchronization, segmentation, feature extraction and a deep-learning classifier (PyTorch, CNN, attention). ≈92% internal accuracy; 2nd Prize at Innov\'Boost 2025. Lesson: data synchronization and signal quality can matter as much as model architecture.' },
    { id: 'proj-graphrag', group: 'projects', kw: 'graph rag aquadviser knowledge graph neo4j embeddings vector hybrid retrieval llm fastapi sourced',
      text: 'Graph-RAG at AQUADVISER (2025) — hybrid retrieval combining vector embeddings, a Neo4j knowledge graph and LLMs (FastAPI) to answer business questions with sourced, relationship-aware answers. Lesson: vector similarity and graph relationships solve different retrieval problems and complement each other.' },
    { id: 'proj-multiagent', group: 'projects', kw: 'multi agent data assistant agentic langgraph crewai sql kpi controlled workflow auditable streamlit orchestration',
      text: 'Intelligent Multi-Agent Data Assistant — turns a natural-language business question into an auditable analysis through an explicit, controlled agent workflow (LangGraph, CrewAI): understanding, SQL generation, consistency check, controlled execution, KPI, visualization, synthesis. Lesson: prefer explicit, controlled agent workflows over uncontrolled autonomy.' },
    { id: 'proj-gear5', group: 'projects', kw: 'gear5 green ai distillation quantization int8 efficiency energy latency tinyllama distilgpt2 codecarbon teacher student',
      text: 'GEAR5 — Green AI: reduce inference cost while keeping useful behavior via teacher-student knowledge distillation, adaptive gating and INT8 quantization, with energy tracked by CodeCarbon (PyTorch, Hugging Face, TinyLLaMA, DistilGPT2). Lesson: the best model is not always the largest.' },
    { id: 'proj-cvjob', group: 'projects', kw: 'nlp cv job matching resume recruitment semantic sbert tfidf embeddings ner similarity recommendation offers',
      text: 'NLP CV–Job Matching — matches CVs to job offers by meaning and recommends the most relevant offers per CV: NER extraction, hybrid TF-IDF + SBERT scoring, cosine-similarity ranking (Top-5). About 95% matching precision. Lesson: combining TF-IDF and embeddings balances exact-term overlap with meaning.' },
    { id: 'proj-bigdata', group: 'projects data', kw: 'big data streaming kafka spark hadoop hdfs hive etl elt nosql pipeline data engineering docker',
      text: 'Big Data / Streaming — streaming ingestion and processing with Kafka and Spark, ETL/ELT into NoSQL stores, containerized with Docker: the data foundation under Ahmed\'s AI systems. Lesson: models are only as reliable as the pipelines feeding them.' },
    { id: 'proj-forex', group: 'projects data', kw: 'forex trading big data financial market exchange kafka spark streaming reinforcement learning lstm rnn random forest forecasting mongodb cassandra',
      text: 'Forex Trading Platform — Big Data, forecasting and reinforcement learning: market data → Kafka streams → Spark processing → feature engineering → NoSQL storage → forecasting models (LSTM, RNN, Random Forest) → RL trading agents (buy/hold/sell) under risk constraints → dashboard (P&L, risk metrics, market indicators). Tech: Python, Kafka, Spark, TensorFlow, scikit-learn, MongoDB/Cassandra, Streamlit.' },
    { id: 'proj-ecommerce', group: 'projects data', kw: 'ecommerce streaming real time events kafka spark postgresql superset sessions baskets conversions pipeline docker',
      text: 'Real-Time E-commerce Pipeline — customer events → Kafka → Spark Streaming → session/basket transformations → PostgreSQL → business KPIs → Superset dashboard (sessions, baskets, conversions, marketing/pricing/inventory indicators). Tech: Kafka, Spark Streaming, PostgreSQL, Superset, Docker.' },
    { id: 'proj-swim', group: 'projects', kw: 'swimcoach vision computer vision video pose opencv movement sensor fusion digital twin omniverse stroke',
      text: 'SwimCoach Vision — computer vision, sensor fusion and digital twin: overhead cameras + wearable sensors → pose/key-point detection → lane-to-athlete association → sensor fusion → movement analysis → technical indicators (stroke symmetry, head position, entry angle, anomalies) → automated feedback → digital-twin visualization. Tech: Python, OpenCV, pose estimation, sensor fusion, digital twins.' },
    { id: 'proj-flightbi', group: 'projects', kw: 'flight delay analytics machine learning bi looker studio talend mysql etl data quality dashboard 500000 records',
      text: 'Flight Delay Analytics — Data & BI: 500,000+ flight records → Talend ETL → data quality → transformations → MySQL → analytical model → BI dashboards → delay KPIs / bottleneck analysis. Tech: Talend, MySQL, Looker Studio, ETL, data quality, BI. Shows Ahmed\'s strong data / BI foundations.' },

    // Skills
    { id: 'skills-ai', group: 'skills', kw: 'machine learning deep learning skills python pytorch tensorflow scikit xgboost cnn attention classification forecasting anomaly model evaluation',
      text: 'AI & Machine Learning: Python, PyTorch, TensorFlow, scikit-learn, XGBoost, deep learning, CNNs, attention, classification, forecasting, anomaly detection, model evaluation.' },
    { id: 'skills-genai', group: 'skills', kw: 'generative ai nlp llm rag graph rag langgraph crewai langchain hugging face sbert embeddings ner prompt engineering agentic guardrails injection',
      text: 'Generative AI & NLP: LLMs, RAG, Graph-RAG, LangGraph, CrewAI, LangChain, Hugging Face Transformers, SBERT, embeddings, NER, prompt engineering, agentic workflows, guardrails, prompt-injection defense.' },
    { id: 'skills-docai', group: 'skills', kw: 'document ai computer vision ocr pdf parsing layout analysis extraction tesseract doctr mistral pdfplumber layoutlmv3 opencv',
      text: 'Document AI & Vision: OCR, PDF parsing, layout analysis, information extraction, Tesseract, DocTR, Mistral OCR, PDFPlumber, LayoutLMv3, OpenCV.' },
    { id: 'skills-dataeng', group: 'skills data', kw: 'data engineering sql etl elt kafka spark streaming hadoop hdfs hive hbase airflow talend pipelines big data',
      text: 'Data Engineering: SQL, ETL/ELT, Kafka, Spark, Spark Streaming, Hadoop, HDFS, Hive, HBase, Airflow, Talend, data pipelines.' },
    { id: 'skills-db', group: 'skills data', kw: 'databases knowledge systems postgresql sql server mysql mongodb cassandra neo4j chromadb vector database knowledge graph',
      text: 'Databases & Knowledge Systems: PostgreSQL, SQL Server, MySQL, MongoDB, Cassandra, Neo4j, ChromaDB, knowledge graphs, vector databases.' },
    { id: 'skills-mlops', group: 'skills', kw: 'software engineering mlops fastapi rest api docker git github linux testing logging modular architecture ci cd',
      text: 'Software Engineering & MLOps: FastAPI, REST APIs, Docker, Git/GitHub, Linux, testing, logging, modular architecture, CI/CD fundamentals.' },
    { id: 'skills-bi', group: 'skills', kw: 'business intelligence power bi dax power query tableau superset looker studio kpi data visualization',
      text: 'Business Intelligence: Power BI, DAX, Power Query, Tableau, Superset, Looker Studio, KPI design, data visualization.' },

    { id: 'softskills', group: 'engineering', kw: 'soft skills how work behavior curiosity analytical rigor autonomy fast learning communication teamwork adaptability problem solving pragmatism personality',
      text: 'Soft skills as behaviors: curiosity, analytical thinking, rigor (reproducible experiments, testing, documentation), autonomy, fast learning, communication (technical and non-technical audiences), teamwork (discussion, code review, feedback), adaptability across domains, problem solving (understand the problem before choosing a technology) and engineering pragmatism.' },
    { id: 'mindset', group: 'engineering', kw: 'engineering mindset approach think principles method evaluate how solve philosophy',
      text: 'Engineering mindset (10 principles): problem before technology; baseline before complexity; measure before claiming; security by design; data quality matters; traceability matters; human oversight for critical decisions; build for maintainability; learn by testing; avoid unnecessary complexity. He uses AI when it provides measurable value, and sees AI engineering as a complete system problem: data, models, software, security, evaluation and deployment.' },

    { id: 'awards', group: 'recognition', kw: 'award prize distinction recognition innovboost won hackathon competition',
      text: 'Awards: 2nd Prize at the Innov\'Boost 2025 hackathon (The Startups Competition, Forum ENSAJ Entreprises, ENSA El Jadida) for NeurologiqueTWIN.' },
    { id: 'hackathons', group: 'recognition', kw: 'hackathon technical activities open data digital health santeo pwned cybersecurity competition',
      text: 'Hackathons & technical activities: Innov\'Boost 2025 (2nd Prize, NeurologiqueTWIN); Open Data Hackathon 2025 — Digital Health (Santeo); Pwned Hackathon — Cybersecurity & AI.' },
    { id: 'certifications', group: 'recognition', kw: 'certification certifications certified cloud data python courses',
      text: 'Ahmed holds several verifiable certifications in cloud, data and Python (details on the portfolio and his profiles).' },
    { id: 'languages', group: 'practical', kw: 'language languages english french arabic speak',
      text: 'Languages: Arabic — native/bilingual; French — C1; English — C1.' },
    { id: 'whythales', group: 'thales', kw: 'thales why fit critical systems reliability robustness explainability cybersecurity industrial bring team',
      text: 'Why Thales: Ahmed is drawn to AI where performance alone is not enough — reliability, security, traceability and human control also matter. His verified experience in trustworthy generative AI, secure RAG, knowledge graphs, agents, data engineering, multimodal AI and rigorous evaluation connects to reliable industrial AI. He wants to explore AI for critical systems, robustness, explainability, cybersecurity and deployment under strong constraints. He does not claim any knowledge of confidential Thales projects.' },
    { id: 'whyme', group: 'thales', kw: 'why me bring value team strengths add end to end',
      text: 'What Ahmed brings: an end-to-end AI perspective (data → models → APIs → security → deployment), a mix of research and engineering, direct trustworthy-AI experience, fast learning across domains, and the ability to explain technical systems clearly.' },
    { id: 'contact', group: 'practical', kw: 'contact email linkedin github reach talk',
      text: 'Contact: email lahlyalmoubarak@gmail.com, LinkedIn (ahmed-moubarak-lahlyal), GitHub (amlmbr).' }
  ],

  // ---- Curated, balanced answers for knowledge-base mode ----
  faqs: [
    { id: 'who', keys: 'who is ahmed about yourself overview introduce 60 second seconds tell me about profile makes different',
      a: '**Ahmed Moubarak Lahlyal is an AI & Data Engineer** with a strong data-engineering foundation. He works end to end — data, models, retrieval, agents, APIs, security, evaluation and deployment — and has **both research and applied experience**.\n\n• **Education:** engineering degree (Computer Science & Emerging Technologies, ENSA El Jadida, 2026); Advanced Master in Data & Generative AI Engineering at **EFREI Paris** (2026–2027, apprenticeship).\n• **Experience:** OCP (industrial data analytics), AQUADVISER (Graph-RAG & knowledge graphs), UM6P (multimodal deep-learning research), LISTIC (trustworthy generative AI — SecureDocAI).\n• **Research:** co-author of **CityEcoScout** (published, IJCEDS 2025) and a **SecureDocAI manuscript in preparation**.\n• **Strengths:** trustworthy AI, generative AI, knowledge graphs, multimodal AI, data engineering — with a pragmatic, measurable engineering mindset.' },
    { id: 'publications', keys: 'publications published paper papers publish research output article',
      a: 'Ahmed has one **published** paper and one manuscript **in preparation**:\n\n**Published** — **CityEcoScout: "A Platform for Exploring Sustainable Locations Worldwide"** (co-author), *International Journal of Computer Engineering and Data Science (IJCEDS)*, Vol. 4, Issue 1, 2025, pp. 41–54.\n\n**In preparation** — **SecureDocAI** scientific manuscript at LISTIC (with Faiza Loukil and Hervé Verjus) — not yet published.' },
    { id: 'cityecoscout', keys: 'cityecoscout city eco scout sustainable ijceds first publication',
      a: '**CityEcoScout — "A Platform for Exploring Sustainable Locations Worldwide"** is a **peer-reviewed publication** (IJCEDS, Vol. 4, Issue 1, 2025, pp. 41–54) that Ahmed **co-authored** (with Bader Eddine Benhirt, Yasmine Fihri and Rahhal Errattahi). It is an AI-enabled platform for exploring sustainable urban locations, combining geographic services (Google Maps, Street View, Places APIs), environmental analytics and generative AI (Gemini). It is collaborative work — not Ahmed\'s solo project.' },
    { id: 'research', keys: 'research researching interests focus areas conduct',
      a: 'Ahmed\'s **research interests**: trustworthy generative AI, secure RAG, agentic AI, knowledge graphs, multimodal learning, document intelligence, digital twins, industrial AI, AI security, human-in-the-loop AI and model evaluation.\n\nHis research **progressed** from knowledge representation (**AQUADVISER** — Graph-RAG), to multimodal intelligence (**UM6P** — EEG + IMU deep learning), to trustworthy generative AI (**LISTIC** — SecureDocAI). Output: **CityEcoScout** (published) and the **SecureDocAI** manuscript (in preparation).' },
    { id: 'listic', keys: 'listic savoie mont blanc polytech annecy',
      a: 'At **LISTIC** (Université Savoie Mont Blanc / Polytech Annecy-Chambéry, 2026) Ahmed worked on **SecureDocAI** — trustworthy generative AI for secure document intelligence and controlled LLM-based information access. A scientific manuscript is **in preparation** with Faiza Loukil and Hervé Verjus.' },
    { id: 'um6p', keys: 'um6p multimodal eeg imu sdas',
      a: 'At **UM6P** (SDAS Research Group, 2025) Ahmed built **NeurologiqueTWIN** — a multimodal / digital-twin project fusing **EEG + IMU** signals with deep learning for neurological monitoring (≈92% internal accuracy; **2nd Prize Innov\'Boost 2025**).' },
    { id: 'aquadviser', keys: 'aquadviser graph rag knowledge graph neo4j',
      a: 'At **AQUADVISER** (2025) Ahmed built a **Graph-RAG** assistant combining vector embeddings, a **Neo4j** knowledge graph and LLMs (FastAPI) to answer business questions with sourced, relationship-aware answers.' },
    { id: 'ocp', keys: 'ocp group industrial analytics 2024 software web survey',
      a: 'At **OCP Group** (**Jul 2024 – Aug 2024**) Ahmed did a **Software Development & Data Analytics** internship — he built a web-based survey & analytics platform on a SQL database with KPIs, reporting and dashboards. This is his **data / software foundation** (an industrial experience, not research).' },
    { id: 'dates', keys: 'when dates start end period years worked timeline how long',
      a: 'Ahmed\'s experience dates: **OCP Group** — Jul 2024 → Aug 2024; **AQUADVISER** — May 2025 → Jul 2025; **UM6P** (SDAS Research Group) — Jul 2025 → Oct 2025; **LISTIC** (Université Savoie Mont Blanc / Polytech Annecy-Chambéry) — Feb 2026 → Jul 2026. Next: **EFREI Paris** Advanced Master (2026–2027, apprenticeship 2 weeks company / 1 week school).' },
    { id: 'kafka', keys: 'kafka spark streaming which projects use big data pipelines',
      a: 'Ahmed uses **Kafka** in his streaming/Big-Data projects: the **Forex Trading Platform** (Kafka → Spark → forecasting + RL agents), the **Real-Time E-commerce Pipeline** (Kafka → Spark Streaming → PostgreSQL → Superset) and his general **Big Data / streaming** work. He also uses Spark, Hadoop/HDFS/Hive and ETL/ELT.' },
    { id: 'multiagent', keys: 'multi agent assistant project langgraph crewai controlled workflow',
      a: 'Ahmed\'s **Intelligent Multi-Agent Data Assistant** turns a business question into an **auditable** workflow: understanding agent → SQL generation agent → consistency/safety check → controlled execution → KPI computation → visualization → natural-language synthesis → human validation (LangGraph, CrewAI, LangChain, SQL, FastAPI, Streamlit). He prefers **explicit, controlled** agent workflows over uncontrolled autonomy.' },
    { id: 'deeplearning', keys: 'deep learning neural network cnn pytorch',
      a: 'Yes. Ahmed\'s **deep-learning** work includes **NeurologiqueTWIN** (UM6P — EEG/IMU, CNN + attention, PyTorch), **GEAR5** (knowledge distillation, quantization) and deep-learning components in **SecureDocAI**. He also works with computer vision (Swim Coach Vision).' },
    { id: 'genai', keys: 'generative ai llm llms genai',
      a: 'Ahmed\'s **generative-AI** work spans **SecureDocAI** (secure RAG/Graph-RAG, agents, output governance), **Graph-RAG at AQUADVISER**, the **Multi-Agent Data Assistant** (LangGraph/CrewAI) and **GEAR5** (efficient LLMs). Tools: LLMs, RAG, LangGraph, CrewAI, LangChain, Hugging Face, SBERT.' },
    { id: 'kg', keys: 'knowledge graph knowledge graphs neo4j graph',
      a: 'Ahmed\'s **knowledge-graph** experience: **AQUADVISER** (hybrid retrieval over a **Neo4j** knowledge graph) and **SecureDocAI** (document layer feeding a knowledge graph alongside a vector index for relationship-aware, authorized retrieval).' },
    { id: 'dataeng', keys: 'data engineering big data kafka spark hadoop etl streaming pipeline',
      a: 'Ahmed has a solid **data-engineering** foundation: **Kafka, Spark, Spark Streaming, Hadoop/HDFS/Hive, HBase, Airflow, Talend, ETL/ELT** and SQL, with projects on **Big Data / streaming**, **Forex Big Data** and **E-commerce Streaming**, containerized with Docker.' },
    { id: 'databases', keys: 'databases database db sql nosql postgres mongodb',
      a: 'Databases Ahmed has used: **PostgreSQL, SQL Server, MySQL, MongoDB, Cassandra, Neo4j, ChromaDB** (plus vector-database and knowledge-graph concepts).' },
    { id: 'bigdata', keys: 'big data project projects streaming',
      a: 'Big-data / streaming projects: a **Kafka + Spark streaming** pipeline (ETL/ELT into NoSQL), **Forex Big Data** (large-scale FX data) and **E-commerce Streaming** (real-time events). These form the data foundation under his AI work.' },
    { id: 'strongest', keys: 'strongest best top projects',
      a: 'A balanced view of his strongest projects: **SecureDocAI** (trustworthy generative AI — flagship), **NeurologiqueTWIN** (multimodal deep learning, 2nd Prize Innov\'Boost), **Graph-RAG at AQUADVISER** (knowledge graphs), the **Multi-Agent Data Assistant** (controlled agents) and **GEAR5** (efficient AI).' },
    { id: 'skills', keys: 'skills technical stack technologies tools strongest technical',
      a: 'By layer — **AI/ML:** Python, PyTorch, TensorFlow, scikit-learn, XGBoost. **Generative AI/NLP:** LLMs, RAG, Graph-RAG, LangGraph, CrewAI, LangChain, Hugging Face, SBERT. **Document AI/Vision:** OCR, LayoutLMv3, DocTR, OpenCV. **Data Engineering:** Kafka, Spark, Hadoop, Hive, Airflow, ETL/ELT. **Databases:** PostgreSQL, MongoDB, Neo4j, ChromaDB. **MLOps:** FastAPI, Docker, Git, Linux. **BI:** Power BI, DAX, Tableau.' },
    { id: 'soft', keys: 'soft skills behavior curiosity teamwork adaptability personality',
      a: 'Ahmed expresses soft skills as **behaviors**: curiosity, analytical thinking, rigor, autonomy, fast learning, communication (technical & non-technical), teamwork (code review, feedback), adaptability across domains, problem solving and **engineering pragmatism** — the simplest architecture that reliably works.' },
    { id: 'mindset', keys: 'engineering approach how think evaluate principles method problems',
      a: 'Ahmed\'s engineering mindset (10 principles): problem before technology, baseline before complexity, **measure before claiming**, **security by design**, data quality, **traceability**, human oversight for critical decisions, maintainability, learn by testing, avoid unnecessary complexity. He evaluates AI **end-to-end** — metrics, failure cases and reproducible experiments, not a single demo.' },
    { id: 'thales', keys: 'thales why fit bring team interested',
      a: 'What attracts Ahmed to **Thales** is AI where **performance alone is not enough** — reliability, security, traceability and human control matter too. His verified experience in trustworthy generative AI, secure RAG, knowledge graphs, agents, data engineering, multimodal AI and rigorous evaluation maps directly to reliable industrial AI. He brings an **end-to-end perspective** and a research + engineering profile. He does not claim knowledge of any confidential Thales project.' },
    { id: 'apprenticeship', keys: 'apprenticeship schedule rhythm alternance availability',
      a: 'Ahmed\'s apprenticeship rhythm for the EFREI Advanced Master (2026–2027) is **2 weeks in the company / 1 week at school** — strong continuity on real engineering work with a regular academic anchor.' },
    { id: 'languages', keys: 'languages language speak english french arabic',
      a: 'Languages: **Arabic** — native/bilingual; **French** — C1; **English** — C1.' },
    { id: 'contact', keys: 'contact email reach linkedin github how can i',
      a: 'You can reach Ahmed at **lahlyalmoubarak@gmail.com**, on **LinkedIn** (ahmed-moubarak-lahlyal) and **GitHub** (amlmbr).' },
    { id: 'securedocai', keys: 'securedocai secure document flagship explain',
      a: '**SecureDocAI** is Ahmed\'s **flagship trustworthy-AI research project** (LISTIC, 2026): using LLMs over sensitive documents **without over-sharing**. Two layers — Document Intelligence (OCR, extraction, PII/PHI detection, vector index, knowledge graph) and Secure AI Governance (role-based access, prompt-injection defense, authorized retrieval, output firewall). Evaluated on 6,000 scenarios: **97.8% RBAC compliance**, leakage **15.39% → 0.21%**, **95%** utility kept. A manuscript is **in preparation**. (It\'s one flagship project — Ahmed\'s profile is broader.)' },
    { id: 'innovboost', keys: 'innovboost innov boost won prize award competition',
      a: '**NeurologiqueTWIN** won **2nd Prize at Innov\'Boost 2025** (The Startups Competition, ENSA El Jadida) — the multimodal EEG + IMU project from Ahmed\'s UM6P research.' },
    { id: 'outside-llm', keys: 'outside llm llms generative besides other than beyond broader not llm computer vision',
      a: 'Beyond LLMs, Ahmed works across: **multimodal AI** (UM6P — EEG/IMU deep learning), **computer vision** (Swim Coach Vision, OpenCV), **Big Data & streaming** (Kafka, Spark, Forex, E-commerce), **machine learning & BI** (Flight Delay Prediction, Power BI) and **industrial data analytics** (OCP). His profile is much broader than generative AI.' }
  ],

  // ---- Suggested questions, grouped (UI rotates a small selection) ----
  chipGroups: {
    Profile: ['Who is Ahmed?', "Give me a 60-second overview of Ahmed's profile.", 'What makes Ahmed different as an AI Engineer?'],
    Research: ["What are Ahmed's research interests?", 'What has Ahmed published?', 'Tell me about CityEcoScout.', 'What research did Ahmed conduct at LISTIC?', 'What did Ahmed research at UM6P?'],
    AI: ['Tell me about SecureDocAI.', 'What experience does Ahmed have with LLMs?', 'What experience does Ahmed have with Deep Learning?', 'What experience does Ahmed have with Knowledge Graphs?', 'Has Ahmed worked with AI agents?'],
    Data: ["What is Ahmed's Data Engineering experience?", 'Has Ahmed worked with Big Data?', 'What databases has Ahmed used?'],
    Engineering: ['How does Ahmed approach AI engineering?', "What are Ahmed's soft skills?", 'How does Ahmed evaluate AI systems?'],
    Thales: ['Why is Ahmed interested in Thales?', 'What could Ahmed bring to an AI team at Thales?'],
    Practical: ["What is Ahmed's apprenticeship schedule?", 'What languages does Ahmed speak?', 'How can I contact Ahmed?']
  }
};
