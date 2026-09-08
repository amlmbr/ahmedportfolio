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

  /* ===== Mobile burger menu ===== */
  (function () {
    var burger = $('#nav-burger'), nav = burger && burger.closest('nav'); if (!burger || !nav) return;
    function close() { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    burger.addEventListener('click', function (e) { e.stopPropagation(); var open = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', open ? 'true' : 'false'); });
    $$('#nav-links a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('click', function (e) { if (nav.classList.contains('open') && !nav.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  })();

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

    // Simple / Technical depth toggle
    var depth = $('#sdai-depth');
    if (depth) depth.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-depth]'); if (!b) return;
      $$('button', depth).forEach(function (o) { o.classList.remove('active'); }); b.classList.add('active');
      var tech = b.dataset.depth === 'technical';
      $('#sdai-simple').hidden = tech; $('#sdai-technical').hidden = !tech;
    });
  })();

  /* ===== Projects showcase ===== */
  (function () {
    var projects = {
      'v-eeg': {
        type: 'Deep Learning · Multimodal Time Series (+ Digital Twin)', title: 'NeurologiqueTWIN', org: 'UM6P — 2025',
        rows: [
          ['Problem', 'Classify heterogeneous physiological time-series (EEG + IMU) with deep learning for neurological monitoring.'],
          ['Core internship work', 'A multimodal deep-learning classification pipeline: EEG/IMU preprocessing, temporal synchronization, segmentation/windowing and a CNN + attention classifier.'],
          ['My extension', 'A Digital-Twin layer to monitor, visualize and interact with the classification outputs over time.'],
          ['Technical approach', '<span class="stack-line">Python · PyTorch · TensorFlow · CNN · Attention · EEG / IMU · Streamlit</span>']
        ],
        core: 'Python · PyTorch · TensorFlow · CNN · Attention · EEG / IMU · Streamlit',
        kpi: ['≈92%', 'internal classification accuracy'],
        results: '≈92% internal classification accuracy; 6–10 pp pre-crisis recall improvement.',
        lesson: 'In multimodal AI, signal quality and temporal synchronization can matter as much as model complexity.'
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
      var rowsHtml;
      if (p.rows) {   // custom rows (a = trusted authored HTML); Results appended
        rowsHtml = p.rows.map(function (r) { return '<div class="qa-row"><span class="q">' + esc(r[0]) + '</span><span class="a">' + r[1] + '</span></div>'; }).join('') +
          '<div class="qa-row"><span class="q">Results</span><span class="a">' + esc(p.results) + '</span></div>';
      } else {
        rowsHtml =
          '<div class="qa-row"><span class="q">Problem</span><span class="a">' + esc(p.problem) + '</span></div>' +
          '<div class="qa-row"><span class="q">What I built</span><span class="a">' + esc(p.built) + '</span></div>' +
          '<div class="qa-row"><span class="q">My contribution</span><span class="a">' + esc(p.contribution) + '</span></div>' +
          '<div class="qa-row"><span class="q">Technical approach</span><span class="a"><span class="stack-line">' + esc(p.core) + '</span></span></div>' +
          '<div class="qa-row"><span class="q">Results</span><span class="a">' + esc(p.results) + '</span></div>';
      }
      info.innerHTML =
        '<span class="type">' + esc(p.type) + (p.org ? '  ·  ' + esc(p.org) : '') + '</span>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<div class="qa-block">' + rowsHtml + '</div>' +
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
     Presentation mode
     ============================================================ */
  (function () {
    var STEPS = [
      { id: 'intro', label: 'Intro' }, { id: 'profile', label: 'Who I Am' },
      { id: 'experience', label: 'Experience' }, { id: 'research', label: 'Research & Publications' }, { id: 'securedocai', label: 'SecureDocAI' },
      { id: 'projects', label: 'AI Projects' }, { id: 'hackathons', label: 'Hackathons & Awards' }, { id: 'mindset', label: 'Engineering Mindset' },
      { id: 'thales', label: 'Why Thales' }, { id: 'stack', label: 'Technical Foundations' }, { id: 'assistant', label: 'Ahmed AI' }
    ];
    var HINTS = {
      intro: ['Open with the one-line: data → deployment, with security in mind.', 'Point at the chips: LLMs, RAG/Graph-RAG, KGs, Agentic, Secure AI.', 'Note: graduating 2026, EFREI Advanced Master, 2w/1w apprenticeship.'],
      profile: ['“Tell me about yourself” lands here.', 'Three pillars: AI Engineering, Data Foundations, Trustworthy Systems.', 'I understand complete systems, not just frameworks.'],
      experience: ['Four experiences with exact dates — a progression, not unrelated internships.', 'Each role added a layer: Data → ML → Knowledge → GenAI → Trustworthy AI.', 'OCP → AQUADVISER → UM6P → LISTIC; each card links to the full project.', 'LISTIC (Feb–Jul 2026) is the current, flagship one.'],
      research: ['I have a real research profile, not only projects.', 'PUBLISHED: CityEcoScout (co-author, IJCEDS 2025).', 'IN PREPARATION: SecureDocAI manuscript (LISTIC, with Loukil & Verjus).', 'Progression: knowledge rep → multimodal → trustworthy GenAI.'],
      securedocai: ['Lead with the PROBLEM, not the tech.', 'Walk Layer 1 (document) then Layer 2 (security) — click the tabs.', 'Headline: 97.8% RBAC, leakage 15.39%→0.21%, 95% utility kept.', 'This is my flagship — but one part of a broader profile.'],
      projects: ['Click each tab; the visual animates live.', 'For each: Problem → Built → My contribution → Approach → Results → Takeaway.', 'NeurologiqueTWIN: DL classification was the core; Digital Twin was my extension.', 'Show breadth: multimodal, KGs, agents, Green AI, NLP, Big Data.'],
      hackathons: ['2nd Prize — Innov\'Boost 2025 (NeurologiqueTWIN), with photos.', 'Open Data Hackathon (Santeo, digital health) + Pwned (cyber & AI).', 'Shows rapid prototyping, teamwork and delivery under pressure.'],
      stack: ['Organized by architecture layer, not a logo wall.', 'AI/ML · GenAI · Document AI · Data Eng · Databases · MLOps · BI.', 'Point: tools are not the goal — architecture and value are.'],
      mindset: ['This is the part that matters for critical systems.', 'Ten principles; land on “security by design” and “measure before claiming”.', 'Quote: use AI only where it brings measurable value.'],
      thales: ['Honest overlap, not flattery.', 'Left = what I built, Right = what I want to explore.', 'Ask them: “what problem would you want me on first?”', 'Then Why-me: five evidence-based points.'],
      assistant: ['Turn the tool on myself: an AI candidate arrives with an assistant.', 'Toggle “Show AI pipeline” to explain retrieval → Llama → grounded.', 'It answers from my WHOLE profile — never invents.', 'Locally it runs Llama 3.2; on the web, profile-grounded mode.'],
      contact: ['Close on “AI that can be trusted”.', 'Give the apprenticeship rhythm again (2w/1w).', 'Ask the three prepared questions.', 'Thank them.']
    };

    var body = document.body, rail = $('#present-rail'), ind = $('#pv-ind'), hintBox = $('#presenter-hint'), hintList = $('#ph-list');
    var current = 0, presenting = false, hintOn = false;   // presenter notes hidden by default
    var navLock = 0;                                        // explicit nav wins over the scroll-spy for a moment

    // progress bar
    var progress = document.createElement('div'); progress.className = 'present-progress'; body.appendChild(progress);

    // full-screen start screen
    var startEl = document.createElement('div'); startEl.id = 'present-start';
    startEl.innerHTML =
      '<p class="ks">THALES AI Interview · September 2026</p>' +
      '<h1>Ahmed Moubarak <span class="amb">Lahlyal</span></h1>' +
      '<p class="role">AI Engineer · Trustworthy AI · Generative AI · Data Engineering</p>' +
      '<p class="sub">Interactive Portfolio Presentation</p>' +
      '<div class="status">' +
        '<div class="row"><b>Portfolio data</b><span class="ok">✓ Ready</span></div>' +
        '<div class="row"><b>Presentation</b><span class="ok">✓ Ready</span></div>' +
        '<div class="row"><b>Ahmed AI</b><span id="ps-ai" class="kb">○ checking…</span></div>' +
      '</div>' +
      '<button class="btn primary btn-lg" id="ps-start">▶ Start Presentation</button>' +
      '<p class="hint">→ / Space next · ← previous · Esc exit · pick a chapter on the left</p>';
    body.appendChild(startEl);

    // build rail (chapter navigator)
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
      hintBox.classList.toggle('show', presenting && hintOn && !startEl.classList.contains('show'));
    }
    function updateUI() {
      $$('.rail-item').forEach(function (el, i) { el.classList.toggle('active', i === current); });
      ind.textContent = ('0' + (current + 1)).slice(-2) + ' / ' + ('0' + STEPS.length).slice(-2);
      progress.style.width = ((current + 1) / STEPS.length * 100) + '%';
      renderHint();
    }
    function goTo(i) {
      current = Math.max(0, Math.min(STEPS.length - 1, i));
      navLock = Date.now();
      var el = document.getElementById(STEPS[current].id);
      if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      updateUI();
    }
    function probeStatus() {
      var el = $('#ps-ai'); if (!el) return;
      var ctrl = new AbortController(); var to = setTimeout(function () { ctrl.abort(); }, 2500);
      fetch('/api/chat', { method: 'GET', signal: ctrl.signal }).then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { clearTimeout(to); if (d && d.available) { el.className = 'live'; el.textContent = '● Llama 3.2 — Local'; } else { el.className = 'kb'; el.textContent = '○ Web knowledge mode'; } })
        .catch(function () { clearTimeout(to); el.className = 'kb'; el.textContent = '○ Web knowledge mode'; });
    }
    function open() {                 // show the start screen; portfolio "enters presentation mode"
      presenting = true; body.classList.add('presenting'); window.scrollTo(0, 0);
      startEl.classList.add('show'); probeStatus(); renderHint();
    }
    function begin() {                // start the guided tour of the real portfolio
      startEl.classList.remove('show'); current = 0; goTo(0);
    }
    function exit() {
      presenting = false; body.classList.remove('presenting'); startEl.classList.remove('show'); hintBox.classList.remove('show');
      if (location.hash === '#presentation') { try { history.replaceState(null, '', location.pathname); } catch (e) {} }
    }

    function syncCurrent() {
      var best = 0, bestDist = Infinity;
      STEPS.forEach(function (s, i) { var el = document.getElementById(s.id); if (!el) return; var d = Math.abs(el.getBoundingClientRect().top); if (d < bestDist) { bestDist = d; best = i; } });
      current = best;
    }

    // track current on scroll — the section crossing the viewport centre is "current"
    // (rootMargin works for both short and very tall sections, unlike a fixed threshold)
    var spy = new IntersectionObserver(function (es) {
      if (Date.now() - navLock < 1000) return;   // explicit navigation is authoritative for ~1s
      es.forEach(function (e) { if (e.isIntersecting) { var idx = STEPS.map(function (s) { return s.id; }).indexOf(e.target.id); if (idx >= 0) { current = idx; if (presenting) updateUI(); } } });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    STEPS.forEach(function (s) { var el = document.getElementById(s.id); if (el) spy.observe(el); });

    // buttons — the nav / hero "Interview Presentation" buttons enter guided mode
    $('#present-toggle').addEventListener('click', open);
    $('#hero-present').addEventListener('click', open);
    $('#ps-start').addEventListener('click', begin);
    $('#pv-next').addEventListener('click', function () { goTo(current + 1); });
    $('#pv-prev').addEventListener('click', function () { goTo(current - 1); });
    $('#pv-exit').addEventListener('click', exit);
    $('#pv-hint').addEventListener('click', function () { hintOn = !hintOn; renderHint(); });
    $('#ph-close').addEventListener('click', function () { hintOn = false; hintBox.classList.remove('show'); });

    // keyboard
    document.addEventListener('keydown', function (e) {
      var lb = $('#lightbox');
      if (e.key === 'Escape') { if (lb.classList.contains('open')) { lb.classList.remove('open'); return; } if (presenting) { e.preventDefault(); exit(); return; } }
      if (!presenting) return;
      // start screen: any advance key begins the tour
      if (startEl.classList.contains('show')) { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); begin(); } return; }
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'textarea' || tag === 'input') return;  // don't hijack the chatbot input
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); goTo(current + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); goTo(current - 1); }
      else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
      else if (e.key === 'End') { e.preventDefault(); goTo(STEPS.length - 1); }
    });

    // open directly via /presentation route or #presentation hash
    if (location.pathname.replace(/\/$/, '') === '/presentation' || location.hash === '#presentation') { open(); }
  })();
})();
