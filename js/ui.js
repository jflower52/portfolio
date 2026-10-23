// HTML 특수문자 변환
export function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        m
      ],
  );
}

// 하단 알림창 (Toast)
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

export function initUI() {
  // === 다크모드 토글 로직 ===
  const darkModeBtn = document.getElementById("darkModeBtn");

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }

  darkModeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // === 메인 화면 타이핑 효과 ===
  const typingTextElement = document.getElementById("typing-text");
  if (typingTextElement) {
    const text = "프론트엔드 개발자 \n오호준입니다.";
    let index = 0;

    function type() {
      if (index < text.length) {
        let currentStr = text.substring(0, index + 1);

        // 줄바꿈 기호를 <br>로 변환
        currentStr = currentStr.replace(/\n/g, '<br class="mobile-br" />');
        // '오호준'이 완성되면 strong 태그로 감싸기
        currentStr = currentStr.replace("오호준", "<strong>오호준</strong>");

        typingTextElement.innerHTML = currentStr;
        index++;

        // 사람처럼 타이핑 속도에 불규칙한 느낌 주기 (100ms ~ 200ms)
        const typeSpeed = Math.random() * 100 + 100;
        setTimeout(type, typeSpeed);
      }
    }
    // 페이지 로드 후 0.5초 뒤에 타이핑 시작
    setTimeout(type, 500);
  }

  // === 헤더 및 네비게이션 제어 ===
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

  // === 플로팅 버튼 제어 ===
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
}
