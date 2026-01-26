function $(sel, root = document) {
  return root.querySelector(sel);
}
function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

/* Typewriter */
document.addEventListener("DOMContentLoaded", () => {
  const el = $("#typewriter");
  if (!el) return;

  const text = el.dataset.text || "Hi! I'm Brandon.";
  let i = 0;

  const speed = prefersReducedMotion() ? 0 : 55;
  const cursorHold = prefersReducedMotion() ? 0 : 900;

  el.classList.add("typing");

  function type() {
    el.textContent = text.slice(0, i);
    i++;

    if (i <= text.length) {
      setTimeout(type, speed);
    } else {
      setTimeout(() => {
        el.classList.remove("typing");
        el.classList.add("done");
        const cta = $("#cta");
        if (cta) cta.classList.add("show");
      }, cursorHold);
    }
  }
  type();
});

/* Hamburger menu (top-right) */
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = $("#menuBtn");
  const langMenu = $("#langMenu");
  if (!menuBtn || !langMenu) return;

  function closeMenu() {
    langMenu.classList.remove("open");
    menuBtn.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    langMenu.setAttribute("aria-hidden", "true");
  }

  function toggleMenu() {
    const isOpen = langMenu.classList.toggle("open");
    menuBtn.classList.toggle("is-open", isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    langMenu.setAttribute("aria-hidden", String(!isOpen));
  }

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", () => closeMenu());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  langMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    const a = e.target.closest("a[data-filter]");
    if (!a) return;

    const filter = a.dataset.filter;
    setActiveFilter(filter);
    closeMenu();

    // OPTIONAL: if you don't want any toast, delete the next line:
    showToast(`Filter: ${filter}`);
  });
});

/* Smooth scroll center (with top special-case) */
document.addEventListener("DOMContentLoaded", () => {
  $all('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      // top should actually go to the top
      if (id === "#top") {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
        return;
      }

      const rect = target.getBoundingClientRect();
      const absoluteY = window.scrollY + rect.top;
      const scrollTo = absoluteY - window.innerHeight / 2 + rect.height / 2;

      window.scrollTo({ top: scrollTo, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    });
  });
});

/* Bridges + reveal ONLY (no dock active highlighting at all) */
document.addEventListener("DOMContentLoaded", () => {
  const bridges = $all(".bridge");
  const revealEls = $all(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-in")),
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  const bridgeObserver = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle("is-on", e.isIntersecting)),
    { threshold: 0.35 }
  );
  bridges.forEach((b) => bridgeObserver.observe(b));
});

/* Projects */
const PROJECTS = [
  {
    title: "personal website",
    tag: "Frontend",
    blurb: "In 2025, I built a custom website: <a href=\"https://abrandonwang.github.io/Portfolio/\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"project-link\">abrandonwang.github.io/Portfolio</a>",
    stack: ["HTML", "CSS", "JavaScript", "Accessibility"],
    details: `
      <ul>
        <li>Semantic layout + keyboard-friendly navigation</li>
        <li>IntersectionObserver reveal animations + section transitions</li>
        <li>Modal system with escape/backdrop close</li>
        <li>Reusable UI primitives (buttons, cards, pills)</li>
      </ul>
    `,
  },
  {
  title: "algorithm visualizer",
  tag: "Frontend",
  blurb: "Interactive visualizer for classic sorting + searching algorithm: <a href=\"https://abrandonwang.github.io/algorithm-visual/\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"project-link\">abrandonwang.github.io/algorithm-visual</a>",
  stack: ["HTML", "CSS", "JavaScript", "Algorithms", "UI State"],
  details: `
    <ul>
      <li>Visualizes multiple algorithms (Bubble/Selection/Insertion/Merge/Quick/Heap + Linear/Binary search)</li>
      <li>Playback system: play, pause, step, reset + adjustable speed</li>
      <li>Configurable inputs: random generation, manual array entry, and array size control</li>
      <li>Context panel with algorithm description, time/space complexity, and pseudocode for learning</li>
    </ul>
  `,
}
];

let ACTIVE_FILTER = "All";

