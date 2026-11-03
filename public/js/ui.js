/* ==========================================
   [UTILS] 공통 유틸리티 함수
========================================== */

// HTML 특수문자 이스케이프 변환 (XSS 방지)
export function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        m
      ],
  );
}

// 화면 하단 토스트(Toast) 알림창 표시
export function toast(msg) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.position = "fixed";
  el.style.left = "50%";
  el.style.bottom = "86px";
  el.style.transform = "translateX(-50%)";
  el.style.background = "#1f1f1f";
  el.style.color = "#fff";
  el.style.padding = "10px 14px";
  el.style.borderRadius = "10px";
  el.style.zIndex = "9999";
  el.style.boxShadow = "0 8px 24px rgba(0,0,0,.25)";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

/* ==========================================
   [INIT] 전역 UI 인터랙션 초기화
========================================== */
export function initUI() {
  // 1. 다크모드 테마 제어 (기본값: 다크모드 시작)
  const darkModeBtn = document.getElementById("darkModeBtn");

  if (localStorage.getItem("theme") === "light") {
    document.body.classList.remove("dark-mode");
  } else {
    document.body.classList.add("dark-mode");
  }

  darkModeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // 2. 홈 화면 메인 타이틀 타이핑 애니메이션
  const typingTextElement = document.getElementById("typing-text");
  if (typingTextElement) {
    const text = "프론트엔드 개발자 \n오호준입니다.";
    let index = 0;

    function type() {
      if (index < text.length) {
        let currentStr = text.substring(0, index + 1);

        // 줄바꿈(\n)을 모바일 전용 줄바꿈 태그로 변환 및 이름 강조 처리
        currentStr = currentStr.replace(/\n/g, '<br class="mobile-br" />');
        currentStr = currentStr.replace("오호준", "<strong>오호준</strong>");

        typingTextElement.innerHTML = currentStr;
        index++;

        // 자연스러운 타이핑 연출을 위한 랜덤 속도 (100ms ~ 200ms)
        const typeSpeed = Math.random() * 100 + 100;
        setTimeout(type, typeSpeed);
      }
    }
    setTimeout(type, 500);
  }

  // 3. 상단 헤더 높이 동기화 및 모바일 햄버거 메뉴 토글
  const headerEl = document.querySelector(".site-header");
  function syncHeaderHeightVar() {
    const h = headerEl ? headerEl.offsetHeight : 64;
    document.documentElement.style.setProperty("--header-h", `${h}px`);
  }
  window.addEventListener("load", syncHeaderHeightVar);
  window.addEventListener("resize", syncHeaderHeightVar);
  document.fonts?.ready?.then?.(syncHeaderHeightVar);

  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.querySelector(".primary-nav");

  navToggle?.addEventListener("click", () => {
    const open = primaryNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // 4. 네비게이션 앵커 스무스 스크롤 이동 및 모바일 메뉴 자동 닫기
  document
    .querySelectorAll('.menu a[href^="#"], .site-logo, .scroll-indicator')
    .forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const id = a.getAttribute("href");
        const el = document.querySelector(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          history.pushState(null, "", id);
        }
        if (primaryNav?.classList.contains("open")) {
          primaryNav.classList.remove("open");
          navToggle?.setAttribute("aria-expanded", "false");
        }
      });
    });

  // 5. 우측 하단 플로팅 버튼 (최상단 이동, 이메일 복사) 및 스크롤 상태 감지
  document.getElementById("toTopBtn")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document
    .getElementById("copyEmailBtn")
    ?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText("jflower0502@gmail.com");
        toast("이메일이 복사되었습니다.");
      } catch {
        alert("복사에 실패했습니다. 클립보드 권한을 확인해주세요.");
      }
    });

  const scrollIndicator = document.querySelector(".scroll-indicator");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      headerEl.classList.add("scrolled");
    } else {
      headerEl.classList.remove("scrolled");
    }
    if (scrollIndicator) {
      if (window.scrollY > 50) scrollIndicator.classList.add("hidden");
      else scrollIndicator.classList.remove("hidden");
    }
  });

  // 6. 이력서 모달 닫기 제어 (X 버튼, 바깥 배경 클릭, ESC 키)
  const resumeModal = document.getElementById("resumeModal");

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove("active");
    resumeModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  resumeModal
    ?.querySelector(".modal-close-btn")
    ?.addEventListener("click", closeResumeModal);

  resumeModal?.addEventListener("click", (e) => {
    if (e.target === resumeModal) {
      closeResumeModal();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && resumeModal?.classList.contains("active")) {
      closeResumeModal();
    }
  });
}
