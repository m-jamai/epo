/* ==========================================================================
   NAVIGATION
   Hash routes keep every view shareable and make the back button work:
   #/  #/profile  #/profile/education  #/experiences  #/projects  #/resources  #/contact  #/terms
   ========================================================================== */

const VIEWS = ['landing', 'profile', 'experiences', 'projects', 'resources', 'contact', 'terms'];
const SPY_ANCHORS = ['education', 'certifications']; // sub-sections of Profile shown in the nav

function parseRoute() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const view = VIEWS.includes(parts[0]) ? parts[0] : 'landing';
    return { view, anchor: parts[1] || null };
}

function setActiveNav(view, anchor) {
    document.querySelectorAll('.nav-link[data-view]').forEach(link => {
        const match = link.dataset.view === view && (link.dataset.anchor || null) === (anchor || null);
        if (match) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
}

function showView(view, anchor, { moveFocus = true } = {}) {
    const target = document.getElementById(`view-${view}`);
    if (!target) return;

    document.querySelectorAll('.view').forEach(sec => sec.classList.toggle('is-active', sec === target));
    setActiveNav(view, anchor);
    document.title = target.dataset.title || document.title;
    closeMobileMenu();

    const anchorEl = anchor ? document.getElementById(anchor) : null;
    if (anchorEl) {
        requestAnimationFrame(() => anchorEl.scrollIntoView({ block: 'start' }));
    } else {
        window.scrollTo(0, 0);
    }

    if (moveFocus) {
        const heading = anchorEl || target.querySelector('h1');
        if (heading) {
            if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
            heading.focus({ preventScroll: true });
        }
    }
}

function route(options) {
    const { view, anchor } = parseRoute();
    showView(view, anchor, options);
}

window.addEventListener('hashchange', () => route());
document.addEventListener('DOMContentLoaded', () => route({ moveFocus: false }));

// Clicking the link of the route you are already on should still take you there.
document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#/"]');
    if (link && link.getAttribute('href') === (location.hash || '#/')) {
        event.preventDefault();
        route();
    }
});

// Kept for backwards compatibility with any old onclick="switchView('profile')" calls.
window.switchView = function (view, anchor) {
    location.hash = view === 'landing' ? '#/' : `#/${view}${anchor ? '/' + anchor : ''}`;
};

/* Profile scroll-spy: highlights Education / Certifications in the nav while you read them. */
let spyTicking = false;
window.addEventListener('scroll', () => {
    if (spyTicking) return;
    spyTicking = true;
    requestAnimationFrame(() => {
        spyTicking = false;
        if (parseRoute().view !== 'profile') return;
        const line = window.innerHeight * 0.35;
        let current = null;
        SPY_ANCHORS.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top < line) current = id;
        });
        setActiveNav('profile', current);
    });
}, { passive: true });

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */
const mobileHeader = document.getElementById('mobile-header');
const menuToggle = document.getElementById('menu-toggle');

function closeMobileMenu() {
    if (!mobileHeader || !menuToggle) return;
    mobileHeader.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = 'Menu';
}

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const open = mobileHeader.classList.toggle('menu-open');
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.textContent = open ? 'Close' : 'Menu';
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && mobileHeader.classList.contains('menu-open')) {
            closeMobileMenu();
            menuToggle.focus();
        }
    });
}

/* ==========================================================================
   SMALL DETAILS: local time in Toulouse, footer year, copy email
   ========================================================================== */
const timeFormat = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' });
function updateLocalTime() {
    const now = timeFormat.format(new Date());
    document.querySelectorAll('.js-local-time').forEach(el => { el.textContent = now; });
}
updateLocalTime();
setInterval(updateLocalTime, 30000);

document.querySelectorAll('.js-year').forEach(el => { el.textContent = new Date().getFullYear(); });

const copyButton = document.getElementById('copy-email');
const copyStatus = document.getElementById('copy-status');
if (copyButton) {
    copyButton.addEventListener('click', async () => {
        const email = copyButton.dataset.email;
        try {
            await navigator.clipboard.writeText(email);
            copyStatus.textContent = 'Address copied to your clipboard.';
        } catch (err) {
            copyStatus.textContent = `Copy failed. The address is ${email}.`;
        }
        clearTimeout(copyButton._t);
        copyButton._t = setTimeout(() => { copyStatus.textContent = ''; }, 4000);
    });
}

/* ==========================================================================
   RESOURCES — built from RESOURCES (see js/resources.js)
   ========================================================================== */
const RESOURCE_CATEGORIES = [
    { key: 'articles', title: 'Articles and notes', description: 'Technical write-ups, working notes and reflections.', defaultLink: 'Read' },
    { key: 'documents', title: 'Documents and tools', description: 'Templates, cheat sheets, scripts and models to reuse.', defaultLink: 'Download' },
    { key: 'recommendations', title: 'Recommendations', description: 'Tools, books and references worth your time.', defaultLink: 'Visit' }
];

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function formatDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return escapeHTML(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function renderResourceItem(item, category) {
    const isExternal = item.url && /^https?:\/\//.test(item.url);
    const label = item.linkLabel || category.defaultLink;
    const tags = (item.tags || []).map(t => `<li>${escapeHTML(t)}</li>`).join('');
    const download = category.key === 'documents' && item.url && !isExternal ? ' download' : '';
    const target = isExternal ? ' target="_blank" rel="noopener"' : '';

    return `
        <article class="resource-item">
            <p class="resource-meta">
                ${item.kind ? `<span class="resource-kind">${escapeHTML(item.kind)}</span>` : ''}
                ${item.date ? `<time class="resource-date" datetime="${escapeHTML(item.date)}">${formatDate(item.date)}</time>` : ''}
            </p>
            <h3 class="resource-title">${escapeHTML(item.title)}</h3>
            ${item.description ? `<p class="resource-desc">${escapeHTML(item.description)}</p>` : ''}
            ${item.text ? `<p class="resource-desc">${escapeHTML(item.text)}</p>` : ''}
            ${tags ? `<ul class="tags">${tags}</ul>` : ''}
            ${item.url ? `<a class="resource-link" href="${escapeHTML(item.url)}"${target}${download}>${escapeHTML(label)}</a>` : ''}
        </article>`;
}

function renderResources() {
    const jump = document.getElementById('resource-jump');
    const blocks = document.getElementById('resource-blocks');
    if (!jump || !blocks) return;

    const data = typeof RESOURCES !== 'undefined' ? RESOURCES : {};
    const prepared = RESOURCE_CATEGORIES.map(category => {
        const items = (data[category.key] || [])
            .filter(item => item && item.title)
            .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        return { category, items };
    });

    jump.innerHTML = prepared.map(({ category, items }) => `
        <button type="button" data-target="resources-${category.key}">
            ${category.title}<span class="count">${items.length}</span>
        </button>`).join('');

    jump.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    blocks.innerHTML = prepared.map(({ category, items }) => `
        <section class="resource-block" id="resources-${category.key}" aria-labelledby="rh-${category.key}">
            <h2 class="section-title" id="rh-${category.key}">${category.title}</h2>
            <p class="section-lede">${category.description}</p>
            <div class="resource-list">
                ${items.length
                    ? items.map(item => renderResourceItem(item, category)).join('')
                    : '<p class="resource-empty">New entries are on the way.</p>'}
            </div>
        </section>`).join('');
}

renderResources();
