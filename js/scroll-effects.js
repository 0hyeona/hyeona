/* ==================================================
   SCROLL EFFECTS
   기존 reveal / slider / modal 로직과 분리된 보조 인터랙션입니다.
================================================== */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopMotion = window.matchMedia("(min-width: 769px)");
  const stickyHero = window.matchMedia("(min-width: 1024px)");

  const heroStage = document.querySelector(".hero-scroll-stage");
  const about = document.querySelector(".about-chapter");
  const capabilities = document.querySelector(".capabilities-section");
  const capabilityAsset = capabilities?.querySelector(".capability-assets img");
  const visual = document.querySelector(".visual-projects");
  const visualHeader = visual?.querySelector(".visual-projects-header");
  const responsiveSection = document.querySelector(".responsive-projects");
  const romandProject = document.querySelector(".romand-project-index");
  const romandIntro = romandProject?.querySelector(".project-intro");
  const nodaProject = document.getElementById("noda-project");
  const nodaIntro = nodaProject?.querySelector(".project-intro");
  const projectIntros = [...document.querySelectorAll(".project-intro")];
  const romandDetail = document.querySelector(".romand-detail");
  const romandCopy = romandDetail?.querySelector(".romand-detail-copy");
  const romandShowcase = romandDetail?.querySelector(".romand-device-showcase");
  const problemItems = [...document.querySelectorAll(".romand-problem-item")];
  const nodaShowcase = document.querySelector(".noda-showcase");
  const nodaShowcaseCopy = nodaShowcase?.querySelector(".noda-showcase-copy");
  const nodaShowcaseVisual = nodaShowcase?.querySelector(".noda-showcase-visual img");
  const nodaBrand = document.querySelector(".noda-brand-concept");
  const nodaBrandHero = nodaBrand?.querySelector(".noda-brand-hero");
  const nodaPersona = document.querySelector(".noda-persona");
  const contact = document.querySelector(".final-contact");
  const visualCards = [...document.querySelectorAll(".visual-project-card")];
  const romandDevices = [...document.querySelectorAll(".romand-device")];

  if (!heroStage) return;

  document.documentElement.classList.add("has-scroll-effects");

  const progressRail = document.createElement("div");
  progressRail.className = "scroll-progress-rail";
  progressRail.setAttribute("aria-hidden", "true");
  document.body.appendChild(progressRail);

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (start, end, amount) => start + (end - start) * amount;
  const px = (value) => `${value.toFixed(2)}px`;
  const deg = (value) => `${value.toFixed(2)}deg`;

  function sectionProgress(element) {
    if (!element) return 0;

    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    return clamp((viewportHeight - rect.top) / (viewportHeight + rect.height));
  }

  function entryProgress(element) {
    if (!element) return 1;

    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    return clamp((viewportHeight * 0.92 - rect.top) / (viewportHeight * 0.58));
  }

  function exitProgress(element) {
    if (!element) return 0;

    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    return clamp((viewportHeight * 0.14 - rect.bottom) / (viewportHeight * 0.24));
  }

  function setProperty(element, name, value) {
    if (element) element.style.setProperty(name, value);
  }

  function updateHero() {
    if (!stickyHero.matches) return;

    const rect = heroStage.getBoundingClientRect();
    const distance = Math.max(1, heroStage.offsetHeight - window.innerHeight);
    const progress = clamp(-rect.top / distance);
    const eased = progress * progress * (3 - 2 * progress);
    const exitProgress = clamp((eased - 0.48) / 0.52);

    setProperty(heroStage, "--hero-scene-scale", String(lerp(1, 0.38, eased)));
    setProperty(heroStage, "--hero-scene-opacity", String(lerp(1, 0, exitProgress)));

    setProperty(heroStage, "--hero-title-left-x", px(lerp(0, -150, eased)));
    setProperty(heroStage, "--hero-title-right-x", px(lerp(0, 150, eased)));
    setProperty(heroStage, "--hero-title-y", px(lerp(0, -38, eased)));
    setProperty(heroStage, "--hero-title-opacity", String(lerp(1, 0, eased)));
    setProperty(heroStage, "--hero-symbol-y", px(lerp(0, -72, eased)));
    setProperty(heroStage, "--hero-symbol-rotate", deg(lerp(0, 24, eased)));
    setProperty(heroStage, "--hero-symbol-scale", String(lerp(1, 0.58, eased)));
    setProperty(heroStage, "--hero-symbol-opacity", String(lerp(1, 0, exitProgress)));
    setProperty(heroStage, "--hero-flourish-opacity", String(lerp(1, 0, eased)));
    setProperty(heroStage, "--hero-meta-y", px(lerp(0, 48, eased)));
    setProperty(heroStage, "--hero-meta-opacity", String(lerp(1, 0, eased)));
  }

  function updateAbout() {
    const progress = sectionProgress(about);
    setProperty(about, "--about-photo-y", px(lerp(28, -28, progress)));
    setProperty(about, "--about-decoration-x", px(lerp(52, -26, progress)));
    setProperty(about, "--about-decoration-y", px(lerp(34, -20, progress)));
    setProperty(about, "--about-decoration-rotate", deg(lerp(-12, 18, progress)));
  }

  function updateCapabilities() {
    const progress = sectionProgress(capabilities);

    setProperty(capabilityAsset, "--capability-asset-x", px(lerp(-22, 22, progress)));
    setProperty(capabilityAsset, "--capability-asset-y", px(lerp(12, -12, progress)));
    setProperty(capabilityAsset, "--capability-asset-rotate", deg(lerp(-2.5, 2.5, progress)));
  }

  function updateVisual() {
    const progress = sectionProgress(visual);
    const enter = entryProgress(visualHeader);
    const exit = exitProgress(visualHeader);
    const headingX = lerp(112, 0, enter) + lerp(0, -42, exit);

    setProperty(visual, "--visual-heading-x", px(headingX));
    setProperty(visual, "--visual-heading-opacity", String(enter * (1 - exit)));

    visualCards.forEach((card, index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      setProperty(card, "--visual-card-y", px(lerp(18, -18, progress) * direction));
      setProperty(card, "--visual-card-rotate", deg(lerp(-0.75, 0.75, progress) * direction));
    });
  }

  function updateSectionTransitions() {
    const responsiveEntry = entryProgress(responsiveSection);
    const responsiveEase = responsiveEntry * responsiveEntry * (3 - 2 * responsiveEntry);

    setProperty(
      responsiveSection,
      "--responsive-section-x",
      px(lerp(-150, 0, responsiveEase))
    );

    [
      {
        element: romandIntro,
        source: romandProject,
        property: "--romand-intro-y",
        from: -120
      },
      {
        element: nodaIntro,
        source: nodaProject,
        property: "--noda-intro-y",
        from: 120
      }
    ].forEach(({ element, source, property, from }) => {
      if (!element) return;

      const progress = entryProgress(source);
      const eased = progress * progress * (3 - 2 * progress);
      const isMoving = progress < 0.999;

      element.classList.toggle("is-direction-moving", isMoving);

      if (isMoving) {
        setProperty(element, property, px(lerp(from, 0, eased)));
      } else {
        element.style.removeProperty(property);
      }
    });
  }

  function updateProjectIntros() {
    projectIntros.forEach((intro) => {
      const progress = sectionProgress(intro);

      setProperty(intro, "--intro-line-width", `${(progress * 100).toFixed(2)}%`);
    });
  }

  function updateRomand() {
    const copyEntry = entryProgress(romandCopy);
    const showcaseEntry = entryProgress(romandShowcase);
    const fan = 1 - Math.pow(1 - showcaseEntry, 3);

    setProperty(romandDetail, "--romand-copy-x", px(lerp(-72, 0, copyEntry)));
    setProperty(romandDetail, "--romand-copy-opacity", String(lerp(0.2, 1, copyEntry)));

    romandDevices.forEach((device, index) => {
      const direction = index - 1;
      setProperty(device, "--romand-device-x", px(direction * 34 * fan));
      setProperty(device, "--romand-device-y", px(lerp(48, index === 1 ? -18 : 12, fan)));
      setProperty(device, "--romand-device-rotate", deg(direction * 4 * fan));
      setProperty(device, "--romand-device-scale", String(lerp(0.92, index === 1 ? 1.04 : 1, fan)));
    });

    problemItems.forEach((item, index) => {
      const itemProgress = sectionProgress(item);
      const direction = index % 2 === 0 ? -1 : 1;
      setProperty(item, "--problem-image-x", px(lerp(24, -24, itemProgress) * direction));
      setProperty(item, "--problem-image-y", px(lerp(18, -18, itemProgress)));
      setProperty(item, "--problem-image-scale", String(lerp(0.96, 1.025, Math.sin(itemProgress * Math.PI))));
    });
  }

  function updateNoda() {
    const showcaseEntry = entryProgress(nodaShowcase);
    setProperty(nodaShowcase, "--noda-copy-x", px(lerp(76, 0, showcaseEntry)));
    setProperty(nodaShowcase, "--noda-copy-opacity", String(lerp(0.2, 1, showcaseEntry)));
    setProperty(nodaShowcaseVisual, "--noda-showcase-y", px(lerp(44, -8, showcaseEntry)));
    setProperty(nodaShowcaseVisual, "--noda-showcase-scale", String(lerp(0.96, 1.02, showcaseEntry)));

    const brandProgress = sectionProgress(nodaBrand);
    const brandEntry = entryProgress(nodaBrandHero);
    setProperty(nodaBrand, "--noda-brand-heading-y", px(lerp(34, 0, brandEntry)));
    setProperty(nodaBrand, "--noda-brand-heading-opacity", String(lerp(0.25, 1, brandEntry)));
    setProperty(nodaBrand, "--noda-chair-x", px(lerp(64, -48, brandProgress)));
    setProperty(nodaBrand, "--noda-chair-y", px(lerp(74, -36, brandProgress)));
    setProperty(nodaBrand, "--noda-chair-rotate", deg(lerp(8, -7, brandProgress)));

    const personaProgress = sectionProgress(nodaPersona);
    setProperty(nodaPersona, "--persona-room-x", px(lerp(70, -34, personaProgress)));
    setProperty(nodaPersona, "--persona-room-y", px(lerp(32, -18, personaProgress)));
    setProperty(nodaPersona, "--persona-room-scale", String(lerp(1.04, 1.12, personaProgress)));
  }

  function updateContact() {
    const progress = sectionProgress(contact);
    const focus = Math.sin(progress * Math.PI);
    const orbit = Math.sin(progress * Math.PI * 2);
    const flutter = Math.sin(progress * Math.PI * 4);
    const cloverX = lerp(96, -36, progress) + orbit * 32;
    const cloverY = lerp(70, -38, progress) + Math.cos(progress * Math.PI * 3) * 22;
    const cloverRotate = lerp(-24, 34, progress) + flutter * 16;
    const cloverScale = 0.82 + focus * 0.3 + Math.abs(flutter) * 0.05;

    setProperty(contact, "--contact-clover-x", px(cloverX));
    setProperty(contact, "--contact-clover-y", px(cloverY));
    setProperty(contact, "--contact-clover-rotate", deg(cloverRotate));
    setProperty(contact, "--contact-clover-scale", String(cloverScale));
    setProperty(contact, "--contact-clover-opacity", String(0.09 + focus * 0.1));
    setProperty(contact, "--contact-letter-spacing", `${lerp(-0.06, -0.025, focus).toFixed(3)}em`);
  }

  function update() {
    if (document.body.classList.contains("is-detail-modal-open")) {
      ticking = false;
      return;
    }

    const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty(
      "--page-scroll-progress",
      String(clamp(window.scrollY / scrollable))
    );

    if (!reduceMotion.matches) {
      updateHero();

      if (desktopMotion.matches) {
        updateAbout();
        updateCapabilities();
        updateVisual();
        updateSectionTransitions();
        updateProjectIntros();
        updateRomand();
        updateNoda();
        updateContact();
      }
    }

    ticking = false;
  }

  let ticking = false;

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  const maskTargets = document.querySelectorAll(
    ".romand-image-frame, .noda-image-frame"
  );

  maskTargets.forEach((target) => target.classList.add("scroll-mask-reveal"));

  if (capabilities) {
    if ("IntersectionObserver" in window && !reduceMotion.matches) {
      const capabilityObserver = new IntersectionObserver(([entry]) => {
        capabilities.classList.toggle("is-assets-active", entry.isIntersecting);
      }, {
        threshold: 0.08,
        rootMargin: "8% 0px 8% 0px"
      });

      capabilityObserver.observe(capabilities);
    } else if (!reduceMotion.matches) {
      capabilities.classList.add("is-assets-active");
    }
  }

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const maskObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-mask-visible");
        maskObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    });

    maskTargets.forEach((target) => maskObserver.observe(target));
  } else {
    maskTargets.forEach((target) => target.classList.add("is-mask-visible"));
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("load", requestUpdate);
  document.addEventListener("visual-modal-closed", requestUpdate);
  reduceMotion.addEventListener("change", requestUpdate);
  desktopMotion.addEventListener("change", requestUpdate);
  stickyHero.addEventListener("change", requestUpdate);

  requestUpdate();
})();
