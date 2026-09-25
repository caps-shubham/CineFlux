// effects.js — purely visual enhancements for CineFlux.
// This file never touches search/fetch logic; it only reacts to
// elements that script.js / movie-details.js already create.

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const skipTilt = reduceMotion || isTouchDevice;

  setupCardTiltAndEntrance();
  setupPosterTilt();
  setupTrendingChips();
  setupDetailBackdrop();
  setupBackgroundVideo();

  function setupBackgroundVideo() {
    const video = document.querySelector(".bg-video");
    if (!video) return;
    if (reduceMotion) {
      video.pause();
      return;
    }
    // Some browsers block autoplay until a user gesture; retry once on first interaction.
    video.play().catch(() => {
      const resume = () => {
        video.play().catch(() => {});
        document.removeEventListener("click", resume);
      };
      document.addEventListener("click", resume, { once: true });
    });
  }

  function setupTrendingChips() {
    const form = document.querySelector("#movieForm");
    const input = document.querySelector("#movieInput");
    const chips = document.querySelectorAll(".chip");
    if (!form || !input || !chips.length) return;

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        input.value = chip.dataset.query || chip.textContent.trim();
        if (typeof form.requestSubmit === "function") {
          form.requestSubmit();
        } else {
          form.dispatchEvent(new Event("submit", { cancelable: true }));
        }
      });
    });
  }

  function setupDetailBackdrop() {
    const backdrop = document.querySelector("#detailBackdrop");
    const detail = document.querySelector("#movie-detail");
    if (!backdrop || !detail) return;

    const observer = new MutationObserver(() => {
      const img = detail.querySelector("img");
      if (!img || !img.src) return;
      backdrop.style.backgroundImage = `url("${img.src}")`;
      requestAnimationFrame(() => backdrop.classList.add("visible"));
    });

    observer.observe(detail, { childList: true });
  }

  function setupCardTiltAndEntrance() {
    const movieHub = document.querySelector("#movieHub");
    if (!movieHub) return;

    // Watch for cards script.js adds/removes on every search.
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.classList.contains("movie-card")) {
            enhanceCard(node);
          }
        });
      });
    });

    observer.observe(movieHub, { childList: true });
  }

  function enhanceCard(card) {
    // Gentle fade + rise entrance.
    card.classList.add("card-enter");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => card.classList.add("card-enter-active"));
    });

    if (skipTilt) return;

    card.addEventListener("mousemove", (e) => tiltCard(e, card));
    card.addEventListener("mouseleave", () => resetTilt(card));
  }

  function tiltCard(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -10;
    const rotateY = ((x - rect.width / 2) / rect.width) * 10;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.035)`;
  }

  function resetTilt(card) {
    card.style.transform = "";
  }

  function setupPosterTilt() {
    if (skipTilt) return;
    const wrapper = document.querySelector("#movie-detail");
    if (!wrapper) return;

    wrapper.addEventListener("mousemove", (e) => {
      const img = wrapper.querySelector("img");
      if (!img) return;
      const rect = img.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / rect.height) * -8;
      const rotateY = ((x - rect.width / 2) / rect.width) * 8;
      img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    wrapper.addEventListener("mouseleave", () => {
      const img = wrapper.querySelector("img");
      if (img) img.style.transform = "";
    });
  }
});