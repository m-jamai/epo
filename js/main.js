/* ==========================================================================
   NAVIGATION
   Every view has a shareable URL and the back button works:
   #/  #/profile  #/profile/education  #/experiences  #/projects  #/projects/zoe
   #/resources  #/resources/articles/0  #/contact  #/terms
   ========================================================================== */

const VIEWS = ['landing', 'profile', 'experiences', 'projects', 'resources', 'contact', 'terms'];
const PROJECT_PAGES = ['zoe', 'brushless', 'pmsm'];
const SPY_ANCHORS = ['education', 'certifications']; // Profile sub-sections shown in the nav

function parseRoute() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    const top = VIEWS.includes(parts[0]) ? parts[0] : 'landing';

    if (top === 'projects' && PROJECT_PAGES.includes(parts[1])) {
        return { view: `project-${parts[1]}`, nav: 'projects' };
    }
    if (top === 'resources' && parts[1] && parts[2] !== undefined) {
        return { view: 'resource-detail', nav: 'resources', resource: { category: parts[1], index: Number(parts[2]) } };
    }
    if (top === 'profile' && SPY_ANCHORS.includes(parts[1])) {
        return { view: 'profile', nav: 'profile', anchor: parts[1] };
    }
    return { view: top, nav: top };
}

function setActiveNav(nav, anchor) {
    document.querySelectorAll('.nav-link[data-nav]').forEach(link => {
        const match = link.dataset.nav === nav && (link.dataset.anchor || null) === (anchor || null);
        if (match) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
}

function showView(route, { moveFocus = true } = {}) {
    if (route.resource && !fillResourceDetail(route.resource)) {
        location.replace('#/resources');
        return;
    }

    const target = document.getElementById(`view-${route.view}`);
    if (!target) return;

    document.querySelectorAll('.view').forEach(sec => sec.classList.toggle('is-active', sec === target));
    setActiveNav(route.nav, route.anchor);
    document.title = target.dataset.title || document.title;
    closeMobileMenu();

    const anchorEl = route.anchor ? document.getElementById(route.anchor) : null;
    if (anchorEl) requestAnimationFrame(() => anchorEl.scrollIntoView({ block: 'start' }));
    else window.scrollTo(0, 0);

    if (moveFocus) {
        const heading = anchorEl || target.querySelector('h1');
        if (heading) {
            if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
            heading.focus({ preventScroll: true });
        }
    }
}

function route(options) { showView(parseRoute(), options); }

window.addEventListener('hashchange', () => route());
document.addEventListener('DOMContentLoaded', () => route({ moveFocus: false }));

// Clicking the link of the page you are already on still takes you to its top.
document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#/"]');
    if (link && link.getAttribute('href') === (location.hash || '#/')) {
        event.preventDefault();
        route();
    }
});

// Backwards compatibility with older onclick="switchView('profile')" calls.
window.switchView = function (view, anchor) {
    if (view.startsWith('project-')) { location.hash = `#/projects/${view.slice(8)}`; return; }
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
        // Near the bottom of the page the last sections can't reach the top, so widen the line.
        const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
        const line = window.innerHeight * (atBottom ? 0.9 : 0.35);
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
            copyStatus.textContent = 'Copied to clipboard';
        } catch (err) {
            copyStatus.textContent = 'Copy failed. Select the address instead.';
        }
        clearTimeout(copyButton._t);
        copyButton._t = setTimeout(() => { copyStatus.textContent = ''; }, 3000);
    });
}

/* ==========================================================================
   RESOURCES — built from RESOURCES (see js/resources.js)
   ========================================================================== */
