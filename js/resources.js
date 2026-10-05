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
