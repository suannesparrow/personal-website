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
nav?.querySelectorAll("a[href^='#']").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const navLinks = [...document.querySelectorAll("[data-nav]")];
const navSections = [...document.querySelectorAll("[data-section]")];
let activeFrame = 0;
function updateActiveSection() {
  activeFrame = 0;
  let activeId = "";
  const threshold = Math.max(110, window.innerHeight * 0.3);
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

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const aboutVisual = document.querySelector(".about-visual");
const slides = [...document.querySelectorAll(".about-slide")];
const photoCount = aboutVisual?.querySelector("[data-photo-count]");
const photoToggle = aboutVisual?.querySelector("[data-photo-toggle]");
const photoToggleLabel = photoToggle?.querySelector("[data-photo-toggle-label]");
const photoToggleIcon = photoToggle?.querySelector(".photo-toggle-icon");
let slideIndex = 0;
let slideTimer;
let rotationPaused = reducedMotion;
function showSlide(index) {
  if (!slides.length) return;
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    const active = i === slideIndex;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
  });
  if (photoCount) photoCount.textContent = `${slideIndex + 1} / ${slides.length}`;
}
function startSlideRotation(userInitiated = false) {
  if (rotationPaused || slides.length < 2 || slideTimer || document.hidden || (!userInitiated && (aboutVisual?.matches(":hover") || aboutVisual?.contains(document.activeElement)))) return;
  slideTimer = window.setInterval(() => showSlide(slideIndex + 1), 5000);
}
function stopSlideRotation() {
  window.clearInterval(slideTimer);
  slideTimer = undefined;
}
if (aboutVisual && slides.length > 1) {
  aboutVisual.querySelector("[data-photo-previous]")?.addEventListener("click", () => showSlide(slideIndex - 1));
  aboutVisual.querySelector("[data-photo-next]")?.addEventListener("click", () => showSlide(slideIndex + 1));
  const syncPhotoToggle = () => {
    const label = rotationPaused ? "Play" : "Pause";
    if (photoToggleLabel) photoToggleLabel.textContent = label;
    if (photoToggleIcon) photoToggleIcon.textContent = rotationPaused ? "▶" : "Ⅱ";
    photoToggle?.setAttribute("aria-label", `${label} photo rotation`);
  };
  syncPhotoToggle();
  photoToggle?.addEventListener("click", () => {
    rotationPaused = !rotationPaused;
    if (rotationPaused) stopSlideRotation();
    else startSlideRotation(true);
    syncPhotoToggle();
  });
  aboutVisual.addEventListener("mouseenter", stopSlideRotation);
  aboutVisual.addEventListener("mouseleave", startSlideRotation);
  aboutVisual.addEventListener("focusin", stopSlideRotation);
  aboutVisual.addEventListener("focusout", startSlideRotation);
  document.addEventListener("visibilitychange", () => document.hidden ? stopSlideRotation() : startSlideRotation());
  if (!reducedMotion) {
    rotationPaused = false;
    syncPhotoToggle();
    startSlideRotation();
  }
}

if (!reducedMotion && "IntersectionObserver" in window) {
  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  document.body.classList.add("reveal-ready");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));
}

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
