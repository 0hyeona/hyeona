/* ==================================================
   PROJECT NAV TOGGLE
   - 프로젝트 버튼 클릭 → 메뉴 열기 / 닫기
   - 외부 클릭 시 닫기
   - ESC 키로 닫기
   - 메뉴 링크 클릭 시 닫기
================================================== */

(function () {
  "use strict";

  const wrap = document.querySelector(".project-nav-wrap");
  const trigger = document.querySelector(".project-trigger");
  const menu = document.getElementById("project-menu");

  // 필요한 요소가 없으면 실행하지 않음
  if (!wrap || !trigger || !menu) return;


  /* 메뉴 열기 */
  function openMenu() {
    wrap.classList.add("is-open");

    trigger.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
  }


  /* 메뉴 닫기 */
  function closeMenu() {
    wrap.classList.remove("is-open");

    trigger.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
  }


  /* 버튼 클릭 */
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();

    if (wrap.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });


  /* 메뉴 외부 클릭 */
  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) {
      closeMenu();
    }
  });


  /* ESC 키 */
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      wrap.classList.contains("is-open")
    ) {
      closeMenu();

      trigger.focus();
    }
  });


  /* 메뉴 링크 클릭 */
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      const target = hash?.startsWith("#")
        ? document.getElementById(hash.slice(1))
        : null;

      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        window.history.replaceState(null, "", hash);
      }

      menu.querySelectorAll("a").forEach((item) => {
        item.classList.remove("is-current");
        item.removeAttribute("aria-current");
      });

      link.classList.add("is-current");
      link.setAttribute("aria-current", "location");

      closeMenu();
    });
  });

})();


/* ==================================================
   FLOATING NAVIGATION
================================================== */

(function () {
  "use strict";

  const floatingNav = document.querySelector(".floating-nav");
  const toggle = document.querySelector(".floating-nav-toggle");
  const hero = document.querySelector(".portfolio-hero");

  if (!floatingNav || !toggle || !hero) return;

  const floatingLinks = floatingNav.querySelectorAll("a[href^='#']");
  const allNavigationLinks = document.querySelectorAll(
    ".project-menu a[href^='#'], .floating-nav-menu a[href^='#']"
  );
  const sectionIds = [
    "hero",
    "about",
    "visual",
    "romand-project",
    "noda-project",
    "contact"
  ];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  let activeSection = "";
  let scrollTicking = false;

  function openFloatingMenu() {
    floatingNav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeFloatingMenu() {
    floatingNav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function setActiveSection(id) {
    if (!id || activeSection === id) return;

    activeSection = id;

    allNavigationLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${id}`;

      link.classList.toggle("is-current", isCurrent);

      if (isCurrent) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateActiveSection() {
    const probe = window.scrollY + window.innerHeight * 0.38;
    let current = sections[0]?.id || "about";

    sections.forEach((section) => {
      if (section.offsetTop <= probe) current = section.id;
    });

    setActiveSection(current);
    scrollTicking = false;
  }

  toggle.addEventListener("click", () => {
    if (floatingNav.classList.contains("is-open")) {
      closeFloatingMenu();
    } else {
      openFloatingMenu();
    }
  });

  floatingLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.getElementById(link.hash.slice(1));

      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      setActiveSection(link.hash.slice(1));
      closeFloatingMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!floatingNav.contains(event.target)) closeFloatingMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && floatingNav.classList.contains("is-open")) {
      closeFloatingMenu();
      toggle.focus();
    }
  });

  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateActiveSection);
      scrollTicking = true;
    }
  }, { passive: true });

  const heroObserver = new IntersectionObserver(([entry]) => {
    floatingNav.classList.toggle("is-visible", !entry.isIntersecting);

    if (entry.isIntersecting) closeFloatingMenu();
  }, { threshold: 0.08 });

  heroObserver.observe(hero);
  updateActiveSection();
})();


/* ==================================================
   SECTION TITLE REVEAL
================================================== */

(function () {
  "use strict";

  const titleGroups = [
    {
      group: ".about-profile-content",
      kicker: ".about-profile-kicker",
      heading: ".about-profile-title"
    },
    {
      group: ".capabilities-header",
      kicker: ".capabilities-kicker",
      heading: ".capabilities-title"
    },
    {
      group: ".visual-projects-header",
      kicker: ".visual-projects-kicker",
      heading: ".visual-projects-title"
    }
  ].map(({ group, kicker, heading }) => {
    const groupElement = document.querySelector(group);
    const kickerElement = groupElement?.querySelector(kicker);
    const headingElement = groupElement?.querySelector(heading);

    if (!groupElement || !kickerElement || !headingElement) return null;

    groupElement.classList.add("title-reveal-group");
    kickerElement.classList.add("reveal-kicker");
    headingElement.classList.add("reveal-heading");

    return groupElement;
  }).filter(Boolean);

  if (!titleGroups.length) return;

  document.documentElement.classList.add("has-reveal-motion");

  if (!("IntersectionObserver" in window)) {
    titleGroups.forEach((group) => group.classList.add("is-title-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-title-visible", entry.isIntersecting);
    });
  }, {
    threshold: 0.22,
    rootMargin: "0px 0px -8% 0px"
  });

  titleGroups.forEach((group) => observer.observe(group));
})();


/* ==================================================
   PORTFOLIO CONTENT REVEALS
================================================== */

(function () {
  "use strict";

  const revealItems = [];

  function register(selector, options = {}) {
    const elements = [...document.querySelectorAll(selector)];

    elements.forEach((element, index) => {
      element.classList.add("portfolio-reveal");
      element.style.setProperty("--reveal-x", options.x || "0px");
      element.style.setProperty("--reveal-y", options.y || "28px");
      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * (options.stagger || 0), options.maxDelay || 0)}ms`
      );
      revealItems.push(element);
    });
  }

  register(".about-profile-photo", { x: "-42px", y: "0px" });
  register(".about-profile-description", { x: "34px", y: "0px" });
  register(".about-personal, .about-certifications", {
    y: "24px",
    stagger: 110,
    maxDelay: 110
  });
  register(".capability-group", { y: "34px", stagger: 80, maxDelay: 240 });
  register(".capability-assets", { y: "24px" });
  register(".tool-card", { y: "22px", stagger: 45, maxDelay: 180 });
  register(".visual-filter", { y: "18px" });

  if (!revealItems.length) return;

  document.documentElement.classList.add("has-portfolio-reveals");

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add("is-reveal-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-reveal-visible", entry.isIntersecting);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -5% 0px"
  });

  revealItems.forEach((item) => observer.observe(item));
})();


