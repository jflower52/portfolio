// HTML 특수문자 변환 (보안 및 화면 깨짐 방지용)
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