const RESOURCE_CATEGORIES = [
    { key: 'articles', title: 'Articles and notes', description: 'My own write-ups: technical articles, notes and reflections.', defaultLink: 'Read' },
    { key: 'documents', title: 'Documents and tools', description: 'Files I share: templates, cheat sheets, scripts and models.', defaultLink: 'Download' },
    { key: 'recommendations', title: 'Recommendations', description: 'Books, courses and links I recommend.', defaultLink: 'Visit' }
];

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function formatDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return escapeHTML(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function resourceData() { return typeof RESOURCES !== 'undefined' ? RESOURCES : {}; }

function linkAttributes(item, category) {
    const isExternal = /^https?:\/\//.test(item.url || '');
    const download = category.key === 'documents' && item.url && !isExternal ? ' download' : '';
    const target = isExternal ? ' target="_blank" rel="noopener"' : '';
    return { isExternal, download, target };
}

function renderResourceItem(item, index, category) {
    const tags = (item.tags || []).map(t => `<li>${escapeHTML(t)}</li>`).join('');
    const detailHref = `#/resources/${category.key}/${index}`;
    const { download, target } = linkAttributes(item, category);
    return `
        <article class="resource-item">
            <p class="resource-meta">
                ${item.kind ? `<span class="resource-kind">${escapeHTML(item.kind)}</span>` : ''}
                ${item.date ? `<time class="resource-date" datetime="${escapeHTML(item.date)}">${formatDate(item.date)}</time>` : ''}
            </p>
            <h3 class="resource-title"><a href="${detailHref}">${escapeHTML(item.title)}</a></h3>
            ${item.description ? `<p class="resource-desc">${escapeHTML(item.description)}</p>` : ''}
            ${item.text ? `<p class="resource-desc">${escapeHTML(item.text)}</p>` : ''}
            ${tags ? `<ul class="tags">${tags}</ul>` : ''}
            ${item.url ? `<a class="resource-link" href="${escapeHTML(item.url)}"${target}${download}>${escapeHTML(item.linkLabel || category.defaultLink)}</a>` : ''}
        </article>`;
}

function renderResources() {
    const jump = document.getElementById('resource-jump');
    const blocks = document.getElementById('resource-blocks');
    if (!jump || !blocks) return;

    const data = resourceData();
    const prepared = RESOURCE_CATEGORIES.map(category => {
        // Keep each item's original position so detail links stay stable after sorting by date.
        const items = (data[category.key] || [])
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => item && item.title)
            .sort((a, b) => (b.item.date || '').localeCompare(a.item.date || ''));
        return { category, items };
    });

    jump.innerHTML = prepared.map(({ category, items }) => `
        <button type="button" data-target="resources-${category.key}">
            <span class="title">${category.title}</span>
            <span class="count">${items.length} ${items.length === 1 ? 'entry' : 'entries'}</span>
        </button>`).join('');

    jump.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    blocks.innerHTML = prepared.map(({ category, items }) => `
        <section class="resource-block" id="resources-${category.key}" aria-labelledby="rh-${category.key}">
            <h2 class="section-label" id="rh-${category.key}">${category.title}</h2>
            <p class="section-lede">${category.description}</p>
            <div class="resource-list">
                ${items.length
                    ? items.map(({ item, index }) => renderResourceItem(item, index, category)).join('')
                    : '<p class="resource-empty">New entries are on the way.</p>'}
            </div>
        </section>`).join('');
}

function fillResourceDetail({ category, index }) {
    const cat = RESOURCE_CATEGORIES.find(c => c.key === category);
    const item = (resourceData()[category] || [])[index];
    if (!cat || !item) return false;

    const view = document.getElementById('view-resource-detail');
    document.getElementById('resource-detail-title').textContent = item.title;
    document.getElementById('resource-detail-kind').textContent =
        [item.kind || 'Resource', item.date ? formatDate(item.date) : ''].filter(Boolean).join(', ');
    document.getElementById('resource-detail-description').textContent = item.description || item.text || '';
    document.getElementById('resource-detail-tags').innerHTML =
        (item.tags || []).map(t => `<li>${escapeHTML(t)}</li>`).join('');

    const link = document.getElementById('resource-detail-link');
    if (item.url) {
        const { isExternal } = linkAttributes(item, cat);
        link.href = item.url;
        document.getElementById('resource-detail-link-text').textContent = item.linkLabel || cat.defaultLink;
        link.target = isExternal ? '_blank' : '';
        link.rel = isExternal ? 'noopener' : '';
        if (cat.key === 'documents' && !isExternal) link.setAttribute('download', '');
        else link.removeAttribute('download');
        link.parentElement.hidden = false;
    } else {
        link.parentElement.hidden = true;
    }
    view.dataset.title = `${item.title}, Mohammed Jamai`;
    return true;
}

renderResources();
