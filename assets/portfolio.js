/* ============================================================
   Ahmed Moubarak Lahlyal — portfolio & interview presentation
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  document.getElementById('yr').textContent = new Date().getFullYear();

  /* ===== Hero particle network ===== */
  (function () {
    var canvas = $('#net'); if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var pts = [], W, H, mouse = { x: -999, y: -999 };
    function resize() { W = canvas.width = canvas.offsetWidth * devicePixelRatio; H = canvas.height = canvas.offsetHeight * devicePixelRatio; }
    function initPts() {
      pts = [];
      var n = Math.min(84, Math.floor(canvas.offsetWidth / 15));
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .32 * devicePixelRatio, vy: (Math.random() - .5) * .32 * devicePixelRatio });
    }
    function tick() {
      ctx.clearRect(0, 0, W, H);
      var linkDist = 128 * devicePixelRatio;
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i]; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        var dxm = p.x - mouse.x, dym = p.y - mouse.y, dm = Math.hypot(dxm, dym);
        if (dm < 100 * devicePixelRatio && dm > 0) { p.x += dxm / dm * 1.1; p.y += dym / dm * 1.1; }
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.7 * devicePixelRatio, 0, 7); ctx.fillStyle = 'rgba(57,198,240,.5)'; ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < linkDist) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = 'rgba(57,198,240,' + (0.14 * (1 - d / linkDist)) + ')'; ctx.lineWidth = devicePixelRatio; ctx.stroke(); }
        }
      }
      if (!reduced) requestAnimationFrame(tick);
    }
    resize(); initPts(); tick();
    window.addEventListener('resize', function () { resize(); initPts(); });
    canvas.parentElement.addEventListener('mousemove', function (e) { var r = canvas.getBoundingClientRect(); mouse.x = (e.clientX - r.left) * devicePixelRatio; mouse.y = (e.clientY - r.top) * devicePixelRatio; });
    canvas.parentElement.addEventListener('mouseleave', function () { mouse.x = mouse.y = -999; });
  })();

  /* ===== Typing rotator ===== */
  (function () {
    var roles = [
      'from data to deployment',
      'LLMs · RAG · Graph-RAG · Agents',
      'trustworthy, secure and evaluated AI',
      'knowledge graphs & multimodal AI',
      'reliable industrial AI systems'
    ];
    var typed = $('#typed'); if (!typed) return;
    var ri = 0, ci = 0, del = false;
    function loop() {
      var w = roles[ri]; typed.textContent = w.slice(0, ci);
      if (!del && ci < w.length) { ci++; setTimeout(loop, 42); }
      else if (!del) { del = true; setTimeout(loop, 2000); }
      else if (ci > 0) { ci--; setTimeout(loop, 16); }
      else { del = false; ri = (ri + 1) % roles.length; setTimeout(loop, 320); }
    }
    if (reduced) typed.textContent = roles[0]; else loop();
  })();

  /* ===== Scroll reveal ===== */
  (function () {
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: .12 });
    $$('.reveal').forEach(function (el) { obs.observe(el); });
  })();

  /* ===== SecureDocAI architecture ===== */
  (function () {
    var docSteps = ['Documents', 'OCR / Parsing', 'Layout Analysis', 'Domain Routing', 'Extraction', 'Canonical JSON', 'PII / PHI Detection', 'Protected Storage', 'Vector Index', 'Knowledge Graph'];
    var secSteps = ['User', 'Authenticated Role', 'Security Guard', 'Injection / Jailbreak Detection', 'Policy Filtering', 'Authorized Retrieval', 'Context Minimization', 'Controlled LLM', 'Output Firewall', 'Final Validation'];
    function build(container, steps, sec) {
      steps.forEach(function (s, i) {
        var n = document.createElement('span'); n.className = 'node' + (sec ? ' sec' : ''); n.textContent = s; container.appendChild(n);
        if (i < steps.length - 1) { var a = document.createElement('span'); a.className = 'ar'; a.textContent = '→'; container.appendChild(a); }
      });
    }
    var fd = $('#flow-doc'), fs = $('#flow-sec');
    if (fd) build(fd, docSteps, false);
    if (fs) build(fs, secSteps, true);

    var explains = {
      doc: 'Raw, heterogeneous documents are turned into <b>structured, protected knowledge</b>: parsed, routed by domain, extracted to canonical JSON, scanned for PII / PHI, then indexed for both vector search and a knowledge graph.',
      sec: 'Every request is governed: the user\'s <b>authenticated role</b> drives access, adversarial prompts are filtered, retrieval is restricted to authorized content, the context is minimized, and the model\'s output passes an <b>output firewall</b> and final validation before it is returned.',
      eval: 'The system was stress-tested on <b>6,000 scenarios</b> — RBAC probes, prompt-injection attempts and sensitive-data checks — producing the measured metrics below.'
    };
    var explEl = $('#arch-explain');
    function setExplain(k) { if (explEl) explEl.innerHTML = explains[k]; }

    // step-by-step lighting when the section becomes active
    var animated = {};
    function animateFlow(container) {
      if (!container || reduced) { if (container) $$('.node', container).forEach(function (n) { n.classList.add('lit'); }); return; }
      var nodes = $$('.node', container); nodes.forEach(function (n) { n.classList.remove('lit'); });
      var i = 0; (function step() { if (i < nodes.length) { nodes[i].classList.add('lit'); i++; setTimeout(step, 240); } })();
    }
    var secObs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && !animated.doc) { animated.doc = true; animateFlow(fd); } });
    }, { threshold: .3 });
    var sd = $('#securedocai'); if (sd) secObs.observe(sd);

    // arch tabs
    $$('.arch-tab[data-arch]').forEach(function (t) {
      t.addEventListener('click', function () {
        $$('.arch-tab[data-arch]').forEach(function (o) { o.classList.remove('active'); });
        t.classList.add('active');
        var k = t.dataset.arch;
        $('#arch-doc').style.display = k === 'doc' ? '' : 'none';
        $('#arch-sec').style.display = k === 'sec' ? '' : 'none';
        $('#arch-eval').style.display = k === 'eval' ? '' : 'none';
        setExplain(k);
        if (k === 'doc' && !animated.docTab) { animated.docTab = true; animateFlow(fd); }
        if (k === 'sec' && !animated.sec) { animated.sec = true; animateFlow(fs); }
      });
    });
    setExplain('doc');

    // contribution tabs
    $$('.arch-tab[data-contrib]').forEach(function (t) {
      t.addEventListener('click', function () {
        $$('.arch-tab[data-contrib]').forEach(function (o) { o.classList.remove('active'); });
        t.classList.add('active');
        var k = t.dataset.contrib;
        $('#contrib-what').style.display = k === 'what' ? '' : 'none';
        $('#contrib-tech').style.display = k === 'tech' ? '' : 'none';
      });
    });
  })();

  /* ===== Projects showcase ===== */
  (function () {
    var projects = {
      'v-eeg': {
        file: 'neurologique_twin.ipynb', type: 'Multimodal AI · Digital Twin', title: 'NeurologiqueTWIN', org: 'UM6P — 2025',
        problem: 'Combine heterogeneous physiological signals (EEG and IMU) into a reliable model for neurological monitoring.',
        built: 'An end-to-end multimodal pipeline: signal synchronization, segmentation, feature extraction and a deep-learning classifier fusing both modalities.',
        contribution: 'Built the EEG/IMU processing pipeline, aligned the two modalities, engineered the features and implemented and evaluated the classification model.',
        core: 'Python · PyTorch · TensorFlow · CNN · Attention · EEG / IMU · Time Series',
        kpi: ['≈92%', 'internal classification accuracy'],
        results: '≈92% internal classification accuracy; won 2nd Prize at Innov\'Boost 2025.',
        lesson: 'In multimodal AI, data synchronization and signal quality can matter as much as model architecture.'
      },
      'v-rag': {
        file: 'graph_rag_assistant.py', type: 'Knowledge Graph · Generative AI', title: 'Graph-RAG — AQUADVISER', org: 'AQUADVISER — 2025',
        problem: 'Retrieve business information using both semantic similarity and the explicit relationships between entities.',
        built: 'A hybrid retrieval assistant combining vector embeddings, a Neo4j knowledge graph and LLMs, served through a FastAPI API.',
        contribution: 'Designed the hybrid retrieval strategy, modelled the Neo4j knowledge graph, integrated embeddings with graph traversal and exposed the service via FastAPI.',
        core: 'Python · FastAPI · Neo4j · Embeddings · Vector Search · LLMs · Graph-RAG',
        kpi: ['sourced', 'grounded, relationship-aware answers'],
        results: 'Questions resolved into grounded, source-attributed answers that use both similarity and graph relationships.',
        lesson: 'Vector similarity and graph relationships solve different retrieval problems and complement each other.'
      },
      'v-agents': {
        file: 'multi_agent_assistant.py', type: 'Agentic AI · Controlled workflow', title: 'Intelligent Multi-Agent Data Assistant', org: 'Applied project',
        problem: 'Turn a natural-language business question into a controlled, auditable data analysis.',
        built: 'An explicit agent workflow: question understanding → SQL generation → consistency check → controlled execution → KPI computation → visualization → natural-language synthesis.',
        contribution: 'Designed the controlled workflow, orchestrated the agents with LangGraph/CrewAI, added the SQL consistency checks and built the FastAPI/Streamlit interfaces.',
        core: 'Python · LangGraph · CrewAI · SQL · FastAPI · Streamlit · LLMs',
        kpi: ['auditable', 'explicit steps, not free-form autonomy'],
        results: 'Every answer is traceable step by step, keeping the analysis controllable and reviewable.',
        lesson: 'I prefer explicit, controlled agent workflows over uncontrolled autonomous conversations.'
      },
      'v-gear': {
        file: 'gear5_distillation.py', type: 'Green AI · Efficiency', title: 'GEAR5 — Green AI', org: 'R&D project',
        problem: 'Reduce inference cost while preserving useful language-model behavior.',
        built: 'Teacher-student knowledge distillation with adaptive gating and INT8 quantization, with energy consumption measured via CodeCarbon.',
        contribution: 'Implemented the distillation and gating experiments, applied INT8 quantization and measured the quality/latency/memory/energy trade-off.',
        core: 'PyTorch · Hugging Face · TinyLLaMA · DistilGPT2 · INT8 · CodeCarbon',
        kpi: ['trade-off', 'quality · latency · memory · energy'],
        results: 'A measured trade-off across quality, latency, memory and energy — smaller student models kept useful behavior at lower cost.',
        lesson: 'The best model is not always the largest model.'
      },
      'v-nlp': {
        file: 'cv_job_matching.py', type: 'NLP · Matching & Recommendation', title: 'NLP CV–Job Matching', org: 'Applied NLP project',
        problem: 'Match CVs to job offers by meaning, and recommend the most relevant offers for a given CV — not just keyword overlap.',
        built: 'A hybrid matching + recommendation pipeline: parse CVs and offers, extract skills/entities, score with TF-IDF (lexical) and SBERT embeddings (semantic), then rank and recommend the best-fitting offers per CV.',
        contribution: 'Built the text pre-processing and entity extraction, combined TF-IDF with SBERT embeddings, and implemented the similarity scoring and offer recommendation.',
        core: 'Python · TF-IDF · SBERT · Embeddings · NER · Cosine Similarity · scikit-learn',
        kpi: ['95%', 'CV–offer matching precision'],
        results: '≈95% matching precision; for each CV it returns a ranked Top-5 shortlist of the most relevant offers, blending lexical (TF-IDF) and semantic (SBERT) signals.',
        lesson: 'Combining TF-IDF and embeddings balances exact-term overlap with meaning — and extraction quality still bounds the result.'
      },
      'v-data': {
        file: 'streaming_pipeline.py', type: 'Data Engineering · Foundation', title: 'Big Data / Streaming', org: 'OCP Group & coursework',
        problem: 'Handle high-volume, continuous data reliably — the foundation underneath any AI system.',
        built: 'Streaming ingestion and processing with Kafka and Spark, ETL / ELT into NoSQL stores, containerized with Docker.',
        contribution: 'Built streaming ingestion and transformation jobs, modelled the storage layer and containerized the pipeline for reproducible runs.',
        core: 'Kafka · Spark · Streaming · NoSQL · ETL / ELT · Docker',
        kpi: ['foundation', 'the data layer under AI'],
        results: 'A reproducible streaming foundation that feeds clean, structured data to downstream models.',
        lesson: 'Models are only as reliable as the data pipelines that feed them.'
      }
    };
    var stageTitle = $('#stage-title'), info = $('#proj-info');
    function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
    function render(key) {
      var p = projects[key]; if (!p) return;
      stageTitle.textContent = p.file;
      info.innerHTML =
        '<span class="type">' + esc(p.type) + (p.org ? '  ·  ' + esc(p.org) : '') + '</span>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<div class="qa-block">' +
        '<div class="qa-row"><span class="q">Problem</span><span class="a">' + esc(p.problem) + '</span></div>' +
        '<div class="qa-row"><span class="q">What I built</span><span class="a">' + esc(p.built) + '</span></div>' +
        '<div class="qa-row"><span class="q">My contribution</span><span class="a">' + esc(p.contribution) + '</span></div>' +
        '<div class="qa-row"><span class="q">Technical approach</span><span class="a"><span class="stack-line">' + esc(p.core) + '</span></span></div>' +
        '<div class="qa-row"><span class="q">Results</span><span class="a">' + esc(p.results) + '</span></div>' +
        '</div>' +
        '<span class="kpi-chip"><span class="v">' + esc(p.kpi[0]) + '</span><span class="k">' + esc(p.kpi[1]) + '</span></span>' +
        '<div class="lesson"><b>Takeaway —</b> ' + esc(p.lesson) + '</div>';
    }
    var tabs = $$('.show-tab');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (o) { o.classList.remove('active'); });
        t.classList.add('active');
        var key = t.dataset.v;
        $$('.visual').forEach(function (v) { v.classList.remove('on'); });
        $('#' + key).classList.add('on');
        render(key);
        if (key === 'v-eeg') requestAnimationFrame(eegTick);
        if (key === 'v-rag') requestAnimationFrame(graphTick);
        if (key === 'v-gear') $$('#v-gear .barup').forEach(function (b) { b.style.animation = 'none'; void b.getBoundingClientRect(); b.style.animation = ''; });
      });
    });
    render('v-eeg');

    /* EEG canvas */
    var eeg = $('#eeg'), ec = eeg ? eeg.getContext('2d') : null, et = 0;
    var chans = [
      { y: 40, amp: 15, f: .045, color: '#39C6F0', label: 'EEG Fp1' },
      { y: 95, amp: 20, f: .06, color: '#39C6F0', label: 'EEG Cz' },
      { y: 150, amp: 12, f: .035, color: '#39C6F0', label: 'EEG O2' },
      { y: 205, amp: 24, f: .02, color: '#E6B24C', label: 'IMU acc' },
      { y: 250, amp: 16, f: .028, color: '#E6B24C', label: 'IMU gyro' }
    ];
    function eegTick() {
      if (!ec) return; ec.clearRect(0, 0, 560, 270);
      chans.forEach(function (c, idx) {
        ec.font = '10px monospace'; ec.fillStyle = '#8598AC'; ec.fillText(c.label, 8, c.y - c.amp - 4);
        ec.beginPath();
        for (var x = 0; x < 560; x++) {
          var n = Math.sin((x + et * 2.2) * c.f + idx * 2) + .5 * Math.sin((x + et * 3.1) * c.f * 2.7 + idx) + .3 * Math.sin((x + et * 1.4) * c.f * 6.3);
          var y = c.y + n * c.amp * .5; if (x === 0) ec.moveTo(x, y); else ec.lineTo(x, y);
        }
        ec.strokeStyle = c.color; ec.lineWidth = 1.4; ec.stroke();
      });
      et++;
      if (!reduced && $('#v-eeg').classList.contains('on')) requestAnimationFrame(eegTick);
    }
    if (!reduced) requestAnimationFrame(eegTick);

    /* Graph canvas */
    var gcv = $('#graph'), gc = gcv ? gcv.getContext('2d') : null, gn = [], gt = 0;
    if (gc) for (var i = 0; i < 24; i++) gn.push({ x: 40 + Math.random() * 480, y: 30 + Math.random() * 210, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, hub: i < 4 });
    function graphTick() {
      if (!gc) return; gc.clearRect(0, 0, 560, 270);
      for (var a = 0; a < gn.length; a++) {
        var p = gn[a]; p.x += p.vx; p.y += p.vy;
        if (p.x < 20 || p.x > 540) p.vx *= -1; if (p.y < 20 || p.y > 250) p.vy *= -1;
        for (var b = a + 1; b < gn.length; b++) {
          var q = gn[b], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 108) { gc.beginPath(); gc.moveTo(p.x, p.y); gc.lineTo(q.x, q.y); gc.strokeStyle = 'rgba(57,198,240,' + (.2 * (1 - d / 108)) + ')'; gc.stroke(); }
        }
      }
      gn.forEach(function (p) { gc.beginPath(); gc.arc(p.x, p.y, p.hub ? 6 : 3, 0, 7); gc.fillStyle = p.hub ? '#E6B24C' : '#39C6F0'; gc.fill(); });
      var s = gn[Math.floor(gt / 90) % 4], e = gn[(Math.floor(gt / 90) + 1) % 4], k = (gt % 90) / 90;
      gc.beginPath(); gc.arc(s.x + (e.x - s.x) * k, s.y + (e.y - s.y) * k, 5, 0, 7); gc.fillStyle = '#E8EEF5'; gc.fill();
      gt++;
      if (!reduced && $('#v-rag').classList.contains('on')) requestAnimationFrame(graphTick);
    }
  })();

  /* ===== Lightbox ===== */
  (function () {
    var lb = $('#lightbox'), img = $('#lightbox-img'), cap = $('#lightbox-cap');
    $$('.shot').forEach(function (fig) {
      var im = fig.querySelector('img');
      im.addEventListener('error', function () { fig.classList.add('missing'); im.style.display = 'none'; fig.textContent = 'photo unavailable'; });
      fig.addEventListener('click', function () {
        if (fig.classList.contains('missing')) return;
        img.src = im.src; img.alt = im.alt; cap.textContent = fig.querySelector('figcaption') ? fig.querySelector('figcaption').textContent : '';
        lb.classList.add('open');
      });
    });
    lb.addEventListener('click', function () { lb.classList.remove('open'); img.src = ''; });
  })();

  /* ============================================================
     Ahmed AI — grounded assistant
     Retrieval (client) + generation (Llama 3.2 via /api/chat, or curated KB)
     ============================================================ */
  (function () {
    // Knowledge base (mirror of data/portfolio-knowledge.json for zero-dependency client use)
    var KB = [
      { id: 'profile', kw: 'who about yourself ahmed profile presentation introduce tell me', text: 'Ahmed Moubarak Lahlyal is an AI Engineer with a strong Data Engineering foundation, focused on trustworthy AI, generative AI, knowledge graphs, agentic systems and industrial AI. He works across the full AI system — data, models, retrieval, agents, APIs, security, evaluation and deployment — and enjoys the intersection of research, engineering and real-world constraints.' },
      { id: 'education', kw: 'education degree school university efrei ensa master studies graduate diploma', text: 'Engineering degree in Computer Science and Emerging Technologies from ENSA El Jadida (June 2026). Next: Advanced Master® in Data and Generative AI Engineering at EFREI Paris (2026–2027), on a 2 weeks company / 1 week school apprenticeship.' },
      { id: 'apprenticeship', kw: 'apprenticeship alternance schedule rhythm availability contract work study', text: 'Ahmed is starting an Advanced Master® at EFREI Paris (2026–2027) on a work-study contract with a rhythm of 2 weeks in the company and 1 week at school — strong continuity on real engineering work with an academic anchor.' },
      { id: 'experience', kw: 'experience journey career internship path work history', text: 'His experiences built the layers of an AI Engineer: 2024 OCP (industrial data analytics, SQL); 2025 AQUADVISER (Graph-RAG, Neo4j, LLMs); 2025 UM6P (multimodal AI research, EEG/IMU); 2026 LISTIC/USMB (Secure Document AI). Progression: Data → Machine Learning → Knowledge Systems → Generative AI → Trustworthy AI systems.' },
      { id: 'securedocai', kw: 'securedocai secure document rbac governance listic leakage flagship trustworthy pii phi access control evaluate hallucination', text: 'SecureDocAI (LISTIC, USMB, Feb–Jul 2026) answers: how can an organization use LLMs over sensitive documents without giving every user access to everything? Two layers — Document Intelligence (OCR, extraction, canonical JSON, PII/PHI detection, vector index, knowledge graph) and Secure AI Governance (authenticated role, injection/jailbreak detection, policy filtering, authorized retrieval, context minimization, controlled LLM, output firewall, final validation). Evaluated on 500 documents / 6,000 scenarios: 97.8% RBAC compliance, 95% authorized utility, unauthorized leakage cut from 15.39% to 0.21% (98.6% relative reduction), PII/PHI micro-F1 0.96, risk classifier ROC-AUC 0.98. Insight: security without utility is not enough.' },
      { id: 'contribution', kw: 'personally implement contribution did build role my part himself', text: 'On SecureDocAI Ahmed designed and implemented major parts as part of a research team: architecture design, the document-processing pipeline, RAG/Graph-RAG integration, security mechanisms (RBAC, prompt-injection filtering, sensitive-data protection), agent orchestration, FastAPI services, the evaluation protocol, experimental analysis, technical documentation and a contribution to the scientific manuscript.' },
      { id: 'neurologiqueTwin', kw: 'neurologiquetwin neurologique twin eeg imu multimodal digital um6p innovboost signal deep learning', text: 'NeurologiqueTWIN (UM6P, 2025) is a multimodal AI / digital-twin project fusing EEG brain signals and IMU motion signals for neurological monitoring. Pipeline: synchronization, segmentation, feature extraction, deep-learning classification (PyTorch, CNN, attention). Result: ≈92% internal classification accuracy and 2nd Prize at Innov\'Boost 2025. Lesson: data synchronization and signal quality can matter as much as model architecture.' },
      { id: 'graphRag', kw: 'graphrag graph rag aquadviser knowledge graph neo4j retrieval hybrid embeddings vector', text: 'At AQUADVISER (2025) Ahmed built a Graph-RAG assistant combining vector similarity and explicit graph relationships (Neo4j) with LLMs to answer business questions with sourced answers, exposed via FastAPI. Lesson: vector similarity and graph relationships solve different retrieval problems and complement each other.' },
      { id: 'multiAgent', kw: 'multi agent agentic langgraph crewai sql data assistant kpi workflow orchestration why agents', text: 'The Intelligent Multi-Agent Data Assistant turns a natural-language business question into an auditable analysis through an explicit, controlled agent workflow (LangGraph, CrewAI): understanding → SQL generation → consistency check → controlled execution → KPI → visualization → synthesis. Lesson: prefer explicit, controlled agent workflows over uncontrolled autonomous conversations.' },
      { id: 'gear5', kw: 'gear5 green ai distillation quantization int8 efficiency energy latency tinyllama distilgpt2', text: 'GEAR5 is a Green AI project reducing inference cost while keeping useful behavior: teacher-student knowledge distillation, adaptive gating and INT8 quantization, energy tracked via CodeCarbon (PyTorch, Hugging Face, TinyLLaMA, DistilGPT2). Lesson: the best model is not always the largest model.' },
      { id: 'nlpMatching', kw: 'nlp cv job matching resume recruitment semantic sbert tfidf tf-idf embeddings ner similarity hiring recommendation recommend offers', text: 'NLP CV–Job Matching is an applied NLP project that matches CVs to job offers and recommends the most relevant offers for a given CV. It parses CVs and offers, extracts skills/entities (NER), scores with a hybrid of TF-IDF (lexical) and SBERT embeddings (semantic), then ranks by cosine similarity and returns the top recommended offers per CV. It reached about 95% matching precision. Lesson: combining TF-IDF and embeddings balances exact-term overlap with meaning, and extraction quality bounds the result.' },
      { id: 'bigData', kw: 'big data streaming kafka spark hadoop etl elt nosql pipeline data engineering', text: 'Ahmed has hands-on Big Data and streaming experience — Kafka, Spark, streaming ingestion, NoSQL stores, ETL/ELT with Docker — the data foundation underneath the AI systems he builds.' },
      { id: 'skills', kw: 'skills stack technologies tools tech frameworks languages programming used', text: 'Stack by layer — AI/ML: Python, PyTorch, TensorFlow, scikit-learn, XGBoost. Generative AI: LLMs, RAG, Graph-RAG, LangGraph, CrewAI, LangChain, Hugging Face, SBERT. Knowledge & Data: SQL, PostgreSQL, SQL Server, Neo4j, ChromaDB, MongoDB. Data Engineering: Kafka, Spark, Hadoop, HDFS, Hive, ETL/ELT. Engineering: FastAPI, REST APIs, Docker, Git, Linux, testing. BI: Power BI, DAX, Power Query. Tools are not the goal — architecture and measurable value are.' },
      { id: 'mindset', kw: 'mindset approach think philosophy principles method strongest', text: 'Ten principles guide his engineering: problem before technology; baseline before complexity; measure before claiming; security by design; data quality matters; traceability matters; human oversight for critical decisions; build for maintainability; learn by testing; avoid unnecessary complexity. Two lines sum it up: "I don\'t use AI because it is fashionable — I use it when it provides measurable value" and "I see AI engineering as a complete system problem: data, models, software, security, evaluation and deployment."' },
      { id: 'softskills', kw: 'soft skills how do you work behavior curiosity analytical rigor autonomy fast learning communication teamwork adaptability problem solving pragmatism personality', text: 'How Ahmed works (soft skills as behaviors): Curiosity — understands systems beyond the surface and explores alternatives. Analytical thinking — breaks problems into components with measurable objectives. Rigor — reproducible experiments, validation, testing, documentation. Autonomy — investigates, prototypes, and knows when to ask for expert feedback. Fast learning — picks up new frameworks and domains as needed. Communication — explains architectures to technical and non-technical audiences. Teamwork — values discussion, code review and feedback. Adaptability — has worked across data analytics, knowledge graphs, deep learning, generative AI and secure AI. Problem solving — understands the problem before choosing a technology. Engineering pragmatism — the simplest architecture that reliably works, adding complexity only for measurable value.' },
      { id: 'thales', kw: 'thales fit critical systems aerospace defense reliability robustness learn explore', text: 'What attracts Ahmed to Thales is AI where performance alone is not enough — reliability, security, traceability and human control also matter. His verified experience in trustworthy generative AI, secure RAG, knowledge graphs, agents, data engineering, multimodal AI and experimental evaluation connects to the general challenges of reliable industrial AI. He wants to explore AI for critical systems, robustness, explainability, cybersecurity and deployment under strong constraints. He does not claim knowledge of any confidential Thales project.' },
      { id: 'whyme', kw: 'why you why me strengths value bring add team', text: 'Ahmed brings an end-to-end AI perspective (data → models → APIs → security → deployment), a mix of research and engineering, direct trustworthy-AI experience from SecureDocAI, fast learning across domains, and the ability to explain technical systems. Curious enough to explore, rigorous enough to measure, pragmatic enough to simplify.' },
      { id: 'languages', kw: 'language languages english french arabic speak', text: 'Languages: Arabic — native / bilingual; French — C1; English — C1.' },
      { id: 'achievements', kw: 'achievement award prize distinction results recognition hackathon competition', text: '2nd Prize at the Innov\'Boost 2025 hackathon (The Startups Competition, Forum ENSAJ Entreprises, ENSA El Jadida) for NeurologiqueTWIN. SecureDocAI: 97.8% RBAC compliance and unauthorized leakage cut from 15.39% to 0.21% (98.6% relative reduction) across 6,000 scenarios. ≈92% classification accuracy on NeurologiqueTWIN.' },
      { id: 'publication', kw: 'publication paper manuscript research scientific writing article listic', text: 'Research output: Ahmed contributed to a scientific manuscript for the SecureDocAI work at LISTIC (Université Savoie Mont Blanc) — including the experimental protocol, experimental analysis and technical writing. This is a manuscript contribution from a research internship, not a claim of an independently published paper.' }
    ];

    // Curated answers for common interview questions (KB-mode responses).
    var FAQS = [
      { keys: 'tell me about ahmed yourself who introduce presentation', a: '**Ahmed Moubarak Lahlyal is an AI Engineer** with a strong Data Engineering foundation, focused on trustworthy AI, generative AI, knowledge graphs and agentic systems. He works across the whole AI system — data, models, retrieval, agents, APIs, security, evaluation and deployment. His experiences built these layers step by step, from industrial data at OCP to Secure Document AI at LISTIC. He enjoys working where research, engineering and real-world constraints meet.' },
      { keys: 'explain securedocai secure document flagship', a: '**SecureDocAI** (LISTIC / USMB, 2026) tackles one problem: how can an organization use LLMs over sensitive documents **without giving every user access to everything?**\n\nIt has two layers:\n**1 · Document Intelligence** — OCR/parsing, extraction to canonical JSON, PII/PHI detection, vector index and a knowledge graph.\n**2 · Secure AI Governance** — authenticated role, prompt-injection detection, policy filtering, authorized retrieval, context minimization, a controlled LLM, an output firewall and final validation.\n\nOn **500 documents / 6,000 scenarios**: **97.8% RBAC compliance**, **95% authorized utility**, and unauthorized leakage cut from **15.39% to 0.21%** (98.6% relative reduction). Security without utility is not enough.' },
      { keys: 'what did ahmed personally implement contribution build role', a: 'As part of a research team, Ahmed **designed and implemented major parts** of SecureDocAI: the architecture, the document-processing pipeline, RAG / Graph-RAG integration, security mechanisms (RBAC, prompt-injection filtering, sensitive-data protection), agent orchestration, FastAPI services, the evaluation protocol, experimental analysis, technical documentation and a contribution to the scientific manuscript.' },
      { keys: 'evaluate evaluated securedocai metrics test scenarios how', a: 'SecureDocAI was evaluated end-to-end on **6,000 scenarios** over 500 documents — RBAC probes, prompt-injection attempts and PII/PHI checks. Headline metrics: **97.8% RBAC compliance**, **95% authorized utility**, unauthorized leakage **15.39% → 0.21%** (98.6% relative reduction), **PII/PHI micro-F1 0.96**, and **risk classifier ROC-AUC 0.98**.' },
      { keys: 'why thales fit critical reliable', a: 'What attracts Ahmed to **Thales** is AI where **performance alone is not enough** — reliability, security, traceability and human control matter too. His verified experience in trustworthy generative AI, secure RAG, knowledge graphs, agents, data engineering, multimodal AI and rigorous evaluation connects directly to the general challenges of reliable industrial AI. He does not claim to know any confidential Thales project — he looks forward to the team explaining it.' },
      { keys: 'rag experience retrieval', a: 'Ahmed has practical **RAG** experience across projects: secure RAG and Graph-RAG in **SecureDocAI**, and a hybrid Graph-RAG assistant at **AQUADVISER** combining embeddings, a Neo4j knowledge graph and LLMs (FastAPI). His view: vector similarity and graph relationships solve different retrieval problems and complement each other.' },
      { keys: 'knowledge graph neo4j graphrag', a: 'Yes — **Knowledge Graphs** are a recurring theme. At **AQUADVISER** he built hybrid retrieval over a **Neo4j** knowledge graph; in **SecureDocAI** the document layer feeds both a vector index and a knowledge graph so retrieval can respect explicit relationships, not only similarity.' },
      { keys: 'deep learning multimodal neurologiquetwin eeg', a: 'Yes. **NeurologiqueTWIN** (UM6P, 2025) is a multimodal deep-learning / digital-twin project fusing **EEG + IMU** signals for neurological monitoring — synchronization, segmentation, feature extraction and classification with PyTorch (CNN, attention) — reaching **≈92% internal accuracy** and **2nd Prize at Innov\'Boost 2025**.' },
      { keys: 'langgraph crewai agents why', a: 'Ahmed uses **LangGraph and CrewAI** for **explicit, controlled agent workflows** rather than free-form autonomy. In his Multi-Agent Data Assistant a business question flows through understanding → SQL generation → consistency check → controlled execution → KPI → visualization → synthesis, so every step is auditable.' },
      { keys: 'data engineering big data kafka spark streaming', a: 'Yes — Ahmed has a solid **Data Engineering** foundation: **Kafka, Spark, Hadoop/HDFS/Hive, ETL/ELT** and streaming into NoSQL stores, containerized with Docker. It is the data layer underneath his AI systems — models are only as reliable as the pipelines feeding them.' },
      { keys: 'technologies used stack tools skills', a: 'By layer — **AI/ML:** Python, PyTorch, TensorFlow, scikit-learn, XGBoost. **Generative AI:** LLMs, RAG, Graph-RAG, LangGraph, CrewAI, LangChain, Hugging Face, SBERT. **Knowledge & Data:** SQL, PostgreSQL, SQL Server, Neo4j, ChromaDB, MongoDB. **Data Engineering:** Kafka, Spark, Hadoop, HDFS, Hive, ETL/ELT. **Engineering:** FastAPI, REST, Docker, Git, Linux, testing. **BI:** Power BI, DAX, Power Query.' },
      { keys: 'strongest best projects', a: 'His strongest work: **SecureDocAI** (trustworthy generative AI, the flagship), **NeurologiqueTWIN** (multimodal deep learning, 2nd Prize Innov\'Boost 2025), and **Graph-RAG at AQUADVISER** (knowledge-graph retrieval). Together they show data, deep learning, knowledge systems, generative AI and security.' },
      { keys: 'learn learning want thales grow', a: 'At Thales, Ahmed wants to explore **AI for critical systems** — robustness, reliability, explainability, cybersecurity, industrial validation, human-AI collaboration and deployment under strong constraints — and to understand how advanced AI research becomes a dependable capability.' },
      { keys: 'apprenticeship schedule rhythm alternance availability', a: 'Ahmed\'s apprenticeship rhythm for the Advanced Master® at EFREI Paris (2026–2027) is **2 weeks in the company / 1 week at school** — strong continuity on real engineering work with a regular academic anchor.' },
      { keys: 'bring team value add', a: 'Ahmed brings an **end-to-end AI perspective** (data → models → APIs → security → deployment), a blend of research and engineering, direct trustworthy-AI experience, fast learning across domains, and the ability to explain technical systems clearly through architecture, documentation and presentations.' },
      { keys: 'hallucination reduce grounding', a: 'Ahmed reduces hallucinations by **grounding generation in retrieval** (RAG / Graph-RAG over authorized content), minimizing context, validating outputs (an output firewall / final validation in SecureDocAI), and evaluating end-to-end on adversarial scenarios rather than trusting a single demo.' },
      { keys: 'soft skills how do you work behavior curiosity rigor autonomy teamwork adaptability pragmatism personality', a: 'Ahmed describes his soft skills as **behaviors**: **curiosity** (understanding systems beyond the surface), **analytical thinking** (breaking problems into measurable components), **rigor** (reproducible experiments, testing, documentation), **autonomy** (investigate and prototype, ask for feedback when needed), **fast learning**, **communication** (to technical and non-technical audiences), **teamwork** (discussion, code review, feedback), **adaptability** (across data analytics, KGs, deep learning, generative and secure AI) and **engineering pragmatism** — the simplest architecture that reliably solves the problem.' },
      { keys: 'engineering mindset principles think approach philosophy', a: 'Ahmed\'s engineering mindset in ten principles: **problem before technology**, baseline before complexity, **measure before claiming**, **security by design**, data quality matters, **traceability matters**, human oversight for critical decisions, build for maintainability, learn by testing, and avoid unnecessary complexity. In short: *"I use AI when it provides measurable value"* and *"AI engineering is a complete system problem — data, models, software, security, evaluation and deployment."*' },
      { keys: 'language languages english french arabic', a: 'Languages: **Arabic** — native / bilingual; **French** — C1; **English** — C1.' }
    ];

    var STOP = { the: 1, a: 1, an: 1, of: 1, to: 1, and: 1, is: 1, are: 1, in: 1, on: 1, for: 1, with: 1, what: 1, how: 1, why: 1, do: 1, does: 1, did: 1, his: 1, he: 1, ahmed: 1, you: 1, your: 1, me: 1, about: 1, tell: 1, can: 1, has: 1, have: 1 };
    function tokens(s) { return (s.toLowerCase().match(/[a-z0-9]+/g) || []).filter(function (t) { return t.length > 1 && !STOP[t]; }); }

    function retrieve(q) {
      var qt = tokens(q);
      var scored = KB.map(function (s) {
        var kws = s.kw.split(' '); var sc = 0;
        qt.forEach(function (t) {
          kws.forEach(function (k) { if (k === t) sc += 3; else if (k.indexOf(t) === 0 || t.indexOf(k) === 0) sc += 1; });
          if (s.text.toLowerCase().indexOf(t) !== -1) sc += 1;
        });
        return { s: s, sc: sc };
      }).sort(function (x, y) { return y.sc - x.sc; });
      var top = scored.filter(function (x) { return x.sc > 0; }).slice(0, 3);
      return { top: top, context: top.map(function (x) { return '[' + x.s.id + '] ' + x.s.text; }).join('\n\n') };
    }
    function bestFaq(q) {
      var qt = tokens(q); var best = null, bestSc = 0;
      FAQS.forEach(function (f) {
        var fk = f.keys.split(' '); var sc = 0;
        qt.forEach(function (t) { fk.forEach(function (k) { if (k === t) sc += 3; else if (k.indexOf(t) === 0) sc += 1; }); });
        if (sc > bestSc) { bestSc = sc; best = f; }
      });
      return { f: best, sc: bestSc };
    }
    function answerKB(q) {
      var faq = bestFaq(q);
      var r = retrieve(q);
      if (faq.f && faq.sc >= 3) return faq.f.a;
      if (r.top.length && r.top[0].sc >= 3) return r.top[0].s.text;
      if (faq.f && faq.sc >= 2) return faq.f.a;
      if (r.top.length && r.top[0].sc >= 2) return r.top[0].s.text;
      return "I don't have verified information about that in Ahmed's portfolio. Try asking about SecureDocAI, his projects, his skills, his journey, or why he could fit an AI project at Thales.";
    }

    // ---- Mode probe ----
    var mode = 'knowledge-base', model = 'llama3.2';
    var statusEl = $('#ai-status'), statusText = $('#ai-status-text'), pipeModel = $('#pipe-model');
    function setStatus() {
      if (mode === 'ollama') { statusEl.className = 'status live'; statusText.textContent = 'Llama 3.2 · Local'; if (pipeModel) pipeModel.textContent = 'Llama 3.2 · local'; }
      else { statusEl.className = 'status kb'; statusText.textContent = 'Knowledge-base mode · Web'; if (pipeModel) pipeModel.textContent = 'Knowledge-base mode'; }
    }
    (function probe() {
      var ctrl = new AbortController(); var to = setTimeout(function () { ctrl.abort(); }, 2500);
      fetch('/api/chat', { method: 'GET', signal: ctrl.signal }).then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { clearTimeout(to); if (d && d.available) { mode = 'ollama'; model = d.model || model; } else { mode = 'knowledge-base'; } setStatus(); })
        .catch(function () { clearTimeout(to); mode = 'knowledge-base'; setStatus(); });
    })();

    // ---- UI ----
    var log = $('#chat-log'), chipsBox = $('#chat-chips'), textEl = $('#chat-text'), sendBtn = $('#chat-send');
    function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function fmt(s) { return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>'); }
    function addUser(t) { var d = document.createElement('div'); d.className = 'msg user'; d.textContent = t; log.appendChild(d); log.scrollTop = log.scrollHeight; }
    function addBot() { var d = document.createElement('div'); d.className = 'msg bot'; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
    function typingBubble() { var d = addBot(); d.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>'; return d; }
    function typeInto(el, text, srcLabel) {
      var html = fmt(text);
      if (reduced) { el.innerHTML = html + (srcLabel ? '<span class="src">' + srcLabel + '</span>' : ''); log.scrollTop = log.scrollHeight; return; }
      // typewriter on plain text, then swap to formatted html
      var plain = text; var i = 0; el.textContent = '';
      var iv = setInterval(function () {
        i += 3; el.textContent = plain.slice(0, i); log.scrollTop = log.scrollHeight;
        if (i >= plain.length) { clearInterval(iv); el.innerHTML = html + (srcLabel ? '<span class="src">' + srcLabel + '</span>' : ''); log.scrollTop = log.scrollHeight; }
      }, 12);
    }

    var busy = false;
    function ask(q) {
      if (busy || !q.trim()) return; busy = true; sendBtn.disabled = true;
      addUser(q);
      runPipeline();
      var r = retrieve(q);
      var bubble = typingBubble();
      var minDelay = new Promise(function (res) { setTimeout(res, 420); });
      if (mode === 'ollama') {
        var ctrl = new AbortController(); var to = setTimeout(function () { ctrl.abort(); }, 30000);
        Promise.all([
          fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q, context: r.context }), signal: ctrl.signal })
            .then(function (res) { return res.ok ? res.json() : null; }).catch(function () { return null; }),
          minDelay
        ]).then(function (arr) {
          clearTimeout(to); var d = arr[0];
          if (d && d.available && d.answer) { typeInto(bubble, d.answer, 'source: <b>Llama 3.2</b> · grounded in portfolio KB'); }
          else { mode = 'knowledge-base'; setStatus(); typeInto(bubble, answerKB(q), 'source: <b>knowledge base</b> · retrieval'); }
          finish();
        });
      } else {
        minDelay.then(function () { typeInto(bubble, answerKB(q), 'source: <b>knowledge base</b> · retrieval'); finish(); });
      }
    }
    function finish() { busy = false; sendBtn.disabled = false; }

    // suggested chips
    var chips = ['Tell me about Ahmed', 'Explain SecureDocAI', 'What did Ahmed personally implement?', 'Why would Ahmed fit an AI project at Thales?', 'What is NeurologiqueTWIN?', 'What experience does he have with RAG?', 'Does he know Data Engineering?', 'What is his apprenticeship schedule?'];
    chips.forEach(function (c) { var b = document.createElement('button'); b.className = 'qchip'; b.textContent = c; b.addEventListener('click', function () { ask(c); }); chipsBox.appendChild(b); });

    sendBtn.addEventListener('click', function () { var v = textEl.value; textEl.value = ''; ask(v); });
    textEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); var v = textEl.value; textEl.value = ''; ask(v); } });
    textEl.addEventListener('input', function () { textEl.style.height = '42px'; textEl.style.height = Math.min(textEl.scrollHeight, 110) + 'px'; });

    $('#chat-clear').addEventListener('click', function () { log.innerHTML = ''; greet(); });
    function greet() { var d = addBot(); d.innerHTML = fmt("Hi — I'm **Ahmed AI**, grounded in Ahmed's portfolio. Ask about SecureDocAI, his projects, skills, journey, or why he could fit an AI role at Thales. Pick a question below or type your own."); }
    greet();

    // How it works + pipeline toggle
    var pipeCard = $('#pipeline-card'), pipeOn = false;
    $('#toggle-pipeline').addEventListener('click', function () { pipeOn = !pipeOn; pipeCard.style.display = pipeOn ? '' : 'none'; this.textContent = pipeOn ? 'Hide AI pipeline' : 'Show AI pipeline'; });
    $('#how-it-works').addEventListener('click', function () {
      pipeOn = true; pipeCard.style.display = ''; $('#toggle-pipeline').textContent = 'Hide AI pipeline';
      pipeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      var d = addBot();
      d.innerHTML = fmt('**How it works:** Question → Portfolio Retrieval → Relevant Context → ' + (mode === 'ollama' ? 'Llama 3.2' : 'Knowledge-base answer') + ' → Grounded Answer. Retrieval runs in your browser over a local knowledge base; generation is ' + (mode === 'ollama' ? 'Llama 3.2 through a same-origin /api/chat route' : 'a curated knowledge-base response') + '. Answers never invent experience, metrics or confidential information.');
      runPipeline();
    });
    function runPipeline() {
      if (!pipeOn || reduced) return;
      var steps = $$('.pipe-step'); steps.forEach(function (s) { s.classList.remove('lit'); });
      var i = 0; (function n() { if (i < steps.length) { steps[i].classList.add('lit'); i++; setTimeout(n, 260); } })();
    }

    // Ask Me talking points
    var talking = {
      'Tell me about yourself': ['AI Engineer, strong data foundation → trustworthy & generative AI.', 'End-to-end: data → models → retrieval → agents → security → deployment.', 'Progression OCP → AQUADVISER → UM6P → LISTIC (SecureDocAI).', 'Research + engineering, drawn to real-world constraints.'],
      'Why Thales?': ['AI where performance alone is not enough — reliability, security, traceability.', 'My work (secure RAG, KGs, agents, evaluation) maps to reliable industrial AI.', 'Want to explore critical systems, robustness, explainability.', 'No claim on the confidential project — eager to learn it.'],
      'Why you?': ['End-to-end perspective, not just frameworks.', 'Direct trustworthy-AI experience (SecureDocAI).', 'Fast learner across industrial data, KGs, multimodal, genAI.', 'I can explain and document complex systems.'],
      'Explain SecureDocAI': ['Problem: LLMs over sensitive docs without over-sharing.', 'Layer 1 document intelligence, Layer 2 secure governance.', '6,000 scenarios: 97.8% RBAC, leakage 15.39%→0.21%.', 'Security without utility is not enough — kept 95% utility.'],
      'RAG vs Fine-tuning': ['RAG: grounding, traceability, easy updates, no retraining.', 'Fine-tuning: style/format, latency, when knowledge is stable.', 'For sensitive/traceable answers I default to RAG.', 'They combine — retrieve facts, tune behavior.'],
      'RAG vs Graph-RAG': ['Vector RAG: semantic similarity over chunks.', 'Graph-RAG: explicit relationships, multi-hop reasoning.', 'They solve different problems — I combine them.', 'Used both at AQUADVISER and in SecureDocAI.'],
      'Why agents?': ['Break a task into controlled, auditable steps.', 'I prefer explicit workflows over free-form autonomy.', 'LangGraph/CrewAI for orchestration + checks.', 'More critical → more validation and human oversight.'],
      'LangGraph vs CrewAI': ['LangGraph: graph/state machine, explicit control & branching.', 'CrewAI: role-based collaborating agents, quick to compose.', 'I lean LangGraph when control and auditability matter.', 'Choice follows the constraint, not the hype.'],
      'How do you evaluate an LLM application?': ['Define measurable objectives + failure cases first.', 'Scenario suites (e.g. 6,000 for SecureDocAI).', 'Track utility AND safety (RBAC, leakage, PII F1).', 'Reproducible experiments, not a single demo.'],
      'How do you reduce hallucinations?': ['Ground in retrieval over authorized content.', 'Minimize context; validate outputs (output firewall).', 'Constrain the task; prefer explicit steps.', 'Measure on adversarial scenarios.'],
      'What is your biggest technical challenge?': ['Balancing security and utility in SecureDocAI.', 'Cutting leakage 15.39%→0.21% while keeping 95% utility.', 'Required careful retrieval, policy filtering, evaluation.', 'Taught me security must be designed in, not bolted on.'],
      'Research or engineering?': ['Both — I define experiments and ship working systems.', 'Research rigor (metrics, manuscripts) + engineering (APIs, Docker).', 'Thales sits exactly at that intersection.', 'That mix is what I want to keep doing.'],
      'What are your strengths?': ['End-to-end system thinking.', 'Trustworthy-AI and evaluation discipline.', 'Fast cross-domain learning.', 'Clear technical communication.'],
      'What do you want to learn?': ['AI for critical / safety-relevant systems.', 'Robustness, reliability, explainability.', 'Industrial validation & deployment constraints.', 'Human-AI collaboration in the loop.']
    };
    var amCards = $('#askme-cards'), amAns = $('#askme-answer');
    Object.keys(talking).forEach(function (k) {
      var b = document.createElement('button'); b.className = 'askme-card'; b.textContent = k;
      b.addEventListener('click', function () {
        $$('.askme-card').forEach(function (o) { o.classList.remove('active'); }); b.classList.add('active');
        amAns.className = 'askme-answer show';
        amAns.innerHTML = '<b style="color:var(--cyan)">' + k + '</b><ul>' + talking[k].map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul>';
      });
      amCards.appendChild(b);
    });
  })();

  /* ============================================================
     Presentation mode
     ============================================================ */
  (function () {
    var STEPS = [
      { id: 'intro', label: 'Intro' }, { id: 'profile', label: 'Profile' }, { id: 'journey', label: 'Journey' },
      { id: 'securedocai', label: 'SecureDocAI' }, { id: 'projects', label: 'AI Projects' }, { id: 'mindset', label: 'Engineering Mindset' },
      { id: 'thales', label: 'Why Thales' }, { id: 'assistant', label: 'AI Assistant' }, { id: 'contact', label: "Let's Talk" }
    ];
    var HINTS = {
      intro: ['Open with the one-line: data → deployment, with security in mind.', 'Point at the chips: LLMs, RAG/Graph-RAG, KGs, Agentic, Secure AI.', 'Note: graduating 2026, EFREI Advanced Master, 2w/1w apprenticeship.'],
      profile: ['“Tell me about yourself” lands here.', 'Three pillars: AI Engineering, Data Foundations, Trustworthy Systems.', 'I understand complete systems, not just frameworks.'],
      journey: ['Not many unrelated internships — a progression.', 'Each role added a layer: Data → ML → Knowledge → GenAI → Trustworthy.', 'LISTIC (SecureDocAI) is where it converges.'],
      securedocai: ['Lead with the PROBLEM, not the tech.', 'Walk Layer 1 (document) then Layer 2 (security) — click the tabs.', 'Headline: 97.8% RBAC, leakage 15.39%→0.21%, 95% utility kept.', 'Open “My contribution” to show what I personally did.'],
      projects: ['Click each tab; the visual animates live.', 'For each: Problem → Built → Core → Lesson.', 'Highlight NeurologiqueTWIN (2nd prize) and Graph-RAG.'],
      mindset: ['This is the part that matters for critical systems.', 'Five principles; land on “security by design” and “human control”.', 'Quote: use LLMs/agents only where they bring measurable value.'],
      thales: ['Honest overlap, not flattery.', 'Left = what I built, Right = what I want to explore.', 'Ask them: “what problem would you want me on first?”', 'Then Why-me: five evidence-based points.'],
      assistant: ['Turn the tool on myself: an AI candidate arrives with an assistant.', 'Toggle “Show AI pipeline” to explain retrieval → Llama → grounded.', 'It answers ONLY from the KB — never invents.', 'Locally it runs Llama 3.2; on the web, knowledge-base mode.'],
      contact: ['Close on “AI that can be trusted”.', 'Give the apprenticeship rhythm again (2w/1w).', 'Ask the three prepared questions.', 'Thank them.']
    };

    var body = document.body, rail = $('#present-rail'), ind = $('#pv-ind'), hintBox = $('#presenter-hint'), hintList = $('#ph-list');
    var current = 0, presenting = false, hintOn = true;

    // build rail
    STEPS.forEach(function (s, i) {
      var it = document.createElement('div'); it.className = 'rail-item'; it.dataset.i = i;
      it.innerHTML = '<span class="num">' + ('0' + (i + 1)).slice(-2) + '</span><span class="bar"></span><span class="lbl">' + s.label + '</span>';
      it.addEventListener('click', function () { goTo(i); });
      rail.appendChild(it);
    });

    function renderHint() {
      var id = STEPS[current].id; var arr = HINTS[id] || [];
      hintList.innerHTML = arr.map(function (h) { return '<li>' + h + '</li>'; }).join('');
      hintBox.querySelector('.t').textContent = ('0' + (current + 1)).slice(-2) + ' · ' + STEPS[current].label;
      hintBox.classList.toggle('show', presenting && hintOn);
    }
    function updateUI() {
      $$('.rail-item').forEach(function (el, i) { el.classList.toggle('active', i === current); });
      ind.textContent = ('0' + (current + 1)).slice(-2) + ' / ' + ('0' + STEPS.length).slice(-2);
      renderHint();
    }
    function goTo(i) {
      current = Math.max(0, Math.min(STEPS.length - 1, i));
      var el = document.getElementById(STEPS[current].id);
      if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      updateUI();
    }
    function enter() {
      presenting = true; body.classList.add('presenting');
      // sync to nearest current section
      syncCurrent(); goTo(current); updateUI();
    }
    function exit() { presenting = false; body.classList.remove('presenting'); hintBox.classList.remove('show'); }
    function toggle() { presenting ? exit() : enter(); }

    function syncCurrent() {
      var best = 0, bestDist = Infinity;
      STEPS.forEach(function (s, i) { var el = document.getElementById(s.id); if (!el) return; var d = Math.abs(el.getBoundingClientRect().top); if (d < bestDist) { bestDist = d; best = i; } });
      current = best;
    }

    // track current on scroll (both modes, keeps rail honest)
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { var idx = STEPS.map(function (s) { return s.id; }).indexOf(e.target.id); if (idx >= 0) { current = idx; if (presenting) updateUI(); } } });
    }, { threshold: .5 });
    STEPS.forEach(function (s) { var el = document.getElementById(s.id); if (el) spy.observe(el); });

    // buttons
    $('#present-toggle').addEventListener('click', toggle);
    $('#hero-present').addEventListener('click', enter);
    $('#pv-next').addEventListener('click', function () { goTo(current + 1); });
    $('#pv-prev').addEventListener('click', function () { goTo(current - 1); });
    $('#pv-exit').addEventListener('click', exit);
    $('#pv-hint').addEventListener('click', function () { hintOn = !hintOn; renderHint(); });
    $('#ph-close').addEventListener('click', function () { hintOn = false; hintBox.classList.remove('show'); });

    // keyboard
    document.addEventListener('keydown', function (e) {
      var lb = $('#lightbox');
      if (e.key === 'Escape') { if (lb.classList.contains('open')) { lb.classList.remove('open'); return; } if (presenting) { exit(); return; } }
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'textarea' || tag === 'input') return;
      if (!presenting) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); goTo(current + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); goTo(current - 1); }
    });
  })();
})();
