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
    link.addEventListener("click", () => {
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
  const sectionIds = ["hero", "about", "visual"];
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
    link.addEventListener("click", () => {
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
   VISUAL PROJECT TABS + INFINITE SWIPER
================================================== */

(function () {
  "use strict";

  const filter = document.querySelector(".visual-filter");
  const panels = document.querySelectorAll(".visual-project-panel");

  if (!filter || !panels.length) return;

  const buttons = [...filter.querySelectorAll("[data-filter]")];
  const swipers = new Map();
  const slidePixelsPerSecond = 82;
  const bannerSlideSpeed = 800;

  function getSpaceBetween() {
    return window.innerWidth < 769 ? 16 : 30;
  }

  function getUniformSpeed(swiperElement) {
    const slide = swiperElement.querySelector(".swiper-slide");
    const slideWidth = slide?.getBoundingClientRect().width || 320;
    const travelDistance = slideWidth + getSpaceBetween();

    return Math.round((travelDistance / slidePixelsPerSecond) * 1000);
  }

  function syncSwiperSpeed(swiper) {
    if (swiper.el.classList.contains("visual-project-swiper--banner")) {
      swiper.params.speed = bannerSlideSpeed;
      swiper.originalParams.speed = bannerSlideSpeed;
      return;
    }

    const speed = getUniformSpeed(swiper.el);

    swiper.params.speed = speed;
    swiper.originalParams.speed = speed;
  }

  function resumeAtUniformSpeed(swiper, snapToSlide = true) {
    if (!swiper || swiper.destroyed) return;

    swiper.autoplay.stop();
    syncSwiperSpeed(swiper);

    if (swiper.el.classList.contains("visual-project-swiper--banner")) {
      swiper.autoplay.start();
      return;
    }

    if (snapToSlide) swiper.slideToClosest(0, false);
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

  function initSwiper(panel) {
    if (swipers.has(panel) || typeof Swiper === "undefined") return swipers.get(panel);

    const swiperElement = panel.querySelector(".visual-project-swiper");
    const isBannerSwiper = swiperElement.classList.contains("visual-project-swiper--banner");

    if (isBannerSwiper) {
      panel.dataset.projectCount = String(
        swiperElement.querySelectorAll(".visual-project-card").length
      );
    } else {
      prepareLoopSlides(panel);
    }

    const swiperOptions = {
      slidesPerView: isBannerSwiper ? 1 : "auto",
      spaceBetween: 30,
      loop: !isBannerSwiper,
      speed: isBannerSwiper ? bannerSlideSpeed : getUniformSpeed(swiperElement),
      grabCursor: true,
      watchOverflow: false,
      observer: true,
      observeParents: true,
      autoplay: {
        delay: isBannerSwiper ? 3300 : 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        stopOnLastSlide: isBannerSwiper
      },
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
      if (
        !isActive &&
        panelSwiper?.el.classList.contains("visual-project-swiper--banner")
      ) {
        panelSwiper.autoplay.stop();
        panelSwiper.slideTo(0, 0, false);
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

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;

    swipers.forEach((swiper, panel) => {
      if (
        swiper.el.classList.contains("visual-project-swiper--banner") &&
        !panel.classList.contains("is-active")
      ) return;

      resumeAtUniformSpeed(swiper, false);
    });
  });
})();