function projectMatches(project, query, filter) {
  const q = (query || "").trim().toLowerCase();
  const text = `${project.title} ${project.tag} ${project.blurb} ${project.stack.join(" ")}`.toLowerCase();
  const okQuery = q === "" ? true : text.includes(q);
  const okFilter = filter === "All" ? true : project.tag === filter;
  return okQuery && okFilter;
}

function setActiveFilter(filter) {
  ACTIVE_FILTER = filter;
  $all(".seg-btn").forEach((b) => b.classList.toggle("is-active", b.dataset.filter === filter));
  renderProjects($("#projectsGrid"), $("#projectSearch")?.value || "", ACTIVE_FILTER);
}

function renderProjects(grid, query, filter) {
  if (!grid) return;
  const list = PROJECTS.filter((p) => projectMatches(p, query, filter));

  grid.innerHTML = list
    .map(
      (p, idx) => `
      <article class="proj" role="button" tabindex="0" data-proj="${idx}">
        <div class="proj-top">
          <div class="proj-title">${p.title}</div>
          <div class="proj-tag">${p.tag}</div>
        </div>
        <p class="proj-desc">${p.blurb}</p>
        <div class="proj-meta">
          ${p.stack.map((s) => `<span class="pill">${s}</span>`).join("")}
        </div>
      </article>
    `
    )
    .join("");

  $all(".proj", grid).forEach((card) => {
    const open = () => {
      const idx = Number(card.dataset.proj);
      const proj = list[idx];
      openModal(
        proj.title,
        `<p style="margin-top:0;color:rgba(255,255,255,0.78)">${proj.blurb}</p>${proj.details}
         <div style="margin-top:14px"><b>Stack:</b> ${proj.stack
           .map((s) => `<span class="pill" style="display:inline-block;margin:6px 6px 0 0">${s}</span>`)
           .join("")}</div>`
      );
    };

    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjects($("#projectsGrid"), "", ACTIVE_FILTER);

  $all(".seg-btn").forEach((btn) => btn.addEventListener("click", () => setActiveFilter(btn.dataset.filter)));

  const search = $("#projectSearch");
  if (search) search.addEventListener("input", () => renderProjects($("#projectsGrid"), search.value, ACTIVE_FILTER));
});

/* Courses */
const COURSES = {
  cs111: {
    title: "COMP-SCI 111 — Programming Fundamentals",
    bullets: [
      "Program design with clean function boundaries and consistent data representations.",
      "Recursion, testing, debugging strategies, and edge-case reasoning.",
      "Correctness-first mindset: constraints, invariants, and careful decomposition.",
    ],
    modal: `
      <ul>
        <li>Designing with data definitions + invariants</li>
        <li>Testing strategies and debugging discipline</li>
        <li>Readable style: naming, decomposition, refactoring</li>
      </ul>
    `,
  },
  cs214: {
    title: "COMP-SCI 214 — Data Structures & Algorithms",
    bullets: [
      "Implemented core DS and analyzed time/space complexity tradeoffs.",
      "Graph traversal, dynamic programming, and algorithm selection under constraints.",
      "Focused on clarity + performance with correctness reasoning.",
    ],
    modal: `
      <ul>
        <li>Complexity analysis and performance reasoning</li>
        <li>Data structure selection for real problems</li>
        <li>Correctness proofs via invariants and cases</li>
      </ul>
    `,
  },
  cs212: {
    title: "COMP-SCI 212 — Discrete Math for CS",
    bullets: [
      "Proof writing (induction, contradiction, direct proofs).",
      "Logic, sets, relations, combinatorics — foundations for CS correctness.",
      "Connecting formal reasoning to algorithms and complexity.",
    ],
    modal: `
      <ul>
        <li>Formal logic and translating statements precisely</li>
        <li>Counting arguments and discrete structures</li>
        <li>Reasoning foundations for correctness</li>
      </ul>
    `,
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const select = $("#course-select");
  const preview = $("#coursePreview");
  const openBtn = $("#openCourseBtn");
  if (!select || !preview || !openBtn) return;

  function renderPreview(value) {
    const c = COURSES[value];
    if (!c) {
      preview.innerHTML = `<div class="course-empty">Select a course to preview what you learned.</div>`;
      openBtn.disabled = true;
      return;
    }
    preview.innerHTML = `<h4>${c.title}</h4><ul>${c.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`;
    openBtn.disabled = false;
  }

  select.addEventListener("change", () => renderPreview(select.value));
  openBtn.addEventListener("click", () => {
    const c = COURSES[select.value];
    if (!c) return;
    openModal(c.title, c.modal);
  });
});

/* Modal with focus handling */
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
let lastFocus = null;

function getFocusable(container) {
  const selectors = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ];
  return Array.from(container.querySelectorAll(selectors.join(",")));
}

