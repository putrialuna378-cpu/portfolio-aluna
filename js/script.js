const themeToggle = document.querySelector(".theme-toggle");
let savedTheme = null;

try {
  savedTheme = localStorage.getItem("portfolio-theme");
} catch {
  savedTheme = null;
}

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  if (!themeToggle) return;

  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-label", isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap");
  themeToggle.setAttribute("title", isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap");
  themeToggle.querySelector("span").textContent = isDark ? "☀" : "☾";
};

applyTheme(savedTheme === "dark" ? "dark" : "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch {}
  });
}

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Buka menu" : "Tutup menu");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Buka menu");
      navigation.classList.remove("is-open");
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card) => {
  const toggleButton = card.querySelector(".project-toggle");
  const toggleDetail = () => {
    const isExpanded = card.classList.toggle("is-expanded");
    if (toggleButton) {
      toggleButton.setAttribute("aria-expanded", String(isExpanded));
      toggleButton.textContent = isExpanded ? "Sembunyikan detail " : "Lihat detail ";
      const arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = isExpanded ? "↘" : "↗";
      toggleButton.innerHTML = `${isExpanded ? "Sembunyikan detail" : "Lihat detail"} <span aria-hidden="true">${isExpanded ? "↘" : "↗"}</span>`;
    }
  };

  card.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      event.preventDefault();
      toggleDetail();
      return;
    }

    toggleDetail();
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleDetail();
    }
  });
});

const hero = document.querySelector(".hero");
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (hero && hasFinePointer && !prefersReducedMotion) {
  let pointerX = 0;
  let pointerY = 0;
  let animationFrame = 0;

  hero.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;

    if (animationFrame) return;

    animationFrame = requestAnimationFrame(() => {
      const bounds = hero.getBoundingClientRect();
      const horizontal = ((pointerX - bounds.left) / bounds.width) * 2 - 1;
      const vertical = ((pointerY - bounds.top) / bounds.height) * 2 - 1;

      hero.style.setProperty("--visual-shift-x", `${horizontal * 10}px`);
      hero.style.setProperty("--visual-shift-y", `${vertical * 8}px`);
      hero.style.setProperty("--wash-shift-x", `${horizontal * -7}px`);
      hero.style.setProperty("--wash-shift-y", `${vertical * -5}px`);
      animationFrame = 0;
    });
  }, { passive: true });

  hero.addEventListener("pointerleave", () => {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    hero.style.removeProperty("--visual-shift-x");
    hero.style.removeProperty("--visual-shift-y");
    hero.style.removeProperty("--wash-shift-x");
    hero.style.removeProperty("--wash-shift-y");
  });
}

if (hasFinePointer && !prefersReducedMotion) {
  const cursorFollower = document.createElement("span");
  cursorFollower.className = "cursor-follower";
  cursorFollower.setAttribute("aria-hidden", "true");
  document.body.append(cursorFollower);

  let cursorX = 0;
  let cursorY = 0;
  let cursorFrame = 0;

  document.addEventListener("pointermove", (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;

    if (cursorFrame) return;

    cursorFrame = requestAnimationFrame(() => {
      cursorFollower.style.left = `${cursorX}px`;
      cursorFollower.style.top = `${cursorY}px`;
      cursorFollower.classList.add("is-visible");
      cursorFrame = 0;
    });
  }, { passive: true });

  const hideCursorFollower = () => cursorFollower.classList.remove("is-visible");
  document.addEventListener("pointerleave", hideCursorFollower);
  window.addEventListener("blur", hideCursorFollower);
  document.addEventListener("pointerdown", () => cursorFollower.classList.add("is-pressed"));
  document.addEventListener("pointerup", () => cursorFollower.classList.remove("is-pressed"));
}