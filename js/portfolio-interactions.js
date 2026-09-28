/* ==================================================
   PORTFOLIO INTERACTIONS
   기존 JS를 수정하지 않는 독립형 PC 스크롤/호버 인터랙션입니다.
================================================== */

(function () {
  "use strict";

  const root = document.documentElement;
  const desktopQuery = window.matchMedia("(min-width: 1201px)");
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const elements = {
    responsiveSection: document.querySelector(".responsive-projects"),
    romandProject: document.querySelector(".romand-project-index"),
    romandIntro: document.querySelector(".romand-project-index .project-intro"),
    romandShowcase: document.querySelector(".romand-device-showcase"),
    romandDevices: [...document.querySelectorAll(".romand-device")],
    problemItems: [...document.querySelectorAll(".romand-problem-item")],
    goal: document.querySelector(".romand-goal"),
    goalItems: [...document.querySelectorAll(".romand-goal li")],
    romandFinal: document.querySelector(".romand-image-frame"),
    nodaProject: document.querySelector("#noda-project"),
    nodaIntro: document.querySelector("#noda-project .project-intro"),
    nodaAbout: document.querySelector(".noda-showcase-about"),
    nodaAboutLines: [
      ...document.querySelectorAll(".noda-showcase-about h3, .noda-showcase-about dt, .noda-showcase-about dd")
    ],
    nodaFinal: document.querySelector(".noda-image-frame"),
    contact: document.querySelector(".final-contact"),
    contactClover: document.querySelector(".final-contact-decoration")
  };

  if (!Object.values(elements).some((value) => Array.isArray(value) ? value.length : value)) return;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (start, end, amount) => start + (end - start) * amount;
  const ease = (value) => value * value * (3 - 2 * value);

  let isActive = false;
  let frame = 0;

  function setProperty(element, property, value) {
    if (element) element.style.setProperty(property, value);
  }

  function entryProgress(element, start = 0.9, end = 0.34) {
    if (!element) return 1;

    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    return clamp((viewportHeight * start - rect.top) / (viewportHeight * (start - end)));
  }

  function sectionProgress(element, start = 0.86, end = 0.12) {
    if (!element) return 1;

    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const distance = rect.height + viewportHeight * (start - end);
    return clamp((viewportHeight * start - rect.top) / Math.max(1, distance));
  }

  function updateResponsiveIntro() {
    const progress = ease(sectionProgress(elements.responsiveSection, 0.96, 0.04));
    const horizontalDistance = Math.min(220, window.innerWidth * 0.16);

    setProperty(
      elements.responsiveSection,
      "--pi-responsive-section-x",
      `${lerp(horizontalDistance, -horizontalDistance, progress).toFixed(2)}px`
    );
  }

  function updateProjectIntros() {
    const romandProgress = ease(entryProgress(elements.romandProject, 0.96, 0.3));
    const nodaProgress = ease(entryProgress(elements.nodaProject, 0.96, 0.3));
    const verticalDistance = Math.min(180, window.innerHeight * 0.2);
    const horizontalDistance = Math.min(220, window.innerWidth * 0.16);
    const romandMoving = romandProgress < 0.999;
    const nodaMoving = nodaProgress < 0.999;

    elements.romandIntro?.classList.toggle("is-pi-section-moving", romandMoving);
    elements.nodaIntro?.classList.toggle("is-pi-section-moving", nodaMoving);

    if (romandMoving) {
      setProperty(
        elements.romandIntro,
        "--pi-romand-intro-y",
        `${lerp(verticalDistance, 0, romandProgress).toFixed(2)}px`
      );
    } else {
      elements.romandIntro?.style.removeProperty("--pi-romand-intro-y");
    }

    if (nodaMoving) {
      setProperty(
        elements.nodaIntro,
        "--pi-noda-intro-x",
        `${lerp(-horizontalDistance, 0, nodaProgress).toFixed(2)}px`
      );
    } else {
      elements.nodaIntro?.style.removeProperty("--pi-noda-intro-x");
    }
  }

  function updateRomandShowcase() {
    const progress = sectionProgress(elements.romandShowcase, 0.92, 0.08);
    const centered = progress - 0.5;
    const speeds = [76, -42, 104];

    elements.romandDevices.forEach((device, index) => {
      const distance = speeds[index] ?? 60;
      setProperty(device, "--pi-device-parallax-y", `${(-centered * distance).toFixed(2)}px`);
    });

  }

  function updateProblemStack() {
    elements.problemItems.forEach((item, index) => {
      const stickyTop = 88 + index * 18;
      const next = elements.problemItems[index + 1];
      const nextTop = next?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
      const compression = clamp((stickyTop + 210 - nextTop) / 210);

      setProperty(item, "--pi-problem-top", `${stickyTop}px`);
      setProperty(item, "--pi-problem-layer", String(index + 1));
      setProperty(item, "--pi-problem-scale", lerp(1, 0.965, compression).toFixed(4));
      setProperty(item, "--pi-problem-surface-opacity", lerp(1, 0.9, compression).toFixed(3));
    });
  }

  function updateGoal() {
    const progress = sectionProgress(elements.goal, 0.78, 0.28);
    setProperty(elements.goal, "--pi-goal-progress", progress.toFixed(4));

    elements.goalItems.forEach((item, index) => {
      const threshold = elements.goalItems.length > 1
        ? index / (elements.goalItems.length - 1)
        : 0;
      item.classList.toggle("is-pi-reached", progress >= threshold - 0.04);
    });
  }

  function updateRomandFinal() {
    const progress = ease(sectionProgress(elements.romandFinal, 0.9, 0.16));
    setProperty(elements.romandFinal?.querySelector("img"), "--pi-romand-final-scale", lerp(1.14, 1, progress).toFixed(4));
  }

  function updateNodaAbout() {
    const progress = entryProgress(elements.nodaAbout, 0.9, 0.24);
    const count = Math.max(1, elements.nodaAboutLines.length);

    elements.nodaAboutLines.forEach((line, index) => {
      const delay = (index / count) * 0.42;
      const local = ease(clamp((progress - delay) / 0.46));
      setProperty(line, "--pi-noda-line-hidden", `${lerp(100, 0, local).toFixed(2)}%`);
      setProperty(line, "--pi-noda-line-x", `${lerp(24, 0, local).toFixed(2)}px`);
    });
  }

  function updateNodaFinal() {
    const progress = sectionProgress(elements.nodaFinal, 0.92, 0.08);
    const image = elements.nodaFinal?.querySelector("img");
    setProperty(image, "--pi-noda-final-y", `${lerp(32, -32, progress).toFixed(2)}px`);
    setProperty(image, "--pi-noda-final-scale", "1.06");
  }

  function updateContact() {
    const progress = ease(entryProgress(elements.contact, 0.96, 0.32));
    const rect = elements.contact?.getBoundingClientRect();
    const holdDistance = Math.max(1, (elements.contact?.offsetHeight ?? 0) - window.innerHeight);
    const holdProgress = ease(clamp(-(rect?.top ?? 0) / holdDistance));
    const orbit = Math.sin(holdProgress * Math.PI * 2);
    const lift = Math.sin(holdProgress * Math.PI);

    setProperty(elements.contact, "--pi-contact-clip", `${lerp(22, 0, progress).toFixed(2)}%`);
    setProperty(elements.contact?.querySelector(".final-contact-inner"), "--pi-contact-y", `${lerp(72, 0, progress).toFixed(2)}px`);
    setProperty(elements.contact?.querySelector(".final-contact-inner"), "--pi-contact-opacity", lerp(0.35, 1, progress).toFixed(3));
    setProperty(elements.contactClover, "--pi-contact-clover-x", `${(lerp(0, -160, holdProgress) + orbit * 24).toFixed(2)}px`);
    setProperty(elements.contactClover, "--pi-contact-clover-y", `${(lerp(0, -100, holdProgress) - lift * 40).toFixed(2)}px`);
    setProperty(elements.contactClover, "--pi-contact-clover-rotate", `${(lerp(-4, 28, holdProgress) + orbit * 7).toFixed(2)}deg`);
    setProperty(elements.contactClover, "--pi-contact-clover-scale", lerp(1, 1.14, holdProgress).toFixed(4));
  }

  function update() {
    frame = 0;
    if (!isActive || document.body.classList.contains("is-detail-modal-open")) return;

    updateResponsiveIntro();
    updateProjectIntros();
    updateRomandShowcase();
    updateProblemStack();
    updateGoal();
    updateRomandFinal();
    updateNodaAbout();
    updateNodaFinal();
    updateContact();
  }

  function requestUpdate() {
    if (!isActive || frame) return;
    frame = window.requestAnimationFrame(update);
  }

  function syncMode() {
    isActive = desktopQuery.matches && !reduceMotionQuery.matches;
    root.classList.toggle("pi-motion-active", isActive);

    if (isActive) {
      requestUpdate();
    } else {
      elements.romandIntro?.classList.remove("is-pi-section-moving");
      elements.nodaIntro?.classList.remove("is-pi-section-moving");
      elements.romandIntro?.style.removeProperty("--pi-romand-intro-y");
      elements.nodaIntro?.style.removeProperty("--pi-noda-intro-x");
    }
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("load", requestUpdate);
  document.addEventListener("visual-modal-closed", requestUpdate);
  desktopQuery.addEventListener("change", syncMode);
  reduceMotionQuery.addEventListener("change", syncMode);

  syncMode();
})();