/* ==================================================
   VISUAL PROJECT TABS + SLIDERS
================================================== */

(function () {
  "use strict";

  const filter = document.querySelector(".visual-filter");
  const panels = document.querySelectorAll(".visual-project-panel");

  if (!filter || !panels.length) return;

  const buttons = [...filter.querySelectorAll("[data-filter]")];
  const swipers = new Map();
  const compactSliderMedia = window.matchMedia("(max-width: 1200px)");
  const continuousSlideSpeed = 7600;
  const pagedSlideSpeed = 900;

  function syncSwiperSpeed(swiper) {
    const speed = swiper.el.dataset.mode === "paged"
      ? pagedSlideSpeed
      : continuousSlideSpeed;

    swiper.params.speed = speed;
    swiper.originalParams.speed = speed;
  }

  function resumeAtUniformSpeed(swiper, snapToSlide = true) {
    if (!swiper || swiper.destroyed || !swiper.el.dataset.mode) return;

    swiper.autoplay.stop();
    syncSwiperSpeed(swiper);

    if (snapToSlide && swiper.el.dataset.mode === "continuous") {
      swiper.slideToClosest(0, false);
    }
    swiper.autoplay.start();
  }

  function prepareLoopSlides(panel) {
    const wrapper = panel.querySelector(".swiper-wrapper");
    const originals = [...wrapper.children].filter((slide) => !slide.hasAttribute("data-loop-clone"));

    panel.dataset.projectCount = String(originals.length);

    if (wrapper.querySelector("[data-loop-clone]")) return originals.length;

    while (wrapper.children.length < 12) {
      originals.forEach((slide) => {
        const clone = slide.cloneNode(true);
        const image = clone.querySelector("img");

        clone.dataset.loopClone = "true";
        clone.setAttribute("aria-hidden", "true");
        if (image) image.alt = "";
        wrapper.appendChild(clone);
      });
    }

    return originals.length;
  }

  function removeLoopSlides(panel) {
    const wrapper = panel.querySelector(".swiper-wrapper");

    wrapper.querySelectorAll("[data-loop-clone]").forEach((slide) => slide.remove());
    [...wrapper.children]
      .sort((a, b) => Number(a.dataset.projectIndex) - Number(b.dataset.projectIndex))
      .forEach((slide) => wrapper.appendChild(slide));
  }

  function initSwiper(panel) {
    if (swipers.has(panel) || typeof Swiper === "undefined") return swipers.get(panel);

    const swiperElement = panel.querySelector(".visual-project-swiper");
    const isBannerSwiper = panel.dataset.category === "banner";
    const isPagedSwiper = isBannerSwiper || compactSliderMedia.matches;
    const projectCount = swiperElement.querySelectorAll(
      ".visual-project-card:not([data-loop-clone])"
    ).length;

    swiperElement
      .querySelectorAll(".visual-project-card:not([data-loop-clone])")
      .forEach((slide, index) => {
        if (!slide.hasAttribute("data-project-index")) {
          slide.dataset.projectIndex = String(index);
        }
      });

    if (!isPagedSwiper) {
      swiperElement.dataset.mode = "continuous";
      prepareLoopSlides(panel);
    } else {
      swiperElement.dataset.mode = "paged";
      panel.dataset.projectCount = String(projectCount);
    }

    const swiperOptions = {
      slidesPerView: isPagedSwiper ? 1 : "auto",
      spaceBetween: 30,
      loop: !isPagedSwiper || projectCount > 1,
      speed: isPagedSwiper ? pagedSlideSpeed : continuousSlideSpeed,
      grabCursor: true,
      watchOverflow: false,
      observer: true,
      observeParents: true,
      preventClicks: false,
      preventClicksPropagation: false,
      autoplay: {
        delay: isPagedSwiper ? 3300 : 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        stopOnLastSlide: false
      },
      ...(isPagedSwiper
        ? {
            pagination: {
              el: swiperElement.querySelector(".swiper-pagination"),
              clickable: true
            }
          }
        : {}),
      breakpoints: {
        0: { spaceBetween: 16 },
        769: { spaceBetween: 30 }
      },
      on: {
        touchStart(instance) {
          instance.autoplay.stop();
        },
        touchEnd(instance) {
          resumeAtUniformSpeed(instance);
        },
        resize(instance) {
          syncSwiperSpeed(instance);
        }
      }
    };

    const swiper = new Swiper(swiperElement, swiperOptions);

    swipers.set(panel, swiper);
    return swiper;
  }

  function activateCategory(button) {
    const category = button.dataset.filter;
    const activePanel = [...panels].find((panel) => panel.dataset.category === category);

    if (!activePanel) return;

    buttons.forEach((item) => {
      const isSelected = item === button;

      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-selected", String(isSelected));
      item.tabIndex = isSelected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const isActive = panel === activePanel;

      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);

      const panelSwiper = swipers.get(panel);
      if (!isActive && panelSwiper?.el.dataset.mode) {
        panelSwiper.autoplay.stop();
      }
    });

    const activeSwiper = swipers.get(activePanel);
    if (activeSwiper) {
      activeSwiper.update();
      resumeAtUniformSpeed(activeSwiper);
    }
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activateCategory(button));
    button.addEventListener("keydown", (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

      event.preventDefault();
      let nextIndex = index;

      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % buttons.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = buttons.length - 1;

      buttons[nextIndex].focus();
      activateCategory(buttons[nextIndex]);
    });
  });

  panels.forEach((panel) => initSwiper(panel));

  const initialButton = buttons.find((button) => button.classList.contains("is-active")) || buttons[0];
  activateCategory(initialButton);

  compactSliderMedia.addEventListener("change", () => {
    swipers.forEach((swiper) => swiper.destroy(true, true));
    swipers.clear();

    panels.forEach((panel) => {
      removeLoopSlides(panel);
      initSwiper(panel);
    });

    const activeButton = buttons.find((button) => button.classList.contains("is-active")) || buttons[0];
    activateCategory(activeButton);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;

    swipers.forEach((swiper, panel) => {
      if (!panel.classList.contains("is-active")) return;

      resumeAtUniformSpeed(swiper, false);
    });
  });

  document.addEventListener("visual-modal-closed", () => {
    swipers.forEach((swiper, panel) => {
      if (!panel.classList.contains("is-active")) return;
      resumeAtUniformSpeed(swiper);
    });
  });
})();


