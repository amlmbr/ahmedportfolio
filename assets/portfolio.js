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

  var PROFILE = window.AHMED_PROFILE || {};
  var openDeck = null; // assigned by the interview-deck module below

  /* ============================================================
     Reusable animated pipeline component
     buildPipeline(container, pipelineDef) — renders a node/arrow flow,
     animates once when scrolled into view, supports parallel branches
     and click/keyboard tooltips. Respects prefers-reduced-motion.
     ============================================================ */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function buildPipeline(container, def) {
    if (!container || !def) return;
    container.innerHTML = '';
    container.className = 'pipe' + (def.accent === 'amber' ? ' amber' : '');
    var flow = document.createElement('div'); flow.className = 'pipe-flow';
    var order = []; // ordered list of .pnode elements for animation
    def.nodes.forEach(function (n, i) {
      if (i > 0) { var ar = document.createElement('span'); ar.className = 'pipe-arrow'; ar.setAttribute('aria-hidden', 'true'); ar.textContent = '→'; flow.appendChild(ar); }
      if (n.branch) {
        var br = document.createElement('div'); br.className = 'pipe-branch';
        n.branch.forEach(function (bl) {
          var pn = document.createElement('div'); pn.className = 'pnode'; pn.textContent = bl; br.appendChild(pn); order.push(pn);
        });
        flow.appendChild(br);
      } else {
        var el;
        if (n.t) { el = document.createElement('button'); el.type = 'button'; el.setAttribute('aria-label', n.l + ' — details'); el.dataset.tip = n.t; el.classList.add('has-tip'); }
        else { el = document.createElement('div'); }
        el.className = (el.className ? el.className + ' ' : '') + 'pnode'; el.textContent = n.l;
        flow.appendChild(el); order.push(el);
      }
    });
    container.appendChild(flow);
    var tip = document.createElement('div'); tip.className = 'pipe-tip'; tip.hidden = true; container.appendChild(tip);

    // tooltips (click / keyboard)
    $$('.pnode.has-tip', flow).forEach(function (b) {
      b.addEventListener('click', function () {
        var open = b.classList.contains('tip-open');
        $$('.pnode.has-tip', flow).forEach(function (o) { o.classList.remove('tip-open'); });
        if (open) { tip.hidden = true; return; }
        b.classList.add('tip-open'); tip.innerHTML = '<b>' + esc(b.textContent) + '</b> — ' + esc(b.dataset.tip); tip.hidden = false;
      });
    });

    function light() { order.forEach(function (el) { el.classList.add('on'); }); container.classList.add('done'); }
    if (reduced) { light(); return; }
    var started = false;
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !started) {
          started = true;
          var i = 0; (function step() { if (i < order.length) { order[i].classList.add('on'); i++; setTimeout(step, 170); } else container.classList.add('done'); })();
          obs.unobserve(container);
        }
      });
    }, { threshold: 0.25 });
    obs.observe(container);
    // replay on click of the container background
    container.addEventListener('dblclick', function () { order.forEach(function (el) { el.classList.remove('on'); }); var i = 0; (function step() { if (i < order.length) { order[i].classList.add('on'); i++; setTimeout(step, 120); } })(); });
  }

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
    var pl = PROFILE.pipelines || {};
    if ($('#flow-doc') && pl['securedocai-doc']) buildPipeline($('#flow-doc'), pl['securedocai-doc']);
    if ($('#flow-sec') && pl['securedocai-sec']) buildPipeline($('#flow-sec'), pl['securedocai-sec']);
    if ($('#flow-eval') && pl['securedocai-eval']) buildPipeline($('#flow-eval'), pl['securedocai-eval']);

    var explains = {
      doc: 'Raw, heterogeneous documents are turned into <b>structured, protected knowledge</b>: parsed, routed by domain, extracted to canonical JSON, scanned for PII / PHI, then indexed for both vector search and a knowledge graph. <span style="color:var(--faint)">Click a node with ⓘ for details.</span>',
      sec: 'Every request is governed: the user\'s <b>authenticated role</b> drives access, adversarial prompts are filtered, retrieval is restricted to authorized content, the context is minimized, and the model\'s output passes an <b>output firewall</b> and final validation. <span style="color:var(--faint)">Click a node with ⓘ for details.</span>',
      eval: 'The system was stress-tested on <b>6,000 scenarios</b> across 5 domains — normal, sensitive and adversarial queries, RBAC and PII / PHI tests — producing the measured metrics below.'
    };
    var explEl = $('#arch-explain');
    function setExplain(k) { if (explEl) explEl.innerHTML = explains[k]; }

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
        type: 'Multimodal AI · Digital Twin', title: 'NeurologiqueTWIN', org: 'UM6P — 2025',
        problem: 'Combine heterogeneous physiological signals (EEG and IMU) into a reliable model for neurological monitoring.',
        built: 'An end-to-end multimodal pipeline: signal synchronization, segmentation, feature extraction and a deep-learning classifier fusing both modalities.',
        contribution: 'Built the EEG/IMU processing pipeline, aligned the two modalities, engineered the features and implemented and evaluated the classification model.',
        core: 'Python · PyTorch · TensorFlow · CNN · Attention · EEG / IMU · Time Series',
        kpi: ['≈92%', 'internal classification accuracy'],
        results: '≈92% internal classification accuracy; won 2nd Prize at Innov\'Boost 2025.',
        lesson: 'In multimodal AI, data synchronization and signal quality can matter as much as model architecture.'
      },
      'v-rag': {
        type: 'Knowledge Graph · Generative AI', title: 'Graph-RAG — AQUADVISER', org: 'AQUADVISER — 2025',
        problem: 'Retrieve business information using both semantic similarity and the explicit relationships between entities.',
        built: 'A hybrid retrieval assistant combining vector embeddings, a Neo4j knowledge graph and LLMs, served through a FastAPI API.',
        contribution: 'Designed the hybrid retrieval strategy, modelled the Neo4j knowledge graph, integrated embeddings with graph traversal and exposed the service via FastAPI.',
        core: 'Python · FastAPI · Neo4j · Embeddings · Vector Search · LLMs · Graph-RAG',
        kpi: ['sourced', 'grounded, relationship-aware answers'],
        results: 'Questions resolved into grounded, source-attributed answers that use both similarity and graph relationships.',
        lesson: 'Vector similarity and graph relationships solve different retrieval problems and complement each other.'
      },
      'v-agents': {
        type: 'Agentic AI · Controlled workflow', title: 'Intelligent Multi-Agent Data Assistant', org: 'Applied project',
        problem: 'Turn a natural-language business question into a controlled, auditable data analysis.',
        built: 'An explicit agent workflow: question understanding → SQL generation → consistency check → controlled execution → KPI computation → visualization → natural-language synthesis.',
        contribution: 'Designed the controlled workflow, orchestrated the agents with LangGraph/CrewAI, added the SQL consistency checks and built the FastAPI/Streamlit interfaces.',
        core: 'Python · LangGraph · CrewAI · SQL · FastAPI · Streamlit · LLMs',
        kpi: ['auditable', 'explicit steps, not free-form autonomy'],
        results: 'Every answer is traceable step by step, keeping the analysis controllable and reviewable.',
        lesson: 'I prefer explicit, controlled agent workflows over uncontrolled autonomous conversations.'
      },
      'v-gear': {
        type: 'Green AI · Efficiency', title: 'GEAR5 — Green AI', org: 'R&D project',
        problem: 'Reduce inference cost while preserving useful language-model behavior.',
        built: 'Teacher-student knowledge distillation with adaptive gating and INT8 quantization, with energy consumption measured via CodeCarbon.',
        contribution: 'Implemented the distillation and gating experiments, applied INT8 quantization and measured the quality/latency/memory/energy trade-off.',
        core: 'PyTorch · Hugging Face · TinyLLaMA · DistilGPT2 · INT8 · CodeCarbon',
        kpi: ['trade-off', 'quality · latency · memory · energy'],
        results: 'A measured trade-off across quality, latency, memory and energy — smaller student models kept useful behavior at lower cost.',
        lesson: 'The best model is not always the largest model.'
      },
      'v-nlp': {
        type: 'NLP · Matching & Recommendation', title: 'NLP CV–Job Matching', org: 'Applied NLP project',
        problem: 'Match CVs to job offers by meaning, and recommend the most relevant offers for a given CV — not just keyword overlap.',
        built: 'A hybrid matching + recommendation pipeline: parse CVs and offers, extract skills/entities, score with TF-IDF (lexical) and SBERT embeddings (semantic), then rank and recommend the best-fitting offers per CV.',
        contribution: 'Built the text pre-processing and entity extraction, combined TF-IDF with SBERT embeddings, and implemented the similarity scoring and offer recommendation.',
        core: 'Python · TF-IDF · SBERT · Embeddings · NER · Cosine Similarity · scikit-learn',
        kpi: ['95%', 'CV–offer matching precision'],
        results: '≈95% matching precision; for each CV it returns a ranked Top-5 shortlist of the most relevant offers, blending lexical (TF-IDF) and semantic (SBERT) signals.',
        lesson: 'Combining TF-IDF and embeddings balances exact-term overlap with meaning — and extraction quality still bounds the result.'
      },
      'v-data': {
        type: 'Data Engineering · Foundation', title: 'Big Data / Streaming', org: 'OCP Group & coursework',
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
      stageTitle.textContent = p.title;
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
      // per-project animated pipeline
      var pipeMap = { 'v-eeg': 'neurologiquetwin', 'v-rag': 'graphrag', 'v-agents': 'multiagent', 'v-gear': 'gear5' };
      var pdef = (PROFILE.pipelines || {})[pipeMap[key]];
      var pcont = $('#proj-pipeline'), ptitle = $('#proj-pipe-title');
      if (pcont && pdef) { buildPipeline(pcont, pdef); if (ptitle) ptitle.innerHTML = 'Technical pipeline — <b>' + esc(pdef.title) + '</b>'; }
    }
    var tabs = $$('.show-tab[data-v]');
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

  /* ===== Generic show/hide toggles ===== */
  (function () {
    $$('.js-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var t = document.getElementById(btn.dataset.target); if (!t) return;
        var show = t.hidden; t.hidden = !show;
        btn.setAttribute('aria-expanded', show ? 'true' : 'false');
        if (btn.dataset.more) btn.textContent = show ? (btn.dataset.less || 'Show less') : btn.dataset.more;
      });
    });
  })();

  /* ===== Professional & R&D Experience timeline ===== */
  (function () {
    var host = $('#xp-timeline'); if (!host || !PROFILE.experiences) return;
    if (host.querySelector('.xp-item')) return; // static cards already present — leave them
    var html = PROFILE.experiences.map(function (x) {
      var worked = x.worked.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('');
      var tech = x.tech.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
      var loc = x.location ? '<div class="xp-loc">' + esc(x.location) + '</div>' : '';
      return '<div class="xp-item' + (x.current ? ' now' : '') + '">' +
          '<div class="xp-rail"><span class="xp-dot"></span>' +
            '<div class="xp-dates">' + esc(x.start) + ' → ' + esc(x.end) + '</div>' +
            '<div class="xp-org">' + esc(x.org) + '</div>' +
            '<div class="xp-sub">' + esc(x.sub) + '</div>' + loc +
          '</div>' +
          '<div class="xp-body">' +
            '<div class="xp-role">' + esc(x.role) + '</div>' +
            '<div class="xp-proj">' + esc(x.project) + '</div>' +
            '<p class="xp-problem">' + esc(x.problem) + '</p>' +
            '<div class="xp-grid">' +
              '<div><h5>What I worked on</h5><ul class="xp-worked">' + worked + '</ul></div>' +
              '<div><h5>My contribution</h5><p class="xp-contrib">' + esc(x.contribution) + '</p>' +
                '<h5 style="margin-top:12px">Technologies</h5><div class="xp-tech">' + tech + '</div></div>' +
            '</div>' +
            '<div class="xp-result">' + esc(x.result) + '</div>' +
            '<p class="xp-take"><b>Takeaway —</b> ' + esc(x.takeaway) + '</p>' +
            (x.target ? '<a class="btn ghost" style="font-size:.82rem;padding:8px 16px" href="#' + esc(x.target) + '">Explore ' + esc(x.project) + ' →</a>' : '') +
          '</div>' +
        '</div>';
    }).join('');
    host.innerHTML = html;
  })();

  /* ===== Secondary "More Data & AI Projects" ===== */
  (function () {
    var host = $('#more-grid'); if (!host || !PROFILE.pipelines) return;
    var pl = PROFILE.pipelines;
    var more = [
      { id: 'forex', title: 'Forex Trading Platform', sub: 'Big Data · Forecasting · Reinforcement Learning', desc: 'Streaming market data through Kafka and Spark into forecasting models (LSTM, RNN, Random Forest) and reinforcement-learning trading agents (buy / hold / sell) under risk constraints.', tech: ['Python', 'Kafka', 'Spark', 'TensorFlow', 'scikit-learn', 'MongoDB / Cassandra', 'Streamlit'] },
      { id: 'swim', title: 'SwimCoach Vision', sub: 'Computer Vision · Sensor Fusion · Digital Twin', desc: 'Overhead cameras and wearable sensors fused into movement analysis and automated technical feedback (stroke symmetry, head position, entry angle), visualized as a digital twin.', tech: ['Python', 'OpenCV', 'Pose Estimation', 'Sensor Fusion', 'Digital Twins'] },
      { id: 'ecommerce', title: 'Real-Time E-commerce Pipeline', sub: 'Streaming · Data Engineering', desc: 'Customer events streamed through Kafka and Spark Streaming into PostgreSQL, surfacing sessions, baskets, conversions and marketing / pricing / inventory KPIs in Superset.', tech: ['Kafka', 'Spark Streaming', 'PostgreSQL', 'Superset', 'Docker'] },
      { id: 'cvjob', title: 'NLP CV–Job Matching', sub: 'NLP · Semantic Matching', desc: 'Matches CVs to job offers by meaning: skill extraction, hybrid TF-IDF + SBERT scoring, cosine-similarity ranking and an explainable match score (~95% matching precision).', tech: ['Python', 'NLP', 'SBERT', 'TF-IDF', 'Embeddings', 'Streamlit'] },
      { id: 'flightdelay', title: 'Flight Delay Analytics', sub: 'Data · BI', desc: '500,000+ flight records through Talend ETL and data-quality checks into MySQL, then an analytical model and BI dashboards for delay KPIs and bottleneck analysis.', tech: ['Talend', 'MySQL', 'Looker Studio', 'ETL', 'Data Quality', 'BI'] }
    ];
    more.forEach(function (m) {
      var card = document.createElement('div'); card.className = 'more-card';
      card.innerHTML = '<h3>' + esc(m.title) + '</h3><div class="mc-sub">' + esc(m.sub) + '</div>' +
        '<p style="color:var(--muted);font-size:.9rem;margin:0 0 14px">' + esc(m.desc) + '</p>' +
        '<div class="mc-pipe"></div>' +
        '<div class="mc-tech">' + m.tech.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>';
      host.appendChild(card);
      if (pl[m.id]) buildPipeline(card.querySelector('.mc-pipe'), pl[m.id]);
    });
  })();

  /* ============================================================
     Ahmed AI — profile-grounded assistant
     Single source: window.AHMED_PROFILE (sections + faqs + chipGroups)
     Client-side intent-aware retrieval  ->  Llama 3.2 (/api/chat) OR curated KB
     Balanced across Ahmed's WHOLE profile — never SecureDocAI-only.
     ============================================================ */
  (function () {
    var P = window.AHMED_PROFILE || { sections: [], faqs: [], chipGroups: {} };
    var SECTIONS = P.sections, FAQS = P.faqs;

    var STOP = { the:1,a:1,an:1,of:1,to:1,and:1,is:1,are:1,in:1,on:1,for:1,with:1,what:1,how:1,why:1,do:1,does:1,did:1,his:1,he:1,she:1,they:1,ahmed:1,you:1,your:1,me:1,about:1,tell:1,can:1,has:1,have:1,i:1,at:1,it:1,that:1,this:1,any:1,some:1,more:1 };
    function tokens(s) { return (String(s).toLowerCase().match(/[a-z0-9]+/g) || []).filter(function (t) { return t.length > 1 && !STOP[t]; }); }

    var BROAD = /\b(who is ahmed|about ahmed|about yourself|overview|60[ -]?second|tell me about ahmed|introduce|profile in|summary of|makes ahmed different|who's ahmed)\b/i;
    var FOLLOWUP = /\b(first one|second one|third|last one|the first|the second|that one|this one|more about|tell me more|and the|what about|those|these|it\b|its\b)\b/i;

    // conversation memory
    var convo = [];            // {role, text}
    var lastList = [];         // ordered section ids referenced by last answer
    var lastTopicKw = '';      // keywords of last main topic (for pronoun follow-ups)

    function scoreSection(qt, s) {
      var kws = s.kw.split(' '), sc = 0;
      qt.forEach(function (t) {
        kws.forEach(function (k) { if (k === t) sc += 3; else if (k.indexOf(t) === 0 || t.indexOf(k) === 0) sc += 1; });
        if (s.text.toLowerCase().indexOf(t) !== -1) sc += 1;
      });
      return sc;
    }
    function retrieve(query) {
      var q = query;
      // follow-up: keep prior topic in scope so pronouns resolve
      if (FOLLOWUP.test(query) && (lastTopicKw || lastList.length)) q = query + ' ' + lastTopicKw;
      var qt = tokens(q);
      var scored = SECTIONS.map(function (s) { return { s: s, sc: scoreSection(qt, s) }; }).sort(function (a, b) { return b.sc - a.sc; });

      if (BROAD.test(query)) {
        // balanced overview — one from each key group, NOT SecureDocAI-heavy
        var pick = ['identity', 'summary', 'education', 'exp-listic', 'exp-um6p', 'exp-aquadviser', 'exp-ocp', 'research-interests', 'pub-cityecoscout'];
        var top = pick.map(function (id) { return SECTIONS.filter(function (x) { return x.id === id; })[0]; }).filter(Boolean);
        return { top: top, context: top.map(function (x) { return '[' + x.id + '] ' + x.text; }).join('\n\n') };
      }
      var top = scored.filter(function (x) { return x.sc > 0; }).slice(0, 4).map(function (x) { return x.s; });
      if (top.length) lastTopicKw = top[0].kw.split(' ').slice(0, 6).join(' ');
      return { top: top, context: top.map(function (x) { return '[' + x.id + '] ' + x.text; }).join('\n\n') };
    }
    function bestFaq(query) {
      var q = query;
      if (FOLLOWUP.test(query) && lastTopicKw) q = query + ' ' + lastTopicKw;
      var qt = tokens(q), best = null, bestSc = 0;
      FAQS.forEach(function (f) {
        var fk = f.keys.split(' '), sc = 0;
        qt.forEach(function (t) { fk.forEach(function (k) { if (k === t) sc += 3; else if (k.indexOf(t) === 0) sc += 1; }); });
        if (sc > bestSc) { bestSc = sc; best = f; }
      });
      return { f: best, sc: bestSc };
    }
    function setFollowState(query, faq, top) {
      // remember an ordered list when the answer is list-like, for "the first one"
      if (faq && faq.id === 'publications') lastList = ['pub-cityecoscout', 'manuscript-securedocai'];
      else if (faq && faq.id === 'strongest') lastList = ['proj-securedocai', 'proj-neurologiquetwin', 'proj-graphrag', 'proj-multiagent', 'proj-gear5'];
      if (top && top.length) lastTopicKw = top[0].kw.split(' ').slice(0, 6).join(' ');
    }
    function answerKB(query) {
      // resolve "the first/second one" against the last list
      if (FOLLOWUP.test(query) && lastList.length) {
        var idx = /second|two|2nd/i.test(query) ? 1 : 0;
        var refId = lastList[idx];
        var sec = SECTIONS.filter(function (x) { return x.id === refId; })[0];
        var fq = null;
        if (refId === 'pub-cityecoscout') fq = FAQS.filter(function (f){return f.id==='cityecoscout';})[0];
        if (fq) return fq.a;
        if (sec) return sec.text;
      }
      var faq = bestFaq(query), r = retrieve(query);
      if (faq.f && faq.sc >= 3) { setFollowState(query, faq.f, r.top); return faq.f.a; }
      if (r.top.length && scoreSection(tokens(query), r.top[0]) >= 3) { setFollowState(query, null, r.top); return r.top[0].text; }
      if (faq.f && faq.sc >= 2) { setFollowState(query, faq.f, r.top); return faq.f.a; }
      if (r.top.length && r.top[0]) { setFollowState(query, null, r.top); return r.top[0].text; }
      return "I don't have verified information about that in Ahmed's portfolio. Try asking about his research and publications, his projects (SecureDocAI, NeurologiqueTWIN, Graph-RAG…), his skills, his experience, or why he could fit an AI role at Thales.";
    }

    // ---- Mode probe ----
    var mode = 'knowledge-base', model = 'llama3.2';
    var statusEl = $('#ai-status'), statusText = $('#ai-status-text'), pipeModel = $('#pipe-model');
    function setStatus() {
      if (mode === 'ollama') { statusEl.className = 'status live'; statusText.textContent = 'Llama 3.2 · Local'; if (pipeModel) pipeModel.textContent = 'Llama 3.2 · local'; }
      else { statusEl.className = 'status kb'; statusText.textContent = 'Profile-grounded · Web'; if (pipeModel) pipeModel.textContent = 'Profile knowledge base'; }
    }
    (function probe() {
      var ctrl = new AbortController(); var to = setTimeout(function () { ctrl.abort(); }, 2500);
      fetch('/api/chat', { method: 'GET', signal: ctrl.signal }).then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { clearTimeout(to); if (d && d.available) { mode = 'ollama'; model = d.model || model; } else { mode = 'knowledge-base'; } setStatus(); })
        .catch(function () { clearTimeout(to); mode = 'knowledge-base'; setStatus(); });
    })();

    // ---- UI ----
    var log = $('#chat-log'), chipsBox = $('#chat-chips'), textEl = $('#chat-text'), sendBtn = $('#chat-send');
    function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function fmt(s) { return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>'); }
    function addUser(t) { var d = document.createElement('div'); d.className = 'msg user'; d.textContent = t; log.appendChild(d); log.scrollTop = log.scrollHeight; }
    function addBot() { var d = document.createElement('div'); d.className = 'msg bot'; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
    function typingBubble() { var d = addBot(); d.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>'; return d; }
    function typeInto(el, text, srcLabel) {
      var html = fmt(text);
      if (reduced) { el.innerHTML = html + (srcLabel ? '<span class="src">' + srcLabel + '</span>' : ''); log.scrollTop = log.scrollHeight; return; }
      var plain = text, i = 0; el.textContent = '';
      var iv = setInterval(function () {
        i += 4; el.textContent = plain.slice(0, i); log.scrollTop = log.scrollHeight;
        if (i >= plain.length) { clearInterval(iv); el.innerHTML = html + (srcLabel ? '<span class="src">' + srcLabel + '</span>' : ''); log.scrollTop = log.scrollHeight; }
      }, 10);
    }

    var busy = false;
    function ask(q) {
      if (busy || !q.trim()) return; busy = true; sendBtn.disabled = true;
      addUser(q); convo.push({ role: 'user', text: q });
      runPipeline();
      var r = retrieve(q);
      var bubble = typingBubble();
      var minDelay = new Promise(function (res) { setTimeout(res, 420); });
      if (mode === 'ollama') {
        var ctrl = new AbortController(); var to = setTimeout(function () { ctrl.abort(); }, 30000);
        var history = convo.slice(-7, -1).map(function (m) { return { role: m.role === 'user' ? 'user' : 'assistant', content: m.text }; });
        Promise.all([
          fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q, context: r.context, history: history }), signal: ctrl.signal })
            .then(function (res) { return res.ok ? res.json() : null; }).catch(function () { return null; }),
          minDelay
        ]).then(function (arr) {
          clearTimeout(to); var d = arr[0];
          if (d && d.available && d.answer) { typeInto(bubble, d.answer, 'source: <b>Llama 3.2</b> · profile-grounded'); convo.push({ role: 'assistant', text: d.answer }); setFollowState(q, bestFaq(q).f, r.top); }
          else { mode = 'knowledge-base'; setStatus(); var a = answerKB(q); typeInto(bubble, a, 'source: <b>profile knowledge base</b>'); convo.push({ role: 'assistant', text: a }); }
          finish();
        });
      } else {
        minDelay.then(function () { var a = answerKB(q); typeInto(bubble, a, 'source: <b>profile knowledge base</b>'); convo.push({ role: 'assistant', text: a }); finish(); });
      }
    }
    function finish() { busy = false; sendBtn.disabled = false; }

    // ---- categorized, rotating suggested questions ----
    var groups = P.chipGroups || {}; var groupNames = Object.keys(groups); var activeCat = groupNames[0];
    function renderChips() {
      chipsBox.innerHTML = '';
      var cats = document.createElement('div'); cats.className = 'chip-cats';
      groupNames.forEach(function (g) {
        var b = document.createElement('button'); b.className = 'chip-cat' + (g === activeCat ? ' active' : ''); b.textContent = g;
        b.addEventListener('click', function () { activeCat = g; renderChips(); }); cats.appendChild(b);
      });
      chipsBox.appendChild(cats);
      var row = document.createElement('div'); row.className = 'chip-qs';
      (groups[activeCat] || []).forEach(function (c) {
        var b = document.createElement('button'); b.className = 'qchip'; b.textContent = c;
        b.addEventListener('click', function () { ask(c); }); row.appendChild(b);
      });
      chipsBox.appendChild(row);
    }
    renderChips();

    sendBtn.addEventListener('click', function () { var v = textEl.value; textEl.value = ''; ask(v); });
    textEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); var v = textEl.value; textEl.value = ''; ask(v); } });
    textEl.addEventListener('input', function () { textEl.style.height = '42px'; textEl.style.height = Math.min(textEl.scrollHeight, 110) + 'px'; });

    $('#chat-clear').addEventListener('click', function () { log.innerHTML = ''; convo = []; lastList = []; lastTopicKw = ''; greet(); });
    function greet() { var d = addBot(); d.innerHTML = fmt("Hi — I'm **Ahmed AI**, grounded in Ahmed's **complete profile**: research & publications, projects, skills, experience and engineering approach. Ask me anything — pick a category below or type your own question."); }
    greet();

    // How it works + pipeline toggle
    var pipeCard = $('#pipeline-card'), pipeOn = false;
    $('#toggle-pipeline').addEventListener('click', function () { pipeOn = !pipeOn; pipeCard.style.display = pipeOn ? '' : 'none'; this.textContent = pipeOn ? 'Hide AI pipeline' : 'Show AI pipeline'; });
    $('#how-it-works').addEventListener('click', function () {
      pipeOn = true; pipeCard.style.display = ''; $('#toggle-pipeline').textContent = 'Hide AI pipeline';
      pipeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      var d = addBot();
      d.innerHTML = fmt('**How it works — profile-grounded AI:** Question → intent analysis → retrieve the relevant parts of Ahmed\'s structured profile → build a grounded prompt → ' + (mode === 'ollama' ? '**Llama 3.2**' : 'curated profile answer') + ' → answer. Retrieval runs in your browser over a single verified profile; generation is ' + (mode === 'ollama' ? 'Llama 3.2 via a same-origin /api/chat route (no fine-tuning — the profile can be updated without retraining)' : 'a curated profile response') + '. It never invents experience, metrics, publications or confidential information.');
      runPipeline();
    });
    function runPipeline() {
      if (!pipeOn || reduced) return;
      var steps = $$('.pipe-step'); steps.forEach(function (s) { s.classList.remove('lit'); });
      var i = 0; (function n() { if (i < steps.length) { steps[i].classList.add('lit'); i++; setTimeout(n, 260); } })();
    }

    // Ask Me talking points (presenter oral points)
    var talking = {
      'Tell me about yourself': ['AI & Data Engineer, research + engineering.', 'Data → models → retrieval → agents → security → deployment.', 'OCP → AQUADVISER → UM6P → LISTIC; published + manuscript in prep.', 'Drawn to trustworthy, real-world AI.'],
      'Why Thales?': ['AI where performance alone is not enough — reliability, security, traceability.', 'My work (secure RAG, KGs, agents, evaluation) maps to industrial AI.', 'Want to explore critical systems, robustness, explainability.', 'No claim on the confidential project — eager to learn it.'],
      'Why you?': ['End-to-end perspective, not just frameworks.', 'Research + engineering (a publication + a manuscript).', 'Direct trustworthy-AI experience (SecureDocAI).', 'Fast learner across domains; I explain systems clearly.'],
      'My research & publications': ['Published: CityEcoScout (IJCEDS 2025), co-author.', 'In preparation: SecureDocAI manuscript (LISTIC).', 'Progression: knowledge rep → multimodal → trustworthy GenAI.', 'Interests: secure RAG, KGs, multimodal, evaluation.'],
      'Explain SecureDocAI': ['Problem: LLMs over sensitive docs without over-sharing.', 'Layer 1 document intelligence, Layer 2 secure governance.', '6,000 scenarios: 97.8% RBAC, leakage 15.39%→0.21%.', 'Flagship — but one part of a broader profile.'],
      'What I did outside LLMs': ['Multimodal deep learning (EEG/IMU, UM6P).', 'Computer vision (Swim Coach Vision).', 'Big Data & streaming (Kafka, Spark, Forex, e-commerce).', 'ML + BI (flight-delay prediction), industrial analytics (OCP).'],
      'How do you evaluate an LLM application?': ['Define measurable objectives + failure cases first.', 'Scenario suites (e.g. 6,000 for SecureDocAI).', 'Track utility AND safety (RBAC, leakage, PII F1).', 'Reproducible experiments, not a single demo.'],
      'How do you reduce hallucinations?': ['Ground in retrieval over authorized content.', 'Minimize context; validate outputs.', 'Constrain the task; explicit steps.', 'Measure on adversarial scenarios.'],
      'Research or engineering?': ['Both — I define experiments and ship systems.', 'A publication + a manuscript, and working APIs/Docker.', 'Thales sits at that intersection.', 'That mix is what I want to keep doing.'],
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
     THALES interview presentation deck (dedicated full-screen slides)
     Independent of the AI assistant / Ollama — never fails if offline.
     Reuses AHMED_PROFILE data (pipelines, metrics). Opened by openDeck().
     ============================================================ */
  (function () {
    var deck = $('#deck'); if (!deck) return;
    var P = PROFILE, sd = P.secureDoc || {}, pl = P.pipelines || {};

    function chips(arr, cls) { return '<div class="d-chips">' + arr.map(function (c) { return '<span class="' + (cls || '') + '">' + esc(c) + '</span>'; }).join('') + '</div>'; }

    // ---- slide content ----
    var timeline =
      '<div class="d-timeline">' +
      '<div class="d-tl"><div class="d-when">Jul 2024 → Aug 2024</div><div class="d-org">OCP</div><div class="d-tags">Data Analytics<br>SQL · Reporting</div></div>' +
      '<span class="d-tl-arrow">→</span>' +
      '<div class="d-tl"><div class="d-when">May 2025 → Jul 2025</div><div class="d-org">AQUADVISER</div><div class="d-tags">Graph-RAG<br>Knowledge Graphs · LLMs</div></div>' +
      '<span class="d-tl-arrow">→</span>' +
      '<div class="d-tl"><div class="d-when">Jul 2025 → Oct 2025</div><div class="d-org">UM6P</div><div class="d-tags">Multimodal AI<br>EEG / IMU · Deep Learning</div></div>' +
      '<span class="d-tl-arrow">→</span>' +
      '<div class="d-tl now"><div class="d-when">Feb 2026 → Jul 2026</div><div class="d-org">LISTIC</div><div class="d-tags">Secure Document AI<br>RAG · Agents · Security</div></div>' +
      '<span class="d-tl-arrow">→</span>' +
      '<div class="d-tl now"><div class="d-when">2026 → 2027</div><div class="d-org">EFREI Paris</div><div class="d-tags">Data &amp; Generative<br>AI Engineering</div></div>' +
      '</div>' +
      '<div class="d-evolution"><span>Data</span><i>→</i><span>Machine Learning</span><i>→</i><span>Knowledge Systems</span><i>→</i><span>Generative AI</span><i>→</i><span>Trustworthy AI</span></div>';

    var metricsHtml = (sd.metrics || []).map(function (m) { return '<div class="d-stat"><div class="v ' + (m.c || '') + '">' + esc(m.v) + '</div><div class="k">' + esc(m.k) + '</div></div>'; }).join('');
    var smallHtml = (sd.small || []).map(function (m) { return '<div><b>' + esc(m.v) + '</b> · ' + esc(m.k) + '</div>'; }).join('');

    var slidesHtml = [
      // 0 — Intro
      '<p class="s-kicker">THALES AI Interview · September 2026</p>' +
      '<h1 class="s-title">Ahmed Moubarak <span class="amb">Lahlyal</span></h1>' +
      '<p class="s-sub">AI Engineer</p>' +
      chips(['Trustworthy AI', 'Generative AI', 'Data Engineering'], 'hl') +
      '<p class="s-lead">Building AI systems from data to deployment — with security, traceability and measurable performance in mind.</p>' +
      '<p class="s-note"><b>Engineering Graduate · 2026</b> — Advanced Master® Data &amp; Generative AI Engineering · EFREI Paris</p>',

      // 1 — Who I Am
      '<p class="s-kicker">Who I Am</p>' +
      '<div class="d-grid3">' +
        '<div class="d-card"><div class="d-idx">01</div><h3>AI Engineering</h3><p>Machine Learning, Deep Learning, LLMs and intelligent systems.</p></div>' +
        '<div class="d-card"><div class="d-idx">02</div><h3>Data Foundations</h3><p>SQL, Data Engineering, Big Data, Knowledge Graphs and APIs.</p></div>' +
        '<div class="d-card"><div class="d-idx">03</div><h3>Trustworthy Systems</h3><p>Security, controlled retrieval, evaluation and traceability.</p></div>' +
      '</div>' +
      '<p class="d-center-quote">I see AI engineering as a <b>complete system problem</b>: data, models, software, security, evaluation and deployment.</p>',

      // 2 — Journey
      '<p class="s-kicker">My Journey in AI &amp; Data</p>' + timeline,

      // 3 — Landscape
      '<p class="s-kicker">AI Systems I Have Worked On</p>' +
      '<div class="d-emph" style="margin-bottom:16px;text-align:left"><h3 style="margin:0 0 4px;font-size:clamp(1.1rem,2vw,1.5rem)">SecureDocAI <span style="color:var(--amber);font-size:.8em">◆ today\'s focus</span></h3><p style="color:var(--muted);margin:0">Trustworthy Generative AI · secure LLM access over sensitive documents.</p></div>' +
      '<div class="d-grid3">' +
        '<div class="d-card"><h3>NeurologiqueTWIN</h3><p>Multimodal Deep Learning · EEG / IMU · CNN + Attention.</p></div>' +
        '<div class="d-card"><h3>Graph-RAG</h3><p>Knowledge Graphs + LLMs · Neo4j · hybrid retrieval.</p></div>' +
        '<div class="d-card"><h3>Multi-Agent Data Assistant</h3><p>Agentic AI + SQL · LangGraph · CrewAI.</p></div>' +
      '</div>' +
      '<p class="s-note" style="margin-top:12px"><span style="font-family:var(--mono);color:var(--faint)">＋ GEAR5 — Green AI &amp; LLM efficiency</span> · Today I will focus on <b style="color:var(--cyan)">SecureDocAI</b>.</p>',

      // 4 — Problem
      '<p class="s-kicker">SecureDocAI · The Problem</p>' +
      '<p class="s-lead">How can organizations use LLMs over sensitive documents without exposing information users are not authorized to access?</p>' +
      '<div class="d-flow"><span>Sensitive Documents</span><i>→</i><span>Traditional RAG</span><i>→</i><span>LLM</span><i>→</i><span class="warn">Potential Leakage</span></div>' +
      chips(['Sensitive Data', 'Unauthorized Access', 'Prompt Injection', 'Role Escalation', 'Hallucination', 'Missing Traceability'], 'risk') +
      '<p class="s-note">Traditional RAG focuses on <b>relevance</b>. For sensitive environments, relevance is not enough.</p>',

      // 5 — Solution (two layers)
      '<p class="s-kicker">SecureDocAI · Two-Layer Architecture</p>' +
      '<div class="d-chips" style="margin-bottom:8px"><span class="hl deck-arch-tab" data-al="doc" style="cursor:pointer">Layer 1 · Document Intelligence</span><span class="deck-arch-tab" data-al="sec" style="cursor:pointer">Layer 2 · Secure AI Governance</span></div>' +
      '<div id="deck-arch-doc"></div>' +
      '<div id="deck-arch-sec" hidden></div>' +
      '<p class="s-note" id="deck-arch-note">Documents become structured, protected knowledge — indexed for both vector search and a knowledge graph.</p>',

      // 6 — Security pipeline (deep)
      '<p class="s-kicker">From User Query to Controlled Answer</p>' +
      '<h2 class="s-title" style="font-size:clamp(1.4rem,3vw,2.2rem);margin-bottom:14px">The <em>security</em> pipeline</h2>' +
      '<div id="deck-sec-pipe"></div>' +
      '<p class="s-note">Every request is governed. <b>Click a node with&nbsp;ⓘ</b> to see what it does — role authentication, injection detection, authorized retrieval, output firewall.</p>',

      // 7 — What I built
      '<p class="s-kicker">My Contribution</p>' +
      '<div class="d-grid3">' +
        '<div class="d-card"><h3>Architecture</h3><p>Designed major components of the two-layer architecture.</p></div>' +
        '<div class="d-card"><h3>Document Intelligence</h3><p>Built document processing, extraction and sensitive-data pipelines.</p></div>' +
        '<div class="d-card"><h3>Knowledge Systems</h3><p>Integrated RAG, Graph-RAG, Neo4j and ChromaDB.</p></div>' +
        '<div class="d-card"><h3>AI Security</h3><p>Implemented RBAC, prompt-injection filtering and controlled retrieval.</p></div>' +
        '<div class="d-card"><h3>AI Orchestration</h3><p>Integrated LLM workflows and agents with LangGraph and CrewAI.</p></div>' +
        '<div class="d-card"><h3>Evaluation</h3><p>Ran controlled experiments across normal, sensitive and adversarial scenarios.</p></div>' +
      '</div>' +
      '<p class="s-note"><b>I designed and implemented major parts of the system as part of the LISTIC research team.</b></p>' +
      chips(['Python', 'FastAPI', 'LangGraph', 'CrewAI', 'Neo4j', 'ChromaDB', 'Presidio', 'SBERT', 'XGBoost', 'Docker']),

      // 8 — Results
      '<p class="s-kicker">Experimental Evaluation</p>' +
      '<div class="d-metrics">' + metricsHtml + '</div>' +
      '<div class="d-transform"><div><div class="k" style="font-family:var(--mono);font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.1em">Unauthorized leakage</div><span class="from">' + esc(sd.leakageFrom || '') + '</span> <span class="arw">→</span> <span class="to">' + esc(sd.leakageTo || '') + '</span></div><div class="red"><div class="big">' + esc(sd.leakageReduction || '') + '</div><div class="lbl">relative reduction</div></div></div>' +
      '<div class="d-small-metrics">' + smallHtml + '</div>' +
      '<p class="s-note"><b>Security without utility is not enough.</b> The objective was to reduce unauthorized disclosure while preserving useful answers for authorized users.</p>',

      // 9 — Lessons
      '<p class="s-kicker">What This Project Taught Me</p>' +
      '<div class="d-list">' +
        '<div class="d-li"><span class="n">1</span><p>AI performance alone is not enough.</p></div>' +
        '<div class="d-li"><span class="n">2</span><p>Security must be designed into the architecture.</p></div>' +
        '<div class="d-li"><span class="n">3</span><p>Retrieval is a security boundary.</p></div>' +
        '<div class="d-li"><span class="n">4</span><p>Critical AI requires traceability and evaluation.</p></div>' +
        '<div class="d-li"><span class="n">5</span><p>Add complexity only when it provides measurable value.</p></div>' +
      '</div>' +
      '<div class="d-emph"><p class="d-center-quote" style="border:0;padding:0;margin:0">For trustworthy AI, the question is not only <b>“Can the model answer?”</b> — it is also <b>“Should it answer, using which information, and can we verify why?”</b></p></div>',

      // 10 — Why Thales
      '<p class="s-kicker">Why This Matters to Me</p>' +
      '<div class="d-venn">' +
        '<div class="col l"><h4>What I have been building</h4><div class="taglist">' + ['Trustworthy AI', 'Secure RAG', 'Knowledge Graphs', 'Agentic AI', 'Multimodal AI', 'Data Engineering', 'Evaluation', 'Traceability'].map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('') + '</div></div>' +
        '<div class="col c"><div class="node">THALES</div></div>' +
        '<div class="col r"><h4>What I want to explore</h4><div class="taglist">' + ['AI for Critical Systems', 'Reliability', 'Robustness', 'Explainability', 'Cybersecurity', 'Industrial Validation', 'Human-AI Collaboration'].map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('') + '</div></div>' +
      '</div>' +
      '<p class="d-center-quote" style="margin-top:18px">What attracts me to Thales is the opportunity to work on AI where <b>performance alone is not enough</b>.</p>' +
      chips(['Reliability', 'Security', 'Traceability', 'Human Control'], 'hl') +
      '<p class="s-note">Thank you. Questions? &nbsp;·&nbsp; <span style="color:var(--faint)">I\'d also like to ask: what are the project\'s main technical challenges? · how do you validate AI when reliability &amp; security are critical? · what would an apprentice accomplish in the first 3–6 months?</span></p>' +
      '<button class="btn ghost" id="deck-demo-open" style="margin-top:14px">Open Live Demo — Ahmed AI →</button>',

      // 11 — Optional live demo (reached only via button)
      '<p class="s-kicker">Ahmed AI · Live Demo <span style="color:var(--faint)">(optional)</span></p>' +
      '<h2 class="s-title" style="font-size:clamp(1.4rem,3vw,2.2rem);margin-bottom:14px">A profile-grounded assistant</h2>' +
      '<div id="deck-ai-pipe"></div>' +
      '<p class="s-note">Suggested questions: <b>“Who is Ahmed?”</b> · <b>“Explain SecureDocAI.”</b> · <b>“Why could Ahmed fit a trustworthy-AI project?”</b><br>Runs on Llama 3.2 locally, or a grounded knowledge base on the web — it never fails if the model is offline.</p>' +
      '<div style="display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap"><button class="btn primary" id="deck-ai-launch">Open Ahmed AI</button><button class="btn ghost" id="deck-demo-back">← Back to presentation</button></div>'
    ];

    var notes = [
      'Introduce myself in ~45 seconds. Confidence, not a full CV.',
      'Three pillars. Land on the "complete system problem" line.',
      'Explain progression: Data → Graph-RAG → Multimodal AI → Trustworthy Generative AI.',
      'Name the four systems, then pivot: today I focus on SecureDocAI.',
      'Spend time on the PROBLEM before any tool. Relevance ≠ safety.',
      'Walk Layer 1, then click Layer 2. Keep it high-level here.',
      'Zoom into security. Click 2–3 nodes to explain them live.',
      'My contribution — concrete, honest ("major parts, as part of the team").',
      'Focus on the security / utility trade-off. Numbers speak.',
      'The two questions on the quote are the heart of trustworthy AI.',
      'Bridge to Thales. Then invite questions. Demo only if time allows.',
      'Optional: run 1–2 questions. Do not force it if time is short.'
    ];

    var MAIN = 11; // slides 0..10 are the sequence; 11 is the optional demo

    // ---- build shell ----
    var stage = document.createElement('div'); stage.className = 'deck-stage'; stage.id = 'deck-stage';
    var slideEls = slidesHtml.map(function (html, i) {
      var s = document.createElement('div'); s.className = 'slide'; s.setAttribute('role', 'group'); s.setAttribute('aria-label', 'Slide ' + (i + 1)); s.innerHTML = html; stage.appendChild(s); return s;
    });

    deck.innerHTML = '';
    var prog = document.createElement('div'); prog.className = 'deck-progress'; deck.appendChild(prog);

    var start = document.createElement('div'); start.className = 'deck-start'; start.id = 'deck-start';
    start.innerHTML = '<p class="ks">THALES AI Interview</p><h1>Ahmed Moubarak Lahlyal</h1><p class="role">AI Engineer · Trustworthy AI · Generative AI</p>' +
      '<button class="btn primary btn-lg" id="deck-start-btn">▶ Start Presentation</button>' +
      '<p class="hint">→ / Space next · ← previous · Esc exit · N notes</p>';
    deck.appendChild(start);
    deck.appendChild(stage);

    var notesEl = document.createElement('div'); notesEl.className = 'deck-notes'; notesEl.id = 'deck-notes';
    notesEl.innerHTML = '<div class="t">Presenter notes</div><p></p>'; deck.appendChild(notesEl);

    var ctrls = document.createElement('div'); ctrls.className = 'deck-controls';
    ctrls.innerHTML = '<button id="deck-prev">← Prev</button><span class="num" id="deck-num">01 / ' + ('0' + MAIN).slice(-2) + '</span><button id="deck-next">Next →</button>' +
      '<button id="deck-notes-btn">Notes</button><button id="deck-fs">⤢ Full screen</button><button class="exit" id="deck-exit">Esc · Exit</button>';
    deck.appendChild(ctrls);

    var current = 0, notesOn = false, built = {};

    function buildSlidePipelines(i) {
      if (built[i]) return; built[i] = true;
      if (i === 5) {
        if (pl['securedocai-doc']) buildPipeline($('#deck-arch-doc'), pl['securedocai-doc']);
        if (pl['securedocai-sec']) buildPipeline($('#deck-arch-sec'), pl['securedocai-sec']);
      }
      if (i === 6 && pl['securedocai-sec']) buildPipeline($('#deck-sec-pipe'), pl['securedocai-sec']);
      if (i === 11 && pl['ahmedai']) buildPipeline($('#deck-ai-pipe'), pl['ahmedai']);
    }

    function renderNotes() { notesEl.querySelector('p').textContent = notes[current] || ''; notesEl.classList.toggle('show', notesOn); }
    function updateUI() {
      slideEls.forEach(function (el, i) { el.classList.toggle('active', i === current); });
      var main = Math.min(current, MAIN - 1);
      if (current < MAIN) { prog.style.width = ((current + 1) / MAIN * 100) + '%'; $('#deck-num').textContent = ('0' + (current + 1)).slice(-2) + ' / ' + ('0' + MAIN).slice(-2); }
      else { prog.style.width = '100%'; $('#deck-num').textContent = 'Demo'; }
      buildSlidePipelines(current);
      renderNotes();
      stage.scrollTop = 0;
    }
    function go(i, arrow) {
      if (arrow && i >= MAIN) return;          // arrows never enter the optional demo
      if (i < 0) i = 0; if (i > slideEls.length - 1) i = slideEls.length - 1;
      if (arrow && i > MAIN - 1) i = MAIN - 1;
      current = i; updateUI();
    }

    function open(atStart) {
      deck.hidden = false; deck.classList.add('open'); document.body.classList.add('deck-open');
      start.style.display = 'flex'; // always show start screen first
      current = 0; updateUI();
    }
    function begin() { start.style.display = 'none'; current = 0; updateUI(); }
    function close() {
      deck.classList.remove('open'); document.body.classList.remove('deck-open'); deck.hidden = true;
      notesOn = false; renderNotes();
      if (document.fullscreenElement) { try { document.exitFullscreen(); } catch (e) {} }
      if (location.hash === '#presentation') { try { history.replaceState(null, '', location.pathname); } catch (e) {} }
    }
    openDeck = open; // expose to the nav/hero buttons

    // start screen
    $('#deck-start-btn').addEventListener('click', begin);
    // controls
    $('#deck-prev').addEventListener('click', function () { go(current - 1, true); });
    $('#deck-next').addEventListener('click', function () { go(current + 1, true); });
    $('#deck-exit').addEventListener('click', close);
    $('#deck-notes-btn').addEventListener('click', function () { notesOn = !notesOn; renderNotes(); });
    $('#deck-fs').addEventListener('click', function () {
      try { if (!document.fullscreenElement) deck.requestFullscreen(); else document.exitFullscreen(); } catch (e) {}
    });

    // slide 05 layer tabs
    stage.addEventListener('click', function (e) {
      var tab = e.target.closest('.deck-arch-tab'); if (tab) {
        $$('.deck-arch-tab').forEach(function (o) { o.classList.remove('hl'); }); tab.classList.add('hl');
        var doc = tab.dataset.al === 'doc';
        $('#deck-arch-doc').hidden = !doc; $('#deck-arch-sec').hidden = doc;
        $('#deck-arch-note').textContent = doc
          ? 'Documents become structured, protected knowledge — indexed for both vector search and a knowledge graph.'
          : 'Every request is governed: authenticated role, injection detection, authorized retrieval, context minimization, output firewall and final validation.';
      }
      if (e.target.id === 'deck-demo-open') { current = 11; updateUI(); }
      if (e.target.id === 'deck-demo-back') { go(10); }
      if (e.target.id === 'deck-ai-launch') { close(); var a = document.getElementById('assistant'); if (a) a.scrollIntoView({ behavior: 'smooth' }); }
    });

    // keyboard (only while deck is open)
    document.addEventListener('keydown', function (e) {
      if (deck.hidden || !deck.classList.contains('open')) return;
      if (start.style.display !== 'none') { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); begin(); } else if (e.key === 'Escape') { close(); } return; }
      switch (e.key) {
        case 'ArrowRight': case ' ': case 'PageDown': e.preventDefault(); go(current + 1, true); break;
        case 'ArrowLeft': case 'PageUp': e.preventDefault(); go(current - 1, true); break;
        case 'Home': e.preventDefault(); go(0); break;
        case 'End': e.preventDefault(); go(MAIN - 1); break;
        case 'Escape': e.preventDefault(); close(); break;
        case 'n': case 'N': notesOn = !notesOn; renderNotes(); break;
      }
    });

    // open directly via /presentation route or #presentation hash
    if (location.pathname.replace(/\/$/, '') === '/presentation' || location.hash === '#presentation') { open(); }
  })();

  /* ============================================================
     Presentation mode
     ============================================================ */
  (function () {
    var STEPS = [
      { id: 'intro', label: 'Intro' }, { id: 'profile', label: 'Who I Am' }, { id: 'journey', label: 'My Journey' },
      { id: 'experience', label: 'Experience' }, { id: 'research', label: 'Research & Publications' }, { id: 'securedocai', label: 'SecureDocAI' },
      { id: 'projects', label: 'Selected AI Systems' }, { id: 'stack', label: 'Technical Foundations' }, { id: 'mindset', label: 'Engineering Mindset' },
      { id: 'thales', label: 'Why Thales' }, { id: 'assistant', label: 'Ahmed AI' }, { id: 'contact', label: "Let's Talk" }
    ];
    var HINTS = {
      intro: ['Open with the one-line: data → deployment, with security in mind.', 'Point at the chips: LLMs, RAG/Graph-RAG, KGs, Agentic, Secure AI.', 'Note: graduating 2026, EFREI Advanced Master, 2w/1w apprenticeship.'],
      profile: ['“Tell me about yourself” lands here.', 'Three pillars: AI Engineering, Data Foundations, Trustworthy Systems.', 'I understand complete systems, not just frameworks.'],
      journey: ['Not many unrelated internships — a progression.', 'Each role added a layer: Data → ML → Knowledge → GenAI → Trustworthy.', 'OCP → AQUADVISER → UM6P → LISTIC.'],
      experience: ['Four experiences with exact dates.', 'For each: role, project, my contribution, stack, result.', 'LISTIC (Feb–Jul 2026) is the current, flagship one.', 'Each card links to the full project.'],
      research: ['I have a real research profile, not only projects.', 'PUBLISHED: CityEcoScout (co-author, IJCEDS 2025).', 'IN PREPARATION: SecureDocAI manuscript (LISTIC, with Loukil & Verjus).', 'Progression: knowledge rep → multimodal → trustworthy GenAI.'],
      securedocai: ['Lead with the PROBLEM, not the tech.', 'Walk Layer 1 (document) then Layer 2 (security) — click the tabs.', 'Headline: 97.8% RBAC, leakage 15.39%→0.21%, 95% utility kept.', 'This is my flagship — but one part of a broader profile.'],
      projects: ['Click each tab; the visual animates live.', 'For each: Problem → Built → My contribution → Approach → Results → Takeaway.', 'Show breadth: multimodal, KGs, agents, Green AI, NLP, Big Data.'],
      stack: ['Organized by architecture layer, not a logo wall.', 'AI/ML · GenAI · Document AI · Data Eng · Databases · MLOps · BI.', 'Point: tools are not the goal — architecture and value are.'],
      mindset: ['This is the part that matters for critical systems.', 'Ten principles; land on “security by design” and “measure before claiming”.', 'Quote: use AI only where it brings measurable value.'],
      thales: ['Honest overlap, not flattery.', 'Left = what I built, Right = what I want to explore.', 'Ask them: “what problem would you want me on first?”', 'Then Why-me: five evidence-based points.'],
      assistant: ['Turn the tool on myself: an AI candidate arrives with an assistant.', 'Toggle “Show AI pipeline” to explain retrieval → Llama → grounded.', 'It answers from my WHOLE profile — never invents.', 'Locally it runs Llama 3.2; on the web, profile-grounded mode.'],
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
    // The nav / hero "Interview Presentation" buttons open the dedicated deck.
    $('#present-toggle').addEventListener('click', function () { if (openDeck) openDeck(); else enter(); });
    $('#hero-present').addEventListener('click', function () { if (openDeck) openDeck(); else enter(); });
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
