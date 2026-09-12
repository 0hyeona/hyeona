// 01. 기본 설정


const reduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;



// 02. HERO 클로버 마우스 인터랙션


const heroVisual =
  document.querySelector('.hero-visual');

const heroSymbolTilt =
  document.querySelector('.hero-symbol-tilt');


if (
  heroVisual &&
  heroSymbolTilt &&
  !reduceMotion
) {

  heroVisual.addEventListener(
    'mousemove',
    (event) => {

      const rect =
        heroVisual.getBoundingClientRect();

      // 마우스 위치를 -0.5 ~ 0.5 값으로 변환
      const x =
        (event.clientX - rect.left)
        / rect.width
        - 0.5;

      const y =
        (event.clientY - rect.top)
        / rect.height
        - 0.5;


      // 회전 강도
      const rotateY = x * 18;
      const rotateX = y * -14;


      heroSymbolTilt.style.transform =
        `rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)`;

    }
  );


  // 마우스가 HERO 영역에서 나가면 원위치

  heroVisual.addEventListener(
    'mouseleave',
    () => {

      heroSymbolTilt.style.transform =
        'rotateX(0deg) rotateY(0deg)';

    }
  );

}



// 03. VIEW PROJECTS 메뉴


const projectWrap =
  document.querySelector(
    '.project-nav-wrap'
  );

const projectTrigger =
  document.querySelector(
    '.project-trigger'
  );

const projectMenu =
  document.querySelector(
    '.project-menu'
  );

const projectLinks =
  document.querySelectorAll(
    '.project-menu a'
  );


// 메뉴 OPEN

function openProjectMenu() {

  if (
    !projectWrap ||
    !projectTrigger ||
    !projectMenu
  ) {
    return;
  }


  projectWrap.classList.add(
    'is-open'
  );


  projectTrigger.setAttribute(
    'aria-expanded',
    'true'
  );


  projectMenu.setAttribute(
    'aria-hidden',
    'false'
  );


  // 메뉴가 열리면 링크 Tab 접근 가능

  projectLinks.forEach(
    (link) => {

      link.removeAttribute(
        'tabindex'
      );

    }
  );

}


// 메뉴 CLOSE

function closeProjectMenu(
  returnFocus = false
) {

  if (
    !projectWrap ||
    !projectTrigger ||
    !projectMenu
  ) {
    return;
  }


  projectWrap.classList.remove(
    'is-open'
  );


  projectTrigger.setAttribute(
    'aria-expanded',
    'false'
  );


  projectMenu.setAttribute(
    'aria-hidden',
    'true'
  );


  // 닫힌 메뉴에는 Tab 접근 방지

  projectLinks.forEach(
    (link) => {

      link.setAttribute(
        'tabindex',
        '-1'
      );

    }
  );


  // ESC로 닫았을 때 버튼으로 포커스 복귀

  if (returnFocus) {

    projectTrigger.focus({
      preventScroll: true
    });

  }

}


// 처음 실행 시 메뉴 닫힌 상태 설정

closeProjectMenu();


// VIEW PROJECTS 클릭

if (projectTrigger) {

  projectTrigger.addEventListener(
    'click',
    () => {

      const isOpen =
        projectWrap.classList.contains(
          'is-open'
        );


      if (isOpen) {

        closeProjectMenu();

      } else {

        openProjectMenu();

      }

    }
  );

}


// 04. 모든 내부 링크 부드러운 스크롤

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach((link) => {

    link.addEventListener(
      'click',
      (event) => {

        const targetId =
          link.getAttribute('href');


        if (
          !targetId ||
          targetId === '#'
        ) {
          return;
        }


        const target =
          document.querySelector(
            targetId
          );


        if (!target) {
          return;
        }


        event.preventDefault();


        // 프로젝트 메뉴 안의 버튼을 눌렀다면
        // 먼저 메뉴 닫기

        if (
          link.closest(
            '.project-menu'
          )
        ) {

          closeProjectMenu();

        }


        // 이동

        target.scrollIntoView({

          behavior:
            reduceMotion
              ? 'auto'
              : 'smooth',

          block: 'start'

        });

      }
    );

  });


// 05. 메뉴 바깥 클릭 시 닫기

document.addEventListener(
  'click',
  (event) => {

    if (
      !projectWrap ||
      !projectWrap.classList.contains(
        'is-open'
      )
    ) {
      return;
    }


    // project-nav-wrap 안을 클릭했다면 유지

    if (
      projectWrap.contains(
        event.target
      )
    ) {
      return;
    }


    closeProjectMenu();

  }
);


// 06. ESC 키로 메뉴 닫기

document.addEventListener(
  'keydown',
  (event) => {

    if (
      event.key !== 'Escape'
    ) {
      return;
    }


    if (
      !projectWrap ||
      !projectWrap.classList.contains(
        'is-open'
      )
    ) {
      return;
    }


    closeProjectMenu(true);

  }
);


// 07. HERO CATEGORY 링크 hover 효과와 프로젝트 메뉴 포커스 보조

projectLinks.forEach(
  (link) => {

    link.addEventListener(
      'keydown',
      (event) => {

        const links =
          Array.from(
            projectLinks
          );

        const currentIndex =
          links.indexOf(link);


        // 오른쪽 방향키

        if (
          event.key ===
          'ArrowRight'
        ) {

          event.preventDefault();

          const nextIndex =
            (currentIndex + 1)
            % links.length;

          links[
            nextIndex
          ].focus();

        }


        // 왼쪽 방향키

        if (
          event.key ===
          'ArrowLeft'
        ) {

          event.preventDefault();

          const prevIndex =
            (
              currentIndex
              - 1
              + links.length
            )
            % links.length;

          links[
            prevIndex
          ].focus();

        }

      }
    );

  });