/* ==========================================================================
   NAVIGATION — Profile (logo + name), Experiences, Projects, Resources, Contact
   ========================================================================== */

function switchView(viewName, scrollTarget) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active-view'));

    const activeTarget = document.getElementById(`view-${viewName}`);
    if (activeTarget) activeTarget.classList.add('active-view');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.view === viewName && (!scrollTarget || link.dataset.scroll === scrollTarget));
    });

    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (scrollTarget && activeTarget) {
        const anchor = document.getElementById(scrollTarget);
        if (anchor) {
            setTimeout(() => anchor.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
        }
    }
}

// Start at the minimal landing page.
document.addEventListener('DOMContentLoaded', () => {
    switchView('landing');
});

/* Phone menu (below 600 px) */
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
}

/* ==========================================================================
   RESOURCES — built from RESOURCES (see js/resources.js)
   ========================================================================== */

const RESOURCE_CATEGORIES = [
    {
        key: 'articles',
        title: 'Articles & Notes',
        description: 'My own write-ups: technical articles, notes and reflections.',
        defaultLink: 'Read'
    },
    {
        key: 'documents',
        title: 'Documents & Tools',
        description: 'Files I share: templates, cheat sheets, scripts and models.',
        defaultLink: 'Download'
    },
    {
        key: 'recommendations',
        title: 'Recommendations',
        description: 'Books, courses and links I recommend.',
        defaultLink: 'Visit'
    }
];

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

function formatDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return escapeHTML(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function renderResourceItem(item, category, itemIndex) {
    const isExternal = item.url && /^https?:\/\//.test(item.url);
    const label = item.linkLabel || category.defaultLink;
    const tags = (item.tags || []).map(t => `<li>${escapeHTML(t)}</li>`).join('');
    const download = category.key === 'documents' && item.url && !isExternal ? ' download' : '';
    const target = isExternal ? ' target="_blank" rel="noopener"' : '';

    return `
        <article class="resource-item">
            <div>
                ${item.kind ? `<div class="resource-kind">${escapeHTML(item.kind)}</div>` : ''}
                ${item.date ? `<div class="resource-date">${formatDate(item.date)}</div>` : ''}
            </div>
            <div>
                <div class="resource-title"><a href="#" class="resource-title-link" onclick="openResource('${category.key}', ${itemIndex}); return false;">${escapeHTML(item.title)}</a></div>
                ${item.description ? `<div class="resource-desc">${escapeHTML(item.description)}</div>` : ''}
                ${item.text ? `<div class="resource-text">${escapeHTML(item.text)}</div>` : ''}
                ${tags ? `<ul class="skill-tags resource-tags">${tags}</ul>` : ''}
            </div>
            <div>
                ${item.url ? `<a class="resource-link" href="${escapeHTML(item.url)}"${target}${download}>${escapeHTML(label)}</a>` : ''}
            </div>
        </article>`;
}

function renderResources() {
    const jump = document.getElementById('resource-jump');
    const blocks = document.getElementById('resource-blocks');
    if (!jump || !blocks) return;

    const data = typeof RESOURCES !== 'undefined' ? RESOURCES : {};

    const prepared = RESOURCE_CATEGORIES.map((category, i) => {
        const items = (data[category.key] || [])
            .filter(item => item && item.title)
            .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        return { category, items, index: String(i + 1).padStart(2, '0') };
    });

    jump.innerHTML = prepared.map(({ category, items, index }) => `
        <button class="resource-jump-item" data-target="resources-${category.key}">
            <div class="resource-jump-index">${index}</div>
            <div class="resource-jump-title">${category.title}</div>
            <div class="resource-jump-count">${items.length} ${items.length === 1 ? 'entry' : 'entries'}</div>
        </button>`).join('');

    jump.querySelectorAll('.resource-jump-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    blocks.innerHTML = prepared.map(({ category, items, index }) => `
        <section class="resource-block" id="resources-${category.key}">
            <div class="resource-block-head">
                <span class="resource-block-index">${index}</span>
                <h2 class="resource-block-title">${category.title}</h2>
            </div>
            <p class="resource-block-desc">${category.description}</p>
            <div class="resource-list">
                ${items.length
                    ? items.map((item, itemIndex) => renderResourceItem(item, category, itemIndex)).join('')
                    : '<div class="resource-empty">Nothing here yet.</div>'}
            </div>
        </section>`).join('');
}

renderResources();