function openModal(title, html) {
  if (!modal || !modalTitle || !modalBody) return;
  lastFocus = document.activeElement;

  modalTitle.textContent = title;
  modalBody.innerHTML = html;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const panel = modal.querySelector(".modal-panel");
  const focusables = panel ? getFocusable(panel) : [];
  const closeBtn = modal.querySelector(".modal-close");
  (focusables[0] || closeBtn)?.focus?.();
}

function closeModal() {
  if (!modal || !modalTitle || !modalBody) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modalTitle.textContent = "";
  modalBody.innerHTML = "";
  document.body.style.overflow = "";

  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  lastFocus = null;
}

modal?.addEventListener("click", (e) => {
  if (e.target.matches("[data-close]")) closeModal();
});

window.addEventListener("keydown", (e) => {
  if (!modal?.classList.contains("open")) return;

  if (e.key === "Escape") {
    closeModal();
    return;
  }

  if (e.key === "Tab") {
    const panel = modal.querySelector(".modal-panel");
    if (!panel) return;
    const focusables = getFocusable(panel);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  $all("[data-modal-content]").forEach((section) => {
    section.addEventListener("click", (e) => {
      if (e.target.closest("a, button, select, option, input, textarea, label")) return;

      const title = section.getAttribute("data-modal-title") || "Details";
      const templateSelector = section.getAttribute("data-modal-content");
      const tpl = document.querySelector(templateSelector);

      if (!tpl) {
        const card = section.querySelector(".card-inner") || section;
        openModal(title, card.innerHTML);
        return;
      }

      openModal(title, tpl.innerHTML);
    });

    section.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        section.click();
      }
    });
  });
});

/* ===== Footer cursor glow + magnetic links ===== */
document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector(".cursor-footer");
  const glow = footer?.querySelector(".footer-glow");
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  if (!footer || !glow) return;

  // Disable on touch devices (cursor doesn't make sense)
  const isTouch = window.matchMedia?.("(pointer: coarse)")?.matches;
  if (isTouch) return;

  let raf = 0;
  let x = 0, y = 0;         // target
  let sx = 0, sy = 0;       // smoothed

  const reduce = prefersReducedMotion();
  const ease = reduce ? 1 : 0.14;

  function animate() {
    raf = 0;
    sx += (x - sx) * ease;
    sy += (y - sy) * ease;

    footer.style.setProperty("--gx", `${sx}%`);
    footer.style.setProperty("--gy", `${sy}%`);

    if (!reduce) raf = requestAnimationFrame(animate);
  }

  function handleMove(e) {
    const rect = footer.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    x = Math.max(0, Math.min(100, px));
    y = Math.max(0, Math.min(100, py));

    if (!raf) {
      footer.classList.add("is-hovering");
      raf = reduce ? requestAnimationFrame(animate) : requestAnimationFrame(animate);
    }
  }

  function handleLeave() {
    footer.classList.remove("is-hovering");
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  footer.addEventListener("mousemove", handleMove);
  footer.addEventListener("mouseenter", handleMove);
  footer.addEventListener("mouseleave", handleLeave);

  // Magnetic links (subtle)
  const magnets = Array.from(footer.querySelectorAll(".magnetic"));
  magnets.forEach((a) => {
    a.addEventListener("mousemove", (e) => {
      if (reduce) return;
      const r = a.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      a.style.transform = `translate(${mx * 0.06}px, ${my * 0.06}px)`;
    });

    a.addEventListener("mouseleave", () => {
      a.style.transform = "";
    });
  });
});
