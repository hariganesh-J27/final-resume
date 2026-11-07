/* ==========================================================================
   Portfolio — behaviour
   Content comes from js/data.js (window.SITE). Libraries: GSAP, ScrollTrigger, Lenis.
   ========================================================================== */
(() => {
  'use strict';

  const D = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (v, a, b) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const pad = n => String(n).padStart(2, '0');
  const fmtStat = (v, p, suf) => (p ? String(Math.round(v)).padStart(p, '0') : String(Math.round(v))) + (suf || '');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NAME = D.name.toUpperCase();

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ------------------------------------------------------------------ *
   * Fit a single-line element to a target pixel width
   * ------------------------------------------------------------------ */
  function fitText(el, target, min, max) {
    el.style.fontSize = '100px';
    // measure the text itself (a block element would report its container's width)
    const range = document.createRange();
    range.selectNodeContents(el);
    const w = range.getBoundingClientRect().width || 1;
    el.style.fontSize = clamp(100 * target / w, min, max) + 'px';
  }

  /* ------------------------------------------------------------------ *
   * Render static content
   * ------------------------------------------------------------------ */
  function renderStatic() {
    document.title = `${D.name} — ${D.title}`;
    $('#nav-brand').textContent = D.brand || NAME;
    $('#loader-name').textContent = NAME;

    // hero (the big word itself is built per slide in setSlide())
    $('#hero-sub').innerHTML = '<span id="hero-sub-text" style="display:inline-block"></span>';
    hero.subText = $('#hero-sub-text');
    $('#slide-dashes').innerHTML = D.heroSlides.map((_, i) => `<button type="button" aria-label="Slide ${i + 1}"></button>`).join('');
    $('#intro-eyebrow').textContent = D.intro.hello;
    $('#intro-name').innerHTML = D.intro.heading.map(esc).join('<br>') + '<i class="intro-dot"></i>';
    $('#intro-btn-label').textContent = D.intro.button;
    $('#scroll-hint').textContent = D.intro.hint;
    $('#intro-links').innerHTML = D.footer.socials.map(s =>
      `<a class="intro-link" href="${esc(s.url)}"${/^mailto:/.test(s.url) ? '' : ' target="_blank" rel="noopener"'}>${esc(s.label === 'Email' ? 'Mail' : s.label)}</a>`).join('');
    if (!D.heroGhost) hero.ghost.style.display = 'none';

    // about
    $('#about-eyebrow').textContent = D.about.eyebrow;
    $('#about-title').textContent = D.about.heading;
    $('#stats').innerHTML = D.about.stats.map(s =>
      `<div class="stat"><b data-v="${s.value}" data-pad="${s.pad}" data-suf="${esc(s.suffix)}">${fmtStat(0, s.pad, s.suffix)}</b><span>${esc(s.label)}</span></div>`).join('');
    $('#tl-items').innerHTML = D.about.items.map((it, i) => `
      <article class="t-item" data-cat="${esc(it.cat)}">
        <span class="t-num">${pad(i + 1)}</span>
        <div class="t-card">
          <div class="t-label">— ${esc(it.label)}</div>
          <h3>${esc(it.title)}</h3>
          <div class="t-sub">${esc(it.sub)}</div>
          <p>${esc(it.text)}</p>
          <div class="tags">${it.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        </div>
      </article>`).join('');

    // tech
    const st = D.tech.stages;
    $('#tech-eyebrow').textContent = D.tech.eyebrow;
    $('#tech-title').textContent = D.tech.heading;
    $('#pipeline').innerHTML = st.map((s, i) => `
      <div class="stage" data-i="${i}" style="--c:${esc(s.color || '88,166,255')}">
        <div class="num">${pad(i + 1)}</div>
        <h3>${esc(s.name)}</h3>
        <ul>${s.tools.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>${i < st.length - 1 ? '<div class="conn"><span></span></div>' : ''}`).join('');

    // certificates (two rows, each duplicated for a seamless loop)
    $('#cert-eyebrow').textContent = D.certs.eyebrow;
    $('#cert-title').textContent = D.certs.heading;
    $('#cert-blurb').textContent = D.certs.blurb;
    // each card shows only the issuer's symbol and opens the certificate (PDF) in a new tab when clicked
    const certHtml = c => `
      <a class="cert" href="${esc(c.file || c.url)}" target="_blank" rel="noopener" aria-label="${esc(c.title)} — open certificate">
        <div class="logo">${c.logo ? `<img src="${esc(c.logo)}" alt="" loading="lazy" draggable="false">` : esc(c.issuer.trim().charAt(0).toUpperCase())}</div>
        <div><h4>${esc(c.title)}</h4><p>${esc(c.issuer)}</p><span class="verify">${c.file ? 'View certificate' : 'Inspect'} →</span></div>
      </a>`;
    const items = D.certs.items;
    const half = Math.ceil(items.length / 2);
    const rowA = items.slice(0, half), rowB = items.slice(half).length ? items.slice(half) : items;
    // repeat enough copies that half of the track is always wider than any screen (seamless loop)
    const fill = row => {
      const reps = Math.max(2, Math.ceil(2400 / (row.length * 368)));
      return Array.from({ length: reps * 2 }, () => row).flat().map(certHtml).join('');
    };
    $('#cert-row-1').innerHTML = fill(rowA);
    $('#cert-row-2').innerHTML = fill(rowB);
    const prof = $('#cert-profile');
    prof.textContent = D.certs.profileLabel;
    prof.href = D.certs.profileUrl;

    // projects
    $('#proj-eyebrow').textContent = D.projects.eyebrow;
    const n = D.projects.items.length;
    $('#proj-track').innerHTML = D.projects.items.map((p, i) => {
      const m = p.mock;
      const bars = Array.from({ length: 14 }, (_, j) => {
        const h = 28 + ((i * 7 + j * 13) % 10) * 7;
        return `<i style="height:${h}%;animation-delay:${(-j * 0.23).toFixed(2)}s"></i>`;
      }).join('');
      return `
      <article class="proj" style="--rgb:${p.accent}">
        <div class="p-info">
          <div class="p-cat">${esc(p.cat)}</div>
          <h3 class="p-title">${esc(p.title)}</h3>
          <p class="p-desc">${esc(p.desc)}</p>
          <div class="p-tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
          <div class="p-actions">
            ${p.live ? `<a class="p-link" href="${esc(p.live)}" target="_blank" rel="noopener">Visit project</a>` : ''}
            <a class="p-more" href="${esc(p.more)}" target="_blank" rel="noopener">${esc(p.moreLabel || 'Read more')}</a>
          </div>
        </div>
        <div class="p-visual">
          <div class="p-glow" style="background:rgb(${p.accent})"></div>
          <div class="p-ghost">${pad(i + 1)}</div>
          <div class="p-card">
            <div class="p-dots"><i></i><i></i><i></i></div>
            <div class="p-screen" style="--rgb:${p.accent};--c:rgb(${p.accent})">
              <div class="ps-top"><span>${esc(m.title)}</span><span class="ps-badge">● ${esc(m.badge)}</span></div>
              <div class="ps-label">${esc(m.statLabel)}</div>
              <div class="ps-stat">${esc(m.stat)}</div>
              <div class="ps-bars">${bars}</div>
              <div class="ps-lines">${m.lines.map(l => `<span>${esc(l)}</span>`).join('')}</div>
            </div>
            <div class="p-meta"><span>PROTOTYPE V1.0</span><span>${pad(i + 1)}/${pad(n)}</span></div>
          </div>
        </div>
      </article>`;
    }).join('');

    // contact
    $('#contact-eyebrow').textContent = D.contact.eyebrow;
    $('#contact-title').innerHTML = D.contact.heading.map(l => `<span><em>${esc(l)}</em></span>`).join('');
    $('#contact-blurb').textContent = D.contact.blurb;
    const em = $('#contact-email');
    em.textContent = D.email;
    em.href = `mailto:${D.email}`;
    const ph = $('#contact-phone');
    ph.textContent = D.phone;
    ph.href = `tel:${D.phone.replace(/\s/g, '')}`;
    $('#contact-location').textContent = D.location;

    // footer
    $('#foot-name').textContent = D.name;
    $('#foot-blurb').textContent = D.footer.blurb;
    const rb = $('#resume-btn');
    if (D.resume) { rb.href = D.resume; rb.setAttribute('download', D.resumeName || 'Resume.pdf'); }
    else rb.style.display = 'none';
    $('#legal-1').textContent = `© ${new Date().getFullYear()} ${NAME}. All rights reserved.`;
    $('#legal-2').textContent = `Built with 💛 by ${NAME}.`;
    $('#foot-menu').innerHTML = [['Home', '#hero-section'], ['About', '#about'], ['Tech Stack', '#tech-stack'], ['Projects', '#projects'], ['Contact', '#contact']]
      .map(([l, h]) => `<li><a href="${h}">${l}</a></li>`).join('');
    $('#foot-socials').innerHTML = D.footer.socials.map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('');
    $('#foot-projects').innerHTML = D.projects.items.map(p => `<li><a href="#projects">${esc(p.title)}</a></li>`).join('');
    $('#foot-word').textContent = (D.footerWord || D.name).toUpperCase();
  }

  /* ------------------------------------------------------------------ *
   * Smooth scrolling (Lenis) wired to ScrollTrigger
   * ------------------------------------------------------------------ */
  let lenis = null;
  function initScroll() {
    if (window.Lenis && !reduce) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      lenis.stop(); // until the loader finishes
    }
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const el = target.closest('.pin-spacer') || target;
      lenis ? lenis.scrollTo(el, { duration: 1.6 }) : el.scrollIntoView({ behavior: 'smooth' });
    }));
  }

  /* ------------------------------------------------------------------ *
   * Tiny UI sounds (WebAudio, no files)
   * ------------------------------------------------------------------ */
  let soundOn = true, actx = null, lastHover = null;
  function tick(freq = 640, dur = 0.05, vol = 0.025) {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(actx.destination);
      o.start(t); o.stop(t + dur);
    } catch (e) { /* audio blocked — ignore */ }
  }
  function initSound() {
    const btn = $('#sound-toggle');
    btn.addEventListener('click', () => {
      soundOn = !soundOn;
      btn.setAttribute('aria-pressed', String(soundOn));
      btn.title = soundOn ? 'Mute UI sounds' : 'Unmute UI sounds';
      if (soundOn) tick(880);
    });
    document.addEventListener('pointerover', e => {
      const el = e.target.closest('a, button');
      if (el && el !== lastHover) { lastHover = el; tick(520 + Math.random() * 120, 0.035, 0.015); }
      else if (!el) lastHover = null;
    });
    document.addEventListener('click', e => { if (e.target.closest('a, button')) tick(780, 0.07, 0.03); });
  }

  /* ------------------------------------------------------------------ *
   * HERO — dust, ghost word, constellation burst, portrait reveal
   * ------------------------------------------------------------------ */
  const hero = {
    el: $('#hero-section'), active: true, p: 0, slide: -1, built: false, swap: null,
    WORD_END: 0.5,
    ghost: $('#ghost'), ghostWord: $('#ghost-word'),
    center: $('#hero-center'), name: $('#hero-name'), sub: $('#hero-sub'), subText: null, // subText is set in renderStatic()
    dashes: $('#slide-dashes'), intro: $('#hero-intro'), hint: $('#scroll-hint'), stage: $('.hero-stage'), burstCv: $('#burst')
  };
  const N = D.heroSlides.length;

  // ---- Dust: drifting specks with mouse parallax
  const dust = { cv: $('#dust'), ctx: null, w: 0, h: 0, pts: [], mx: 0, my: 0, tx: 0, ty: 0 };
  function sizeCanvas(cv, scale = 1) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2) * scale;
    const w = cv.clientWidth, h = cv.clientHeight;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }
  function initDust() {
    const s = sizeCanvas(dust.cv);
    dust.ctx = s.ctx; dust.w = s.w; dust.h = s.h;
    const count = Math.round(s.w * s.h / 6500);
    dust.pts = Array.from({ length: count }, () => ({
      x: Math.random() * s.w, y: Math.random() * s.h,
      r: 0.6 + Math.pow(Math.random(), 2.2) * 3.4,
      a: 0.05 + Math.random() * 0.2,
      vx: (Math.random() - 0.5) * 0.14, vy: (Math.random() - 0.5) * 0.14,
      z: 0.2 + Math.random()
    }));
  }
  function drawDust() {
    const { ctx, w, h, pts } = dust;
    dust.mx += (dust.tx - dust.mx) * 0.05; dust.my += (dust.ty - dust.my) * 0.05;
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
      ctx.beginPath();
      ctx.arc(p.x + dust.mx * p.z * 26, p.y + dust.my * p.z * 26, p.r, 0, 6.2832);
      ctx.fillStyle = `rgba(52,48,40,${p.a})`;
      ctx.fill();
    }
  }
  window.addEventListener('pointermove', e => {
    dust.tx = (e.clientX / innerWidth - 0.5) * 2;
    dust.ty = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  // ---- Burst: a constellation that radiates from the centre as you scroll
  const burst = { ctx: null, w: 0, h: 0, nodes: [], t: 0, a: 0, drawn: false };
  const PALETTE = ['#c0463d', '#3a8f4b', '#4a86c5', '#b88a2b', '#6b7280', '#7a5bb5'];
  function initBurst() {
    const s = sizeCanvas(hero.burstCv);
    burst.ctx = s.ctx; burst.w = s.w; burst.h = s.h;
    const count = s.w < 700 ? 80 : 150;
    burst.nodes = Array.from({ length: count }, (_, i) => ({
      a: Math.random() * 6.2832, r: 0.1 + Math.random() * 0.9,
      s: 1.3 + Math.random() * 2.4, c: PALETTE[i % PALETTE.length], sw: (Math.random() - 0.5) * 0.7
    }));
  }
  function drawBurst() {
    const { ctx, w, h, nodes } = burst;
    if (burst.a <= 0.002) { if (burst.drawn) { ctx.clearRect(0, 0, w, h); burst.drawn = false; } return; }
    burst.drawn = true;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, maxR = Math.hypot(w, h) * 0.36;
    const e = 1 - Math.pow(1 - burst.t, 3);
    const link = Math.min(w, h) * 0.13;
    const pos = nodes.map(n => {
      const ang = n.a + n.sw * burst.t;
      const d = n.r * maxR * e;
      return { x: cx + Math.cos(ang) * d, y: cy + Math.sin(ang) * d * 0.82, n };
    });
    ctx.lineWidth = 1;
    // radial streaks
    for (const p of pos) {
      ctx.strokeStyle = `rgba(26,26,26,${0.05 * burst.a})`;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y); ctx.stroke();
    }
    // neighbour links
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y, d = Math.hypot(dx, dy);
        if (d < link) {
          ctx.strokeStyle = `rgba(40,40,40,${(1 - d / link) * 0.22 * burst.a})`;
          ctx.beginPath(); ctx.moveTo(pos[i].x, pos[i].y); ctx.lineTo(pos[j].x, pos[j].y); ctx.stroke();
        }
      }
    }
    // nodes
    ctx.globalAlpha = 0.85 * burst.a;
    for (const p of pos) {
      ctx.fillStyle = p.n.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.n.s, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ---- Slides: ONE word on screen at a time (HELLO → HARI → AI & ML)
  // The big word is split into letters; the old word fully leaves before the next one enters.
  const wordLetters = w => [...w].map(c => `<span class="ch">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');

  // Size the headline to ~46% of the screen, and its outline echo 1.55x larger
  function fitHero() {
    fitText(hero.name, innerWidth * 0.46, 90, innerWidth * 0.24);
    hero.ghostWord.style.fontSize = parseFloat(hero.name.style.fontSize) * 1.55 + 'px';
  }

  function setSlide(i) {
    hero.slide = i;
    const s = D.heroSlides[i];
    hero.dashes.querySelectorAll('button').forEach((b, k) => b.classList.toggle('is-active', k === i));

    const build = () => {
      hero.name.setAttribute('aria-label', s.word);
      hero.name.innerHTML = wordLetters(s.word);
      hero.ghostWord.textContent = s.word;
      hero.subText.textContent = s.sub;
      fitHero();
    };
    if (!hero.built) { hero.built = true; build(); return; }

    // stop anything mid-flight, then: old word out → build new word → new word in
    if (hero.swap) hero.swap.kill();
    gsap.killTweensOf([...$$('.ch', hero.name), hero.ghostWord, hero.subText]);
    hero.swap = gsap.timeline()
      .to($$('.ch', hero.name), { yPercent: -90, opacity: 0, duration: 0.28, stagger: 0.025, ease: 'power3.in' }, 0)
      .to([hero.ghostWord, hero.subText], { opacity: 0, y: -14, duration: 0.24, ease: 'power2.in' }, 0)
      .add(() => {
        build();
        gsap.fromTo($$('.ch', hero.name), { yPercent: 90, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.65, stagger: 0.05, ease: 'power4.out' });
        gsap.fromTo([hero.ghostWord, hero.subText], { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.06 });
      });
  }

  // ---- Typewriter for the role line (starts when the intro fades in, resets when you scroll back up)
  const type = { tw: null, state: 'idle' };
  function startType() {
    if (type.state !== 'idle') return;
    type.state = 'typing';
    const el = $('#intro-type-text'), text = D.intro.typed, o = { n: 0 };
    type.tw = gsap.to(o, {
      n: text.length, duration: Math.max(1.2, text.length * 0.045), ease: 'none', delay: 0.25,
      onUpdate: () => { el.textContent = text.slice(0, Math.round(o.n)); },
      onComplete: () => { type.state = 'done'; }
    });
  }
  function resetType() {
    if (type.state === 'idle') return;
    if (type.tw) type.tw.kill();
    $('#intro-type-text').textContent = '';
    type.state = 'idle';
  }

  // ---- "Click the void": dots and a ring burst out from wherever you click on the hero background
  function voidBurst(x, y) {
    const ring = document.createElement('span');
    ring.className = 'void-ring';
    ring.style.cssText = `left:${x}px;top:${y}px;width:12px;height:12px;margin:-6px 0 0 -6px`;
    hero.stage.appendChild(ring);
    gsap.to(ring, { scale: 14, opacity: 0, duration: 0.9, ease: 'power2.out', onComplete: () => ring.remove() });
    const n = 16;
    for (let i = 0; i < n; i++) {
      const d = document.createElement('span'), s = 5 + Math.random() * 9;
      d.className = 'void-dot';
      d.style.cssText = `left:${x}px;top:${y}px;width:${s}px;height:${s}px;margin:${-s / 2}px 0 0 ${-s / 2}px`;
      hero.stage.appendChild(d);
      const a = (i / n) * 6.2832 + Math.random() * 0.4, dist = 70 + Math.random() * 170;
      gsap.to(d, { x: Math.cos(a) * dist, y: Math.sin(a) * dist, opacity: 0, scale: 0.5, duration: 0.9 + Math.random() * 0.7, ease: 'power3.out', onComplete: () => d.remove() });
    }
    tick(420 + Math.random() * 200, 0.06, 0.02);
  }

  function heroRender(p) {
    hero.p = p;
    const idx = Math.min(N - 1, Math.floor(clamp(p / hero.WORD_END, 0, 0.9999) * N));
    if (idx !== hero.slide) setSlide(idx);

    // words (headline, echo, subtitle, dashes) leave together once the last slide is done
    const words = 1 - smooth(p, 0.5, 0.6);
    hero.center.style.opacity = words;
    hero.ghost.style.opacity = words;
    hero.dashes.style.opacity = words;
    hero.dashes.style.pointerEvents = p > 0.5 ? 'none' : 'auto';

    // constellation expands from the centre and is completely gone BEFORE the intro text appears,
    // so nothing sits behind the name, tagline and chips
    burst.t = clamp((p - 0.48) / 0.18);
    burst.a = smooth(p, 0.48, 0.55) * (1 - smooth(p, 0.60, 0.69));
    hero.burstCv.style.opacity = burst.a > 0.002 ? 1 : 0;
    dust.cv.style.opacity = 1 - smooth(p, 0.60, 0.70);             // the drifting specks clear away too

    // intro: hello line, huge name, typed role, button + links — on the paper-white ground of your old site
    const ia = smooth(p, 0.70, 0.82);
    hero.intro.style.opacity = ia;
    hero.intro.style.transform = `translateY(${(1 - ia) * 40}px)`;
    hero.intro.classList.toggle('is-live', ia > 0.6);
    hero.hint.style.opacity = ia;
    const bg = smooth(p, 0.62, 0.72);                              // hero cream → paper white, while the specks are gone
    hero.stage.style.backgroundColor = `rgb(${Math.round(240 + 13 * bg)},${Math.round(237 + 18 * bg)},${Math.round(232 + 13 * bg)})`;
    if (ia > 0.25) startType(); else if (ia < 0.02) resetType();
  }

  function initHero() {
    initDust(); initBurst();
    heroRender(0);
    hero.stage.addEventListener('click', e => {
      if (e.target.closest('a, button')) return;                   // real controls keep their own behaviour
      const r = hero.stage.getBoundingClientRect();
      voidBurst(e.clientX - r.left, e.clientY - r.top);
    });
    ScrollTrigger.create({
      trigger: hero.el, start: 'top top', end: 'bottom bottom',
      onUpdate: s => heroRender(s.progress),
      onToggle: s => { hero.active = s.isActive; }
    });
    // keep running while the hero is at least partly on screen
    ScrollTrigger.create({ trigger: hero.el, start: 'top bottom', end: 'bottom top', onToggle: s => { hero.active = s.isActive; } });
    hero.dashes.querySelectorAll('button').forEach((b, i) => b.addEventListener('click', () => {
      const total = hero.el.offsetHeight - innerHeight;
      const y = hero.el.offsetTop + total * ((i + 0.5) / N) * hero.WORD_END;
      lenis ? lenis.scrollTo(y, { duration: 1.2 }) : window.scrollTo({ top: y, behavior: 'smooth' });
    }));
  }

  /* ------------------------------------------------------------------ *
   * ABOUT — winding glowing timeline
   * ------------------------------------------------------------------ */
  const tl = {
    wrap: $('#timeline'), svg: $('#tl-svg'), list: $('#tl-items'),
    base: $('#tl-base'), glow: $('#tl-glow'), line: $('#tl-line'), nodes: $('#tl-nodes'), head: $('#tl-head'),
    st: null, tweens: [], pts: [], samples: [], total: 0, H: 0, filter: 'all'
  };

  function layoutTimeline() {
    // clean up previous triggers
    tl.tweens.forEach(t => { if (t.scrollTrigger) t.scrollTrigger.kill(); t.kill(); });
    tl.tweens = [];
    if (tl.st) tl.st.kill();
    gsap.set($$('.t-card', tl.list), { clearProps: 'all' });

    const all = $$('.t-item', tl.list);
    all.forEach(el => el.classList.toggle('is-hidden', tl.filter !== 'all' && el.dataset.cat !== tl.filter));
    const vis = all.filter(el => !el.classList.contains('is-hidden'));
    vis.forEach((el, i) => { el.classList.toggle('left', i % 2 === 0); el.classList.toggle('right', i % 2 === 1); });

    const mobile = innerWidth < 900;
    const W = tl.wrap.clientWidth, H = tl.wrap.clientHeight;
    tl.H = H;
    tl.svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    $('#tl-grad').setAttribute('y2', H);

    tl.pts = vis.map((el, i) => ({ x: mobile ? 22 : W * (i % 2 === 0 ? 0.6 : 0.4), y: el.offsetTop + el.offsetHeight / 2 }));

    let d = '';
    if (tl.pts.length) {
      if (mobile) d = `M 22 0 L 22 ${H}`;
      else {
        const f = tl.pts[0];
        d = `M ${W * 0.5} 0 C ${W * 0.5} ${f.y * 0.55}, ${f.x} ${f.y * 0.45}, ${f.x} ${f.y}`;
        for (let i = 1; i < tl.pts.length; i++) {
          const a = tl.pts[i - 1], b = tl.pts[i], m = (a.y + b.y) / 2;
          d += ` C ${a.x} ${m}, ${b.x} ${m}, ${b.x} ${b.y}`;
        }
        const l = tl.pts[tl.pts.length - 1], my = l.y + (H - l.y) * 0.5;
        d += ` C ${l.x} ${my}, ${W * 0.5} ${my}, ${W * 0.5} ${H}`;
      }
    }
    [tl.base, tl.glow, tl.line].forEach(p => p.setAttribute('d', d));

    // sample the path so scroll position (y) maps to a point along it
    tl.total = d ? tl.line.getTotalLength() : 0;
    tl.samples = [];
    for (let s = 0; s <= 400 && tl.total; s++) {
      const L = tl.total * s / 400, p = tl.line.getPointAtLength(L);
      tl.samples.push({ L, x: p.x, y: p.y });
    }

    tl.nodes.innerHTML = tl.pts.map(p => `<circle class="tl-node" cx="${p.x}" cy="${p.y}" r="7"/>`).join('');

    // card reveals
    vis.forEach(el => {
      const card = $('.t-card', el), dir = el.classList.contains('left') ? -1 : 1;
      const tw = gsap.from(card, {
        opacity: 0, x: mobile ? 0 : dir * 56, y: mobile ? 28 : 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' }
      });
      tl.tweens.push(tw);
    });

    tl.st = ScrollTrigger.create({
      trigger: tl.wrap, start: 'top 65%', end: 'bottom 65%',
      onUpdate: s => setTimeline(s.progress)
    });
    setTimeline(tl.st.progress || 0);
  }

  function setTimeline(p) {
    if (!tl.samples.length) return;
    const y = p * tl.H;
    let s = tl.samples[0];
    for (let i = 0; i < tl.samples.length; i++) { if (tl.samples[i].y <= y) s = tl.samples[i]; else break; }
    const off = 1 - s.L / tl.total;
    tl.line.style.strokeDashoffset = off;
    tl.glow.style.strokeDashoffset = off;
    tl.head.setAttribute('cx', s.x); tl.head.setAttribute('cy', s.y);
    tl.head.setAttribute('opacity', p > 0.001 && p < 0.999 ? 1 : 0);
    $$('.tl-node', tl.nodes).forEach((n, i) => n.classList.toggle('on', y >= tl.pts[i].y - 8));
  }

  function initTimeline() {
    layoutTimeline();
    $$('.tab').forEach(tab => tab.addEventListener('click', () => {
      $$('.tab').forEach(t => t.classList.toggle('is-active', t === tab));
      tl.filter = tab.dataset.filter;
      gsap.fromTo(tl.list, { opacity: 0.2 }, { opacity: 1, duration: 0.5 });
      layoutTimeline();
      ScrollTrigger.refresh();
    }));
  }

  /* ------------------------------------------------------------------ *
   * TECH STACK — pipeline + aurora background
   * ------------------------------------------------------------------ */
  const tech = { stages: [], conns: [], connWraps: [], centers: [], vp: { x: 0, y: 0 }, desc: $('#tech-desc'), count: $('#tech-count'), name: $('#tech-stage-name'), idx: -2, u: 0 };
  const T = D.tech.stages.length;
  const FLY = 0.6;      // share of each stage's scroll spent flying down the tunnel (the rest it sits docked in the row)
  const Z_FAR = 6.5;    // how far down the tunnel a card starts, in tunnel units (smaller = card is bigger sooner)

  // Where each card naturally sits inside the sticky stage. offsetLeft/Top ignore transforms, so this is safe mid-animation.
  function measureStages() {
    const stage = $('.tech-stage');
    tech.centers = tech.stages.map(el => {
      let x = el.offsetWidth / 2, y = el.offsetHeight / 2, n = el;
      while (n && n !== stage) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
      return { x, y };
    });
    tech.vp = { x: stage.clientWidth / 2, y: stage.clientHeight * 0.5 };   // the tunnel's vanishing point
  }

  /* Scroll position u runs 0 → 5 (one unit per stage). During the first 60% of each unit that stage's card
   * flies out of the far end of the tunnel toward you — perspective: scale = 1/depth, position slides from
   * the vanishing point to its slot — while a laser ring rushes ahead of it, then whooshes past the camera.
   * Docked cards stay in the row (dimmed) so the pipeline builds up stage by stage. */
  function techRender(u) {
    tech.u = u;
    if (!tech.centers.length) return;
    const vp = tech.vp;

    tech.stages.forEach((el, i) => {
      const q = clamp((u - i) / FLY);                  // 0 = far away, 1 = docked
      const k = 1 / (Z_FAR - (Z_FAR - 1) * q);         // perspective scale
      const c = tech.centers[i];
      el.style.opacity = smooth(q, 0, 0.3) * (u >= i + 1 ? 0.78 : 1);
      el.style.visibility = q <= 0 ? 'hidden' : 'visible';
      el.style.transform = `translate(${(c.x - vp.x) * (k - 1)}px, ${(c.y - vp.y) * (k - 1)}px) scale(${k})`;
    });
    tech.connWraps.forEach((w, i) => {
      const q = clamp((u - (i + 1)) / FLY);            // a connector draws itself as the next card arrives
      w.style.opacity = smooth(q, 0, 0.3);
      tech.conns[i].style.transform = `scaleX(${smooth(q, 0.35, 1)})`;
    });

    // the gate ring travels with the card that is currently flying, then passes the camera
    const cur = clamp(Math.floor(u), 0, T - 1);
    const qg = (u - cur) / FLY;
    tun.gateZ = Z_FAR - (Z_FAR - 1) * qg;
    tun.gateA = u >= T ? 0 : smooth(qg, 0, 0.12) * (1 - smooth(qg, 1.2, 1.33));
    tun.boost = Math.max(tun.boost, 1.8 * smooth(qg, 0.05, 0.45) * (1 - smooth(qg, 0.85, 1.25)));   // you surge forward while a card flies in

    const act = u < FLY * 0.9 ? -1 : clamp(Math.floor(u - FLY * 0.9), 0, T - 1);   // active = docked and being described
    if (act !== tech.idx) setStage(act);
  }

  function setStage(i) {
    tech.idx = i;
    tech.stages.forEach((s, k) => {
      s.classList.toggle('is-active', k === i);
      s.classList.toggle('is-past', k < i);
    });
    const k = Math.max(i, 0), st = D.tech.stages[k];
    tech.count.textContent = `${pad(k + 1)} / ${pad(T)}`;
    tech.name.textContent = i < 0 ? 'Scroll ↓' : `Stage ${pad(k + 1)} / ${st.name}`;
    tun.hueTarget = st.hue;                            // the lasers take on this stage's colour
    aurora.target = k / Math.max(1, T - 1);
    gsap.killTweensOf(tech.desc);
    if (i < 0) { gsap.to(tech.desc, { opacity: 0, duration: 0.2 }); return; }
    tick(300 + k * 90, 0.14, 0.035);                   // soft whoosh as a stage docks
    gsap.to(tech.desc, {
      opacity: 0, y: 8, duration: 0.15,
      onComplete: () => {
        tech.desc.innerHTML = `<span class="desc-tools">${st.tools.map(esc).join(' · ')}</span>${esc(st.text)}`;
        gsap.to(tech.desc, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
      }
    });
  }

  const BLOB = [
    { x: .18, y: .85, r: .55, c: [20, 60, 255], a: .55, sx: .21, sy: .17, ax: .12, ay: .07 },
    { x: .78, y: .78, r: .5, c: [60, 30, 200], a: .5, sx: .16, sy: .23, ax: .1, ay: .09 },
    { x: .5, y: .98, r: .62, c: [0, 110, 255], a: .45, sx: .13, sy: .11, ax: .2, ay: .05 },
    { x: .9, y: .2, r: .36, c: [40, 90, 255], a: .22, sx: .19, sy: .14, ax: .06, ay: .1 },
    { x: .1, y: .18, r: .3, c: [90, 40, 255], a: .2, sx: .12, sy: .2, ax: .08, ay: .08 }
  ];
  const GREEN = [30, 200, 120];
  const aurora = { cv: $('#aurora'), ctx: null, w: 0, h: 0, on: false, tint: 0, target: 0, parts: [] };
  function initAurora() {
    const s = sizeCanvas(aurora.cv, 0.5);
    aurora.ctx = s.ctx; aurora.w = s.w; aurora.h = s.h;
    aurora.parts = Array.from({ length: 70 }, () => ({
      x: Math.random() * s.w, y: Math.random() * s.h, s: 1 + Math.random() * 2.2,
      v: 0.05 + Math.random() * 0.22, a: Math.random() * 6.28, f: 0.5 + Math.random() * 1.5
    }));
  }
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  function drawAurora(time) {
    const { ctx, w, h } = aurora;
    aurora.tint += (aurora.target - aurora.tint) * 0.04;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#04050a'; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    BLOB.forEach((b, i) => {
      const x = w * (b.x + Math.sin(time * b.sx + i) * b.ax), y = h * (b.y + Math.cos(time * b.sy + i * 2) * b.ay);
      const r = Math.max(w, h) * b.r;
      const col = mix(b.c, GREEN, i === 2 || i === 0 ? aurora.tint * 0.45 : aurora.tint * 0.15).join(',');
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${col},${b.a})`); g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    });

    // light shafts from above
    const beamCol = mix([70, 120, 255], GREEN, aurora.tint * 0.5).join(',');
    for (let i = 0; i < 5; i++) {
      const ox = w * (0.12 + i * 0.19), sway = Math.sin(time * 0.3 + i * 1.7) * w * 0.12, spread = w * (0.05 + 0.03 * Math.sin(time * 0.5 + i));
      const g = ctx.createLinearGradient(ox, 0, ox + sway, h);
      g.addColorStop(0, `rgba(${beamCol},.16)`); g.addColorStop(1, `rgba(${beamCol},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(ox - 3, 0); ctx.lineTo(ox + 3, 0);
      ctx.lineTo(ox + sway + spread, h); ctx.lineTo(ox + sway - spread, h);
      ctx.closePath(); ctx.fill();
    }

    // drifting motes
    ctx.globalCompositeOperation = 'source-over';
    for (const p of aurora.parts) {
      p.y -= p.v; p.x += Math.sin(time * 0.4 + p.a) * 0.08;
      if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
      ctx.fillStyle = `rgba(160,190,255,${0.12 + 0.3 * Math.abs(Math.sin(time * p.f + p.a))})`;
      ctx.fillRect(p.x, p.y, p.s, p.s);
    }
  }

  /* ---- Laser tunnel: a round tunnel rendered in a WebGL fragment shader.
   *  You travel down its middle: lamp strips and flashing laser rings whip past, neon
   *  lasers weave along the walls, and lane lines run along the floor toward the light
   *  at the far end. The stage cards fly out of that light (see techRender).
   *  Scrolling and stage changes make you surge forward; the laser colour follows the
   *  current stage. Without WebGL the soft aurora is used instead. */
  const tun = { cv: $('#tunnel'), gl: null, ok: false, u: {}, travel: 0, speed: 3.2, boost: 0, hue: 0.4, hueTarget: 0.4, gateZ: 99, gateA: 0, prog: 0, progTarget: 0, mx: 0, my: 0 };

  const TUNNEL_VS = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
  const TUNNEL_FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform float uTravel;
uniform float uHue;
uniform float uGateZ;
uniform float uGateA;
uniform float uProg;
uniform float uBoost;
uniform vec2 uMouse;

#define PI 3.14159265
#define TAU 6.2831853

float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec3 pal(float t) { return 0.5 + 0.5 * cos(TAU * (t + vec3(0.0, 0.33, 0.67))); }
float angDist(float a, float b) { float d = abs(a - b); return min(d, TAU - d); }
// neon line: bright core plus a soft halo
float neon(float d, float w) { return smoothstep(w, 0.0, d) + 0.55 * w / (d + w * 1.4); }

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  uv *= max(1.0, 0.9 * uRes.y / uRes.x);                      // wider view on tall (phone) screens so the tunnel stays in proportion
  float vigL = length(uv);

  // The camera rocks gently as you travel; scrolling makes it shudder.
  float roll = 0.010 * sin(uTime * 1.7) + 0.008 * sin(uTime * 0.9 + 1.0);
  float cr = cos(roll), sr = sin(roll);
  vec2 p = mat2(cr, -sr, sr, cr) * uv;
  p.y += (hash21(vec2(floor(uTime * 40.0), 1.0)) - 0.5) * 0.0025 * uBoost;
  p += vec2(0.0, 0.01);                                        // vanishing point near the screen centre
  p -= uMouse * 0.05 + vec2(sin(uTime * 0.45) * 0.012, cos(uTime * 0.7) * 0.008);

  // ---- Camera travels down the middle of a round tunnel (radius 1) with a flat floor
  vec3 rd = normalize(vec3(p, 1.0));
  vec3 ro = vec3(0.0, -0.25, 0.0);
  float FL = -0.55;                                            // floor height
  float a = dot(rd.xy, rd.xy);
  float b = dot(ro.xy, rd.xy);
  float c = dot(ro.xy, ro.xy) - 1.0;
  float tw = (-b + sqrt(max(b * b - a * c, 0.0))) / max(a, 1e-4);   // wall hit
  float tf = rd.y < -1e-3 ? (FL - ro.y) / rd.y : 1e4;               // floor hit
  bool onFloor = tf < tw;
  float t = min(min(tw, tf), 80.0);
  vec3 P = ro + rd * t;
  float z = P.z + uTravel;                                      // distance travelled along the tunnel
  float fog = exp(-t * 0.075);
  float fogL = exp(-t * 0.04);                                  // lasers carry further into the dark

  float hue = uHue;                                              // colour of the current pipeline stage
  vec3 cool = pal(hue);
  float lampPh = pow(0.5 + 0.5 * cos(z * TAU / 1.6), 3.0);      // 1 under a lamp, 0 between lamps
  vec3 col = vec3(0.0);

  if (onFloor) {
    // ---- Tunnel floor: glossy dark deck, laser lane lines and a dashed centre line
    float x = P.x;
    vec3 base = vec3(0.020, 0.024, 0.036);
    col = base * (0.9 + 1.8 * lampPh);                                       // lamps reflect in the floor
    float ll = abs(abs(x) - 0.30);
    col += cool * neon(ll, 0.012) * (0.55 + 0.70 * lampPh) * 0.9;            // two glowing lane lines
    float dash = step(0.5, fract(z / 0.9));
    col += pal(hue + 0.15) * neon(abs(x), 0.008) * dash * 0.5;               // dashed centre line
    col += cool * 0.10 * exp(-abs(x) * 2.5);                                  // laser light pooling on the deck
    col *= mix(1.0, fog, 0.8);
  } else {
    // ---- Tunnel wall: concrete ribs, lamp strips, laser lines
    float th = atan(P.y, P.x);
    float rz = fract(z / 2.4);
    float rib = smoothstep(0.07, 0.0, min(rz, 1.0 - rz));
    vec3 wall = vec3(0.030, 0.038, 0.060) + (vec3(0.040, 0.060, 0.100) + cool * 0.05) * rib * (0.4 + 1.2 * lampPh);

    float lz = fract(z / 1.6);
    float lampZ = smoothstep(0.0, 0.08, lz) * smoothstep(0.55, 0.47, lz);
    float lampA = min(angDist(th, 0.78), angDist(th, 2.36));    // two strips high on the walls
    float lamp = lampZ * smoothstep(0.05, 0.015, lampA);
    float spill = lampZ * exp(-lampA * lampA * 40.0);
    vec3 lampCol = mix(vec3(0.85, 0.92, 1.0), cool, 0.35);
    float lampA2 = min(angDist(th, -0.25), angDist(th, PI + 0.25));       // low amber strips
    float lz2 = fract(z / 1.6 + 0.5);
    float lampZ2 = smoothstep(0.0, 0.08, lz2) * smoothstep(0.30, 0.22, lz2);
    float amber = lampZ2 * smoothstep(0.04, 0.012, lampA2);
    float spill2 = lampZ2 * exp(-lampA2 * lampA2 * 50.0);
    col = wall * (0.8 + 2.4 * spill + 1.4 * spill2) * fog
        + lampCol * (lamp * 2.6 + spill * 0.40) * fog
        + vec3(1.0, 0.55, 0.15) * (amber * 2.0 + spill2 * 0.35) * fog;

    // laser lines wobbling along the walls, each its own colour
    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      float th0 = -0.35 + fi * 0.50;
      float wob = sin(z * (0.28 + 0.03 * fi) + uTime * (1.1 + 0.12 * fi) + fi * 1.7) * 0.28;
      float d = angDist(th, th0 + wob);
      vec3 lc = pal(hue + fi * 0.07 + uTime * 0.01);
      col += lc * neon(d, 0.014) * 0.85 * fogL;
    }

    // random ribs flash like laser rings as you rush past
    float ringId = floor(z / 2.4);
    float rh = hash21(vec2(ringId, 7.0));
    float flash = step(0.80, rh) * (0.55 + 0.45 * sin(uTime * 6.0 + rh * 30.0));
    col += pal(rh + hue) * rib * flash * 1.5 * fogL;
  }

  // ---- Gate: a laser ring that rushes toward you ahead of each stage card, then whooshes past the camera
  float gw = 0.12 + 0.05 * max(uGateZ, 0.0);
  float gzd = P.z - uGateZ;
  float ring = exp(-gzd * gzd / (gw * gw)) * uGateA;
  vec3 gc = pal(hue);
  col += gc * ring * (1.2 + 1.8 * exp(-t * 0.05)) * (onFloor ? 0.55 : 1.0);
  col += gc * 0.30 * uGateA * smoothstep(1.2, 0.0, uGateZ) * smoothstep(-1.2, -0.2, uGateZ);   // flash as it passes

  // ---- Light at the end of the tunnel: the stage cards fly out of it
  float vpd = length(p);
  col += mix(vec3(0.9, 0.95, 1.0), cool, 0.4) * 0.12 / (vpd * vpd * 10.0 + 0.05);

  // ---- Speed: radial streaks and a subtle strobe from each lamp passing
  float angS = atan(p.y, p.x);
  float rr = length(p);
  float k = hash21(vec2(floor(angS * 80.0), floor(rr * 5.0 - uTravel * 0.5)));
  col += cool * step(0.975, k) * smoothstep(0.15, 0.6, rr) * (0.10 + 0.05 * uBoost);
  col *= 0.93 + 0.07 * pow(0.5 + 0.5 * cos(uTravel * TAU / 1.6), 4.0);

  col *= 1.25;
  col = col / (1.0 + col);                                                   // soft tone-map
  col *= 1.0 - 0.55 * smoothstep(0.5, 1.25, vigL);                           // darker corners
  gl_FragColor = vec4(col + vec3(0.006, 0.008, 0.016), 1.0);
}`;

  function initTunnel() {
    let gl = null;
    try { gl = tun.cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' }); } catch (e) { /* no WebGL */ }
    if (!gl) return;
    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('Tunnel shader:', gl.getShaderInfoLog(s)); return null; }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, TUNNEL_VS), fs = compile(gl.FRAGMENT_SHADER, TUNNEL_FS);
    if (!vs || !fs) return;
    const pr = gl.createProgram();
    gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);

    // one oversized triangle covers the screen
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ['uRes', 'uTime', 'uTravel', 'uHue', 'uGateZ', 'uGateA', 'uProg', 'uBoost', 'uMouse'].forEach(n => { tun.u[n] = gl.getUniformLocation(pr, n); });

    tun.gl = gl; tun.ok = true;
    tun.cv.style.display = 'block';
    aurora.cv.style.display = 'none';
    sizeTunnel();
  }

  function sizeTunnel() {
    if (!tun.ok) return;
    const s = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75;   // lower res is plenty for soft light
    tun.cv.width = Math.max(2, Math.round(tun.cv.clientWidth * s));
    tun.cv.height = Math.max(2, Math.round(tun.cv.clientHeight * s));
    tun.gl.viewport(0, 0, tun.cv.width, tun.cv.height);
  }

  function drawTunnel(time, dtMs) {
    const { gl, u } = tun;
    const dt = Math.min(dtMs, 50) / 1000;
    tun.boost *= 0.95;                                          // surge decays back to cruising speed
    tun.speed += ((3.2 + tun.boost * 3.2) - tun.speed) * 0.08;   // metres per second
    tun.travel += tun.speed * dt;
    tun.hue += (tun.hueTarget - tun.hue) * 0.05;
    tun.prog += (tun.progTarget - tun.prog) * 0.05;
    tun.mx += (dust.tx - tun.mx) * 0.05; tun.my += (dust.ty - tun.my) * 0.05;
    gl.uniform2f(u.uRes, tun.cv.width, tun.cv.height);
    gl.uniform1f(u.uTime, time);
    gl.uniform1f(u.uTravel, tun.travel);
    gl.uniform1f(u.uHue, tun.hue);
    gl.uniform1f(u.uGateZ, tun.gateZ);
    gl.uniform1f(u.uGateA, tun.gateA);
    gl.uniform1f(u.uProg, tun.prog);
    gl.uniform1f(u.uBoost, tun.boost);
    gl.uniform2f(u.uMouse, tun.mx, -tun.my);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function initTech() {
    tech.stages = $$('.stage');
    tech.conns = $$('.conn span');
    tech.connWraps = $$('.conn');
    initAurora();
    initTunnel();
    measureStages();
    techRender(0);
    ScrollTrigger.create({
      trigger: '#tech-stack', start: 'top top', end: 'bottom bottom',
      onUpdate: s => {
        tun.progTarget = s.progress;
        tun.boost = Math.min(3, Math.max(tun.boost, Math.abs(s.getVelocity()) / 1100));   // scrolling = flying faster
        techRender(s.progress * T);
      }
    });
    ScrollTrigger.create({ trigger: '#tech-stack', start: 'top bottom', end: 'bottom top', onToggle: s => { aurora.on = s.isActive; } });
    gsap.from(['.tech-head', '#tech-desc'], {
      opacity: 0, y: 44, duration: 1, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '#tech-stack', start: 'top 55%' }
    });
  }

  /* ------------------------------------------------------------------ *
   * PROJECTS — pinned horizontal scroll (desktop), vertical on mobile
   * ------------------------------------------------------------------ */
  function initProjects() {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const track = $('#proj-track'), bar = $('#proj-bar');
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const tlp = gsap.timeline({
        scrollTrigger: {
          trigger: '#projects', pin: true, scrub: 0.8, start: 'top top', anticipatePin: 1,
          end: () => '+=' + Math.round(dist() * 1.25), invalidateOnRefresh: true,
          onUpdate: s => { bar.style.transform = `scaleX(${s.progress})`; }
        }
      });
      tlp.to({}, { duration: 0.1 })                                   // hold on project 01
         .to(track, { x: () => -dist(), ease: 'none', duration: 1 }); // then slide sideways
    });
    mm.add('(max-width: 899px)', () => {
      gsap.from('.proj', { opacity: 0, y: 40, duration: 0.8, stagger: 0.1, scrollTrigger: { trigger: '#projects', start: 'top 70%' } });
    });
  }

  /* ------------------------------------------------------------------ *
   * CONTACT + FOOTER
   * ------------------------------------------------------------------ */
  function initContact() {
    gsap.from('.contact-title em', {
      yPercent: 110, duration: 1, stagger: 0.12, ease: 'power4.out',
      scrollTrigger: { trigger: '#contact', start: 'top 65%' }
    });
    gsap.from(['.contact-blurb', '.direct', '.contact-card'], {
      opacity: 0, y: 40, duration: 0.9, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '#contact', start: 'top 60%' }
    });

    const copy = $('#copy-email');
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(D.email); }
      catch (e) {
        const t = document.createElement('textarea'); t.value = D.email; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); } catch (_) { /* ignore */ } t.remove();
      }
      copy.textContent = 'Copied!';
      setTimeout(() => { copy.textContent = 'Copy Email'; }, 1600);
    });

    const form = $('#contact-form'), note = $('#form-note');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const f = new FormData(form);
      const name = (f.get('name') || '').trim(), email = (f.get('email') || '').trim(), msg = (f.get('message') || '').trim();
      if (!name || !email || !msg) { note.textContent = 'Please fill in all three fields.'; return; }
      if (!/^\S+@\S+\.\S+$/.test(email)) { note.textContent = 'That email address looks off.'; return; }
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${D.email}?subject=${subject}&body=${body}`;
      note.textContent = 'Opening your email app…';
      form.reset();
    });
  }

  function fitFooter() {
    const word = $('#foot-word'), box = $('.foot-giant');
    word.style.letterSpacing = '-0.01em';
    fitText(word, innerWidth * 0.97, 100, innerWidth * 0.4);
    box.style.height = Math.round(parseFloat(word.style.fontSize) * 0.86) + 'px';
  }

  /* ------------------------------------------------------------------ *
   * Loader + intro choreography
   * ------------------------------------------------------------------ */
  function playIntro() {
    const t = gsap.timeline({
      delay: 0.1,
      onComplete: () => { $('#loader').remove(); if (lenis) lenis.start(); }
    });
    gsap.set('#navbar', { y: -24 });
    t.to('.loader-bar', { scaleX: 1, duration: reduce ? 0.2 : 1, ease: 'power2.inOut' })
     .to('#loader', { yPercent: -100, duration: reduce ? 0.2 : 0.9, ease: 'power4.inOut' }, '+=0.1')
     .to('#navbar', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
     .from('#hero-name .ch', { yPercent: 70, opacity: 0, duration: 0.9, stagger: 0.05, ease: 'power4.out' }, '-=0.6')
     .from('#hero-sub-text', { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out' }, '-=0.5')
     .from('#slide-dashes button', { opacity: 0, scaleX: 0, duration: 0.5, stagger: 0.08 }, '-=0.4');
  }

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */
  // Count the stats up the first time they scroll into view
  function initStats() {
    $$('.stat b').forEach(el => {
      const end = +el.dataset.v, p = +el.dataset.pad, suf = el.dataset.suf || '', o = { v: 0 };
      gsap.to(o, {
        v: end, duration: 1.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate: () => { el.textContent = fmtStat(o.v, p, suf); }
      });
    });
  }

  // Highlight the nav link for the section currently on screen
  const SPY = [['#hero-section', '#hero-section'], ['#about', '#about'], ['#tech-stack', '#tech-stack'],
               ['#certificates', '#tech-stack'], ['#projects', '#projects'], ['#contact', '#contact']];
  const navLinks = $$('.nav-links a');
  let spyFrame = 0, spyCur = '';
  function updateSpy() {
    let cur = '';
    for (const [sel, link] of SPY) {
      const el = $(sel);
      if (!el) continue;
      if ((el.closest('.pin-spacer') || el).getBoundingClientRect().top <= innerHeight * 0.45) cur = link;
    }
    if (cur === spyCur) return;
    spyCur = cur;
    navLinks.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === cur));
  }

  renderStatic();
  initScroll();
  initSound();
  initHero();
  initTimeline();
  initStats();
  initTech();
  initProjects();
  initContact();
  fitFooter();
  playIntro();

  // main render loop (only paints what is on screen)
  gsap.ticker.add((time, dtMs) => {
    if (hero.active) { drawDust(); drawBurst(); }
    if (aurora.on) { if (tun.ok) drawTunnel(time, dtMs); else drawAurora(time); }
    if (++spyFrame % 8 === 0) updateSpy();
    // safety net: a viewport size change that fires no event at all still gets re-measured
    if (spyFrame % 24 === 0 && (innerWidth !== lastW || innerHeight !== lastH)) scheduleRelayout();
  });

  // re-measure once fonts arrive (text widths change)
  const refit = () => {
    fitHero();
    fitFooter();
    measureStages();
    techRender(tech.u);
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { refit(); layoutTimeline(); ScrollTrigger.refresh(); });
  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* Re-layout whenever the viewport size changes, however it changes. The pinned projects section is frozen to
   * pixel sizes by ScrollTrigger, so it must be re-measured after ANY size change — not only after a 'resize'
   * event (DevTools docking, fullscreen and zoom changes don't always fire one). A hidden full-screen probe +
   * ResizeObserver reports the true viewport size; visualViewport and window resize are kept as extra triggers. */
  let rz, lastW = innerWidth, lastH = innerHeight;
  const coarse = matchMedia('(pointer: coarse)');
  function relayout() {
    lastW = innerWidth; lastH = innerHeight;
    initDust(); initBurst(); initAurora(); sizeTunnel();
    refit();
    layoutTimeline();
    ScrollTrigger.refresh();
  }
  function scheduleRelayout() {
    clearTimeout(rz);
    rz = setTimeout(() => {
      const dw = Math.abs(innerWidth - lastW), dh = Math.abs(innerHeight - lastH);
      if (!dw && !dh) return;                                   // nothing actually changed
      if (coarse.matches && !dw && dh < 160) return;            // phone address bar sliding in/out — not a real resize
      relayout();
    }, 200);
  }
  const probe = document.createElement('div');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = 'position:fixed;inset:0;visibility:hidden;pointer-events:none;z-index:-1';
  document.body.appendChild(probe);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleRelayout).observe(probe);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', scheduleRelayout);
  window.addEventListener('resize', scheduleRelayout);
  window.addEventListener('orientationchange', scheduleRelayout);
})();