/* ==================================================
   DETAIL PAGE MODAL — PC
================================================== */

(function () {
  "use strict";

  const visualProjects = document.querySelector(".visual-projects");
  const modal = document.getElementById("detail-modal");
  const modalMedia = document.getElementById("detail-modal-media");
  const modalTitle = document.getElementById("detail-modal-title");
  const modalDescription = document.getElementById("detail-modal-description");
  const modalLabel = modal?.querySelector(".detail-modal-label");
  let pointerStart = null;

  if (!visualProjects || !modal || !modalMedia || !modalTitle || !modalDescription) return;

  visualProjects
    .querySelectorAll('.visual-project-panel[data-category="detail"] .visual-project-card')
    .forEach((card) => {
    card.setAttribute("data-visual-modal-trigger", "true");
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    });

  function closeModal() {
    modal.hidden = true;
    modal.classList.remove("is-detail-modal");
    document.body.classList.remove("is-detail-modal-open");
    document.dispatchEvent(new CustomEvent("visual-modal-closed"));
  }

  function openModal(card) {
    if (!modal.hidden) return;

    const sourceMedia = card.querySelector(".visual-project-media");
    const sourceTitle = card.querySelector(".visual-project-info h3");
    const sourceDescription = card.querySelector(".visual-project-info p");

    modalMedia.replaceChildren();
    const image = sourceMedia?.querySelector("img");

    if (image) {
      const imageClone = image.cloneNode(true);
      imageClone.removeAttribute("loading");
      modalMedia.appendChild(imageClone);
    } else if (sourceMedia) {
      modalMedia.innerHTML = sourceMedia.innerHTML;
    }

    const panel = card.closest(".visual-project-panel");
    const category = panel?.dataset.category?.toUpperCase() || "DETAIL";

    if (modalLabel) modalLabel.textContent = `${category} PAGE`;
    modal.classList.add("is-detail-modal");
    modalTitle.textContent = sourceTitle?.textContent.trim() || "상세페이지 디자인";
    modalDescription.textContent = sourceDescription?.textContent.trim() || "상세페이지 디자인 설명입니다.";
    modal.hidden = false;
    document.body.classList.add("is-detail-modal-open");
  }

  visualProjects.addEventListener("click", (event) => {
    const card = event.target.closest("[data-visual-modal-trigger]");
    if (card) openModal(card);
  });

  visualProjects.addEventListener("pointerdown", (event) => {
    const card = event.target.closest("[data-visual-modal-trigger]");
    if (!card) return;

    pointerStart = {
      card,
      x: event.clientX,
      y: event.clientY,
    };
  }, true);

  visualProjects.addEventListener("pointerup", (event) => {
    if (!pointerStart) return;

    const card = event.target.closest("[data-visual-modal-trigger]");
    const distance = Math.hypot(
      event.clientX - pointerStart.x,
      event.clientY - pointerStart.y
    );
    const shouldOpen = card === pointerStart.card && distance < 10;

    pointerStart = null;
    if (shouldOpen) openModal(card);
  }, true);

  visualProjects.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && event.target.closest("[data-visual-modal-trigger]")) {
      event.preventDefault();
      openModal(event.target.closest("[data-visual-modal-trigger]"));
    }
  });

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-detail-modal-close]")) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
})();


