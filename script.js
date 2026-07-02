const body = document.body;
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const progress = document.querySelector(".scroll-progress");
const backTop = document.querySelector("[data-back-top]");
const loader = document.querySelector(".loader");

window.addEventListener("load", () => {
  loader.classList.add("hidden");
});

document.getElementById("year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

function updateScrollUi() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${pct}%`;
  header.classList.toggle("scrolled", window.scrollY > 40);
  backTop.classList.toggle("visible", window.scrollY > 600);
}
window.addEventListener("scroll", updateScrollUi, { passive: true });
updateScrollUi();

backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString("en-IN");
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach((counter) => counterObserver.observe(counter));

const testimonials = [...document.querySelectorAll(".testimonial")];
let testimonialIndex = 0;
function showTestimonial(index) {
  testimonials[testimonialIndex].classList.remove("active");
  testimonialIndex = (index + testimonials.length) % testimonials.length;
  testimonials[testimonialIndex].classList.add("active");
}
document.querySelector("[data-next]").addEventListener("click", () => showTestimonial(testimonialIndex + 1));
document.querySelector("[data-prev]").addEventListener("click", () => showTestimonial(testimonialIndex - 1));
setInterval(() => showTestimonial(testimonialIndex + 1), 5200);

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("open");
  });
});

const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = lightbox.querySelector("img");
document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.querySelector("img").alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}
document.querySelector("[data-lightbox-close]").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
});


document.querySelectorAll("[data-custom-select]").forEach((select) => {
  const trigger = select.querySelector(".select-trigger");
  const selected = select.querySelector("[data-selected]");
  const input = select.querySelector("input[type='hidden']");
  const options = [...select.querySelectorAll("[role='option']")];

  function closeSelect() {
    select.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  }

  function openSelect() {
    select.classList.add("open");
    trigger.setAttribute("aria-expanded", "true");
  }

  trigger.addEventListener("click", () => {
    select.classList.contains("open") ? closeSelect() : openSelect();
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      options.forEach((item) => item.setAttribute("aria-selected", "false"));
      option.setAttribute("aria-selected", "true");
      selected.textContent = option.dataset.value;
      input.value = option.dataset.value;
      closeSelect();
      trigger.focus();
    });
  });

  document.addEventListener("click", (event) => {
    if (!select.contains(event.target)) closeSelect();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSelect();
  });
});
document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button[type='submit']");
  const original = button.textContent;
  button.textContent = "Inquiry Sent";
  setTimeout(() => {
    button.textContent = original;
    event.currentTarget.reset();
    const customSelect = event.currentTarget.querySelector("[data-custom-select]");
    if (customSelect) {
      const firstOption = customSelect.querySelector("[role='option']");
      customSelect.querySelector("[data-selected]").textContent = firstOption.dataset.value;
      customSelect.querySelector("input[type='hidden']").value = firstOption.dataset.value;
      customSelect.querySelectorAll("[role='option']").forEach((option, index) => option.setAttribute("aria-selected", String(index === 0)));
    }
  }, 1600);
});

const finePointer = window.matchMedia("(pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (finePointer.matches && !reducedMotion.matches) {
  document.querySelectorAll(".panel, .choice-card, .program-card, .trainer-card, .facility-card, .transform-card, .love-grid article, .contact-card").forEach((card) => {
    card.classList.add("tilt-card");

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
      card.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
    }, { passive: true });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--card-lift", "0");
    });
  });
}