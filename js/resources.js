/*
 * RESOURCES CONTENT
 * Three practical resource categories, with starter examples ready to replace
 * with personal links/files when they are available.
 */
const RESOURCES = {
    articles: [
        { kind: "Technical note", title: "From MiL to HiL: a practical validation path", date: "2026-01-15", description: "A concise engineering note on keeping model assumptions, requirements and test evidence aligned across validation stages.", tags: ["MBD", "MiL / SiL / HiL"] },
        { kind: "Engineering note", title: "Thinking in powertrain energy flows", date: "2025-11-10", description: "A short reflection on connecting system-level energy flows with control and simulation decisions.", tags: ["Powertrain", "Energy"] }
    ],
    documents: [
        { kind: "Template", title: "Powertrain model review checklist", description: "A starter checklist for reviewing model structure, assumptions, interfaces and validation evidence before a design review.", tags: ["Simulink", "Validation"] },
        { kind: "Cheat sheet", title: "Embedded control test map", description: "A compact map of requirements, unit tests, MiL, SiL and HiL activities for embedded control development.", tags: ["Embedded", "V-model"] }
    ],
    recommendations: [
        { kind: "Tool", title: "Capella / Arcadia", description: "A useful systems-engineering environment for exploring operational, system, logical and physical architectures.", tags: ["MBSE", "Systems Engineering"] },
        { kind: "Learning", title: "MATLAB & Simulink documentation", description: "A practical reference for deepening modeling, simulation and control-development workflows.", tags: ["MATLAB", "Simulink"] }
    ]
};


function openResource(category, index) {
  const item = (RESOURCES[category] || [])[index];
  if (!item) return;
  const title = document.getElementById('resource-detail-title');
  const kind = document.getElementById('resource-detail-kind');
  const description = document.getElementById('resource-detail-description');
  const tags = document.getElementById('resource-detail-tags');
  const link = document.getElementById('resource-detail-link');
  if (title) title.textContent = item.title;
  if (kind) kind.textContent = item.kind || 'Resource';
  if (description) description.textContent = item.description || item.text || 'Personal resource.';
  if (tags) tags.textContent = (item.tags || []).join(' · ');
  if (link) {
    if (item.url) { link.href = item.url; link.style.display = ''; link.target = /^https?:\/\//.test(item.url) ? '_blank' : ''; }
    else { link.style.display = 'none'; }
  }
  switchView('resource-detail');
}
