/* ==========================================================================
   FIG. 1 — Closed-loop step response of a second-order system
   y(t) = 1 − e^(−ζωn t) / √(1−ζ²) · sin(ωd t + φ),  ωd = ωn√(1−ζ²),  φ = acos ζ
   Drag the damping ratio ζ to retune. Drawn as inline SVG, themed by CSS variables.
   ========================================================================== */
(function () {
    const fig = document.getElementById('step-figure');
    if (!fig) return;

    const svg = fig.querySelector('.fig-plot');
    const input = fig.querySelector('#zeta');
    const out = fig.querySelector('#zeta-out');
    const roOS = fig.querySelector('#ro-os');
    const roTP = fig.querySelector('#ro-tp');
    const roTS = fig.querySelector('#ro-ts');

    const NS = 'http://www.w3.org/2000/svg';
    const W = 560, H = 300;
    const M = { l: 40, r: 14, t: 14, b: 40 };
    const T_MAX = 4;       // s
    const Y_MAX = 1.6;
    const WN = 5;          // rad/s
    const BAND = 0.02;     // ±2 % settling band
    const SAMPLES = 320;

    const x = t => M.l + (t / T_MAX) * (W - M.l - M.r);
    const y = v => M.t + (1 - v / Y_MAX) * (H - M.t - M.b);

    function el(name, attrs, parent) {
        const node = document.createElementNS(NS, name);
        for (const k in attrs) node.setAttribute(k, attrs[k]);
        if (parent) parent.appendChild(node);
        return node;
    }

    function response(z, t) {
        if (z < 0.999) {
            const s = Math.sqrt(1 - z * z);
            return 1 - (Math.exp(-z * WN * t) / s) * Math.sin(WN * s * t + Math.acos(z));
        }
        return 1 - Math.exp(-WN * t) * (1 + WN * t); // critically damped
    }

    function metrics(z) {
        const under = z < 0.999;
        const s = Math.sqrt(Math.max(1 - z * z, 0));
        const os = under ? Math.exp((-z * Math.PI) / s) : 0;
        const tp = under ? Math.PI / (WN * s) : null;
        // Settling time: last instant the response leaves the ±2 % band (searched past the plot window).
        let ts = 0;
        const horizon = 12, n = 6000;
        for (let i = n; i >= 0; i--) {
            const t = (i / n) * horizon;
            if (Math.abs(response(z, t) - 1) > BAND) { ts = t; break; }
        }
        return { os, tp, ts };
    }

    /* ---------- static frame ---------- */
    svg.textContent = '';
    const frame = el('g', {}, svg);
    for (let t = 0; t <= T_MAX; t += 1) {
        el('line', { class: 'grid', x1: x(t), x2: x(t), y1: y(0), y2: y(Y_MAX) }, frame);
        const lbl = el('text', { x: x(t), y: y(0) + 18, 'text-anchor': t === 0 ? 'start' : 'middle' }, frame);
        lbl.textContent = t;
    }
    [0, 0.5, 1, 1.5].forEach(v => {
        el('line', { class: 'grid', x1: x(0), x2: x(T_MAX), y1: y(v), y2: y(v) }, frame);
        const lbl = el('text', { x: x(0) - 10, y: y(v) + 4, 'text-anchor': 'end' }, frame);
        lbl.textContent = v === 0 ? '0' : v.toFixed(1);
    });
    el('line', { class: 'axis', x1: x(0), x2: x(T_MAX), y1: y(0), y2: y(0) }, frame);
    el('line', { class: 'axis', x1: x(0), x2: x(0), y1: y(0), y2: y(Y_MAX) }, frame);
    const xTitle = el('text', { class: 'axis-title', x: x(T_MAX), y: H - 4, 'text-anchor': 'end' }, frame);
    xTitle.textContent = 'Time (s)';

    el('rect', { class: 'band', x: x(0), width: x(T_MAX) - x(0), y: y(1 + BAND), height: y(1 - BAND) - y(1 + BAND) }, svg);
    el('line', { class: 'setpoint', x1: x(0), x2: x(T_MAX), y1: y(1), y2: y(1) }, svg);
    const spLabel = el('text', { class: 'axis-title', x: x(T_MAX), y: y(1) - 8, 'text-anchor': 'end' }, svg);
    spLabel.textContent = 'Setpoint';

    const curve = el('path', { class: 'curve' }, svg);
    const markers = el('g', { class: 'markers' }, svg);
    const tsLine = el('line', { class: 'ts-line' }, markers);
    const tsDot = el('circle', { class: 'ts-dot', r: 5 }, markers);
    const tsLabel = el('text', { class: 'ts-label' }, markers);
    const peakDot = el('circle', { class: 'peak', r: 4.5 }, markers);
    const peakLabel = el('text', { class: 'peak-label' }, markers);

    /* ---------- dynamic ---------- */
    function draw(z) {
        let d = '';
        for (let i = 0; i <= SAMPLES; i++) {
            const t = (i / SAMPLES) * T_MAX;
            const v = Math.min(response(z, t), Y_MAX);
            d += (i ? 'L' : 'M') + x(t).toFixed(2) + ' ' + y(v).toFixed(2);
        }
        curve.setAttribute('d', d);

        const { os, tp, ts } = metrics(z);

        if (tp !== null && os > 0.004) {
            const py = 1 + os;
            peakDot.setAttribute('cx', x(tp)); peakDot.setAttribute('cy', y(py));
            peakLabel.setAttribute('x', x(tp) + 10); peakLabel.setAttribute('y', y(py) - 8);
            peakLabel.textContent = '+' + (os * 100).toFixed(1) + ' %';
            peakDot.style.display = peakLabel.style.display = '';
        } else {
            peakDot.style.display = peakLabel.style.display = 'none';
        }

        const tsc = Math.min(ts, T_MAX);
        const vts = response(z, tsc);
        tsLine.setAttribute('x1', x(tsc)); tsLine.setAttribute('x2', x(tsc));
        tsLine.setAttribute('y1', y(0)); tsLine.setAttribute('y2', y(vts));
        tsDot.setAttribute('cx', x(tsc)); tsDot.setAttribute('cy', y(vts));
        const nearEdge = x(tsc) > W - M.r - 30;
        tsLabel.setAttribute('x', nearEdge ? x(tsc) - 6 : x(tsc) + 6);
        tsLabel.setAttribute('text-anchor', nearEdge ? 'end' : 'start');
        tsLabel.setAttribute('y', y(0) - 8);
        tsLabel.textContent = 't';
        const sub = document.createElementNS(NS, 'tspan');
        sub.setAttribute('dy', '3');
        sub.setAttribute('font-size', '9');
        sub.textContent = 's';
        tsLabel.appendChild(sub);

        out.value = z.toFixed(2);
        out.textContent = z.toFixed(2);
        roOS.textContent = (os * 100).toFixed(1);
        roTP.textContent = tp === null ? 'none' : tp.toFixed(2);
        roTP.nextElementSibling.hidden = tp === null;
        roTS.textContent = ts.toFixed(2);
        input.setAttribute('aria-valuetext',
            `${z.toFixed(2)}: overshoot ${(os * 100).toFixed(1)} percent, settling time ${ts.toFixed(2)} seconds`);
    }

    input.addEventListener('input', () => draw(parseFloat(input.value)));
    draw(parseFloat(input.value));

    /* ---------- one orchestrated entrance: the curve traces itself ---------- */
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let len = 0;
    try { len = curve.getTotalLength(); } catch (e) { len = 0; }
    if (!reduce && len > 0) {
        svg.classList.add('is-drawing');
        curve.style.strokeDasharray = len;
        curve.style.strokeDashoffset = len;
        curve.getBoundingClientRect();
        curve.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.3,.7,.2,1) .25s';
        curve.style.strokeDashoffset = '0';
        const done = () => {
            curve.style.transition = curve.style.strokeDasharray = curve.style.strokeDashoffset = '';
            svg.classList.remove('is-drawing');
        };
        curve.addEventListener('transitionend', done, { once: true });
        setTimeout(done, 2200);
        input.addEventListener('input', done, { once: true });
    }
})();