(function () {
  "use strict";

  const projects = [...document.querySelectorAll(".web-site")];

  const items = projects
    .map((project) => ({
      project,
      links: project.querySelector(".project-links"),
    }))
    .filter(({ links }) => links);

  if (!items.length) return;

  const OFFSET = 24;

  let positions = [];
  let measureFrame = 0;

  function measure() {
    // 측정 전에 sticky 해제
    items.forEach(({ links }) => {
      links.classList.remove("is-sticky");
    });

    positions = items.map(({ project, links }, index) => {
      const linksRect = links.getBoundingClientRect();
      const nextProject = items[index + 1]?.project;
      const projectBottom = nextProject
        ? nextProject.getBoundingClientRect().top + window.scrollY
        : document.documentElement.scrollHeight;

      return {
        links,
        linksTop: linksRect.top + window.scrollY,
        projectBottom,
        linksHeight: links.offsetHeight,
      };
    });

    update();
  }

  function scheduleMeasure() {
    cancelAnimationFrame(measureFrame);
    measureFrame = requestAnimationFrame(measure);
  }

  function update() {
    const scrollPoint = window.scrollY + OFFSET;

    let activeIndex = -1;

    positions.forEach((item, index) => {
      const passedButton =
        scrollPoint >= item.linksTop;

      const beforeProjectEnd =
        scrollPoint <
        item.projectBottom - item.linksHeight;

      if (passedButton && beforeProjectEnd) {
        activeIndex = index;
      }
    });

    positions.forEach((item, index) => {
      item.links.classList.toggle(
        "is-sticky",
        index === activeIndex
      );
    });
  }

  window.addEventListener("scroll", update, {
    passive: true,
  });

  window.addEventListener("resize", scheduleMeasure);

  window.addEventListener("orientationchange", scheduleMeasure);

  document.addEventListener("load", (event) => {
    if (event.target instanceof HTMLImageElement) {
      scheduleMeasure();
    }
  }, true);

  window.addEventListener("load", scheduleMeasure);

  if (document.fonts?.ready) {
    document.fonts.ready.then(scheduleMeasure);
  }

  measure();
})();
