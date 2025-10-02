const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const on = (el, type, fn, opt) => el && el.addEventListener(type, fn, opt);

/* 공통 DOM */
const navbar = $(".navbar");
const toggleBtn = $(".menu-toggle");
const navMenu = $("#nav-menu");
const themeBtn = $(".theme-toggle");

/* Navbar 배경 전환 */
function onScrollNav() {
  if ((window.scrollY || 0) > 12) navbar?.classList.add("scrolled");
  else navbar?.classList.remove("scrolled");
}
on(window, "scroll", onScrollNav);
onScrollNav();

/* 모바일 메뉴 */
on(toggleBtn, "click", () => {
  const opened = navMenu.classList.toggle("open");
  toggleBtn.setAttribute("aria-expanded", String(opened));
});
on(navMenu, "click", (e) => {
  if (e.target.matches(".nav-link")) {
    navMenu.classList.remove("open");
    toggleBtn.setAttribute("aria-expanded", "false");
  }
});

/* ScrollSpy (부드러운 proximity 스냅과 함께 동작) */
const sections = $$("header.section, section.section");
const navLinks = $$(".nav-link");
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((a) => {
        const active = a.getAttribute("href") === `#${id}`;
        a.classList.toggle("active", active);
        a.setAttribute("aria-current", active ? "true" : "false");
      });
    });
  },
  { root: null, rootMargin: "-50% 0px -45% 0px", threshold: 0 }
);
sections.forEach((s) => spy.observe(s));

/* Reveal */
const reveals = $$(".reveal");
const ro = new IntersectionObserver(
  (ents) =>
    ents.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        ro.unobserve(e.target);
      }
    }),
  { root: null, threshold: 0.15 }
);
reveals.forEach((el) => ro.observe(el));

/* ToTop */
const toTopBtn = $(".fab .to-top");
function updateToTopVisibility() {
  toTopBtn?.classList.toggle("show", (window.scrollY || 0) > 260);
}
on(window, "scroll", updateToTopVisibility);
updateToTopVisibility();
on(toTopBtn, "click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* 토스트 & 이메일 복사 */
const toast = $("#toast");
function showToast(message, timeout = 2000) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), timeout);
}
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {}
    document.body.removeChild(ta);
    return ok;
  }
}
on($(".fab .email-btn"), "click", async () => {
  const email = "jflower0502@gmail.com";
  const ok = await copyText(email);
  showToast(
    ok
      ? `이메일이 복사되었습니다: ${email}`
      : "복사에 실패했어요. 다시 시도해주세요."
  );
});

/* ===== 테마 전환 (아이콘 버튼 스타일 + 상태반영) ===== */
const THEME_KEY = "hojun.theme";

/* 버튼 상태 반영: 라이트 = pressed:true */
function reflectThemeButton() {
  const isLight =
    (document.documentElement.getAttribute("data-theme") || "dark") === "light";
  themeBtn?.setAttribute("aria-pressed", String(isLight));
}

/* 초기 로드: 저장된 테마 적용 + 상태 반영 */
(function () {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  reflectThemeButton();
})();

/* 클릭 시 토글 + 상태 반영 */
on(themeBtn, "click", () => {
  const root = document.documentElement;
  const curr = root.getAttribute("data-theme") || "dark";
  const next = curr === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  reflectThemeButton();
});

/* Contact 데모 폼 */
const form = $("#contact-form");
on(form, "submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  let valid = true;
  const setErr = (el, msg) => {
    const err = el.closest(".field").querySelector(".err");
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    err.textContent = msg || "";
    valid = valid && !msg;
  };
  const nameEl = form.elements.namedItem("name");
  setErr(nameEl, !data.name?.trim() ? "이름을 입력해주세요." : "");
  const emailEl = form.elements.namedItem("email");
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "");
  setErr(emailEl, !emailOk ? "유효한 이메일을 입력해주세요." : "");
  const msgEl = form.elements.namedItem("message");
  setErr(msgEl, !data.message?.trim() ? "메시지를 입력해주세요." : "");
  if (!valid) return;

  console.log("Submitted form (demo):", data);
  showToast("메시지가 제출되었습니다! (데모 폼)");
  form.reset();
});

/* Projects: 필터/검색/페이징 (동일) */
const PAGE_SIZE = 6;
let currentFilter = "all";
let currentPage = 1;
let currentQuery = "";

const segContainer = $(".segmented");
const segButtons = $$(".seg-btn");
const projectCards = $$("#project-grid .project");

const pagerEl = $("#project-pager");
const prevBtn = pagerEl?.querySelector(".prev");
const nextBtn = pagerEl?.querySelector(".next");
const infoEl = pagerEl?.querySelector(".pager-info");
const searchInput = $("#project-search");

function getFiltered() {
  const q = currentQuery.trim().toLowerCase();
  return projectCards.filter((card) => {
    const typeOk =
      currentFilter === "all" || card.dataset.type === currentFilter;
    if (!typeOk) return false;
    if (!q) return true;
    const title = (card.dataset.title || "").toLowerCase();
    const tags = (card.dataset.tags || "").toLowerCase();
    return title.includes(q) || tags.includes(q);
  });
}
function renderProjects() {
  const list = getFiltered();
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  currentPage = Math.max(1, Math.min(currentPage, totalPages));

  projectCards.forEach((c) => c.classList.add("hide"));
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  list.slice(start, end).forEach((c) => c.classList.remove("hide"));

  if (infoEl) infoEl.textContent = `${currentPage} / ${totalPages}`;
  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
}
on(segContainer, "click", (e) => {
  const btn = e.target.closest(".seg-btn");
  if (!btn) return;
  segButtons.forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-selected", "false");
  });
  btn.classList.add("active");
  btn.setAttribute("aria-selected", "true");
  currentFilter = btn.dataset.filter;
  currentPage = 1;
  renderProjects();
});
let searchDebounce;
on(searchInput, "input", (e) => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    currentQuery = e.target.value || "";
    currentPage = 1;
    renderProjects();
  }, 120);
});
on(prevBtn, "click", () => {
  currentPage--;
  renderProjects();
});
on(nextBtn, "click", () => {
  currentPage++;
  renderProjects();
});
renderProjects();
