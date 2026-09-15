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
    link.addEventListener("click", closeMenu);
  });

})();