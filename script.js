const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

function closeMenu() {
  if (!menuButton || !nav) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  nav?.classList.toggle("is-open", !isOpen);
});

nav?.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const navLinks = [...document.querySelectorAll("[data-nav]")];
const navSections = [...document.querySelectorAll("[data-section]")];
let activeFrame = 0;

function updateActiveSection() {
  activeFrame = 0;
  let activeId = "";
  const threshold = Math.max(100, window.innerHeight * 0.28);
  for (const section of navSections) {
    if (section.getBoundingClientRect().top <= threshold) activeId = section.dataset.section;
  }
  navLinks.forEach((link) => {
    const active = link.dataset.nav === activeId;
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
    link.classList.toggle("is-active", active);
  });
}

window.addEventListener("scroll", () => {
  if (!activeFrame) activeFrame = window.requestAnimationFrame(updateActiveSection);
}, { passive: true });
window.addEventListener("resize", updateActiveSection);
updateActiveSection();

document.querySelectorAll("[data-open-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.openProject);
    if (dialog instanceof HTMLDialogElement && !dialog.open) dialog.showModal();
  });
});

document.querySelectorAll(".project-dialog").forEach((dialog) => {
  dialog.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    dialog.querySelectorAll(".pdf-embed").forEach((details) => {
      const frame = details.querySelector("iframe[data-pdf-src]");
      if (frame?.hasAttribute("src")) frame.removeAttribute("src");
      details.open = false;
    });
  });
  dialog.querySelectorAll(".pdf-embed").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (!details.open) return;
      const frame = details.querySelector("iframe[data-pdf-src]");
      if (frame && !frame.hasAttribute("src")) frame.src = frame.dataset.pdfSrc;
    });
  });
});
