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
  const sectionIds = ["about", "visual", "ui-design", "publishing"];
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
   VISUAL PROJECT FILTER
================================================== */

(function () {
  "use strict";

  const filter = document.querySelector(".visual-filter");
  const grid = document.getElementById("visual-project-grid");
  const count = document.querySelector(".visual-project-count span");

  if (!filter || !grid || !count) return;

  const buttons = filter.querySelectorAll("[data-filter]");
  const cards = grid.querySelectorAll("[data-category]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      let visibleCount = 0;

      buttons.forEach((item) => {
        const isSelected = item === button;

        item.classList.toggle("is-active", isSelected);
        item.setAttribute("aria-pressed", String(isSelected));
      });

      cards.forEach((card) => {
        const isVisible = card.dataset.category === category;

        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      count.textContent = visibleCount;
    });
  });
})();
