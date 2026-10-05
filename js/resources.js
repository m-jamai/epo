/*
 * RESOURCES CONTENT
 * -----------------
 * The Resources page has three categories. Add your entries in the matching
 * list below: one block { ... } per entry, separated by commas.
 * Newest entries (by date) are shown first. An empty list shows "Nothing here yet".
 *
 *   articles         Your own writing: technical articles, notes, reflections
 *   documents        Files and tools you share: PDFs, templates, cheat sheets,
 *                    scripts, Simulink models (put files in assets/resources/)
 *   recommendations  Books, courses, websites, videos you recommend
 *
 * Fields
 *   title        required
 *   kind         optional  Small label, e.g. "Article", "Note", "PDF", "Template",
 *                          "Script", "Book", "Course", "Website", "Video"
 *   date         optional  "YYYY-MM-DD"
 *   description  optional  One or two sentences
 *   text         optional  Longer text shown in full (good for notes)
 *   url          optional  External link or "assets/resources/your-file.pdf"
 *   linkLabel    optional  Text of the link (default: Read / Download / Visit)
 *   tags         optional  ["Simulink", "Battery"]
 *
 * Examples — copy one into a list and edit it:
 *
 *   { kind: "Article", title: "How I structure MiL / SiL / HiL test loops",
 *     date: "2026-10-01", description: "The method I use on powertrain projects.",
 *     url: "https://www.linkedin.com/pulse/your-article", tags: ["MBD"] },
 *
 *   { kind: "Note", title: "A short reflection", date: "2026-09-20",
 *     text: "Write your note here.\nLine breaks are kept." },
 *
 *   { kind: "Template", title: "Battery cell parameter sheet",
 *     description: "PDF I use to collect cell parameters.",
 *     url: "assets/resources/battery-parameter-sheet.pdf" },
 *
 *   { kind: "Book", title: "Book title — Author",
 *     description: "Why it is worth reading.", url: "https://example.com" },
 */

const RESOURCES = {
    articles: [
        // Your articles and notes
    ],
    documents: [
        // Your documents, templates and tools
    ],
    recommendations: [
        // Books, courses and links you recommend
    ]
};
