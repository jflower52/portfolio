/* ============================================================
 * 원-페이징 전용 UX 보강
 * - Snap 컨테이너 기준 ScrollSpy(메뉴 Active 정확도 개선)
 * - 컨테이너/윈도우 이중 스크롤 대응
 * - 네비 앵커 클릭 시 컨테이너로 부드럽게 스크롤
 * - 테마 토글, FAB/토스트, 프로젝트 필터+검색+페이지네이션, 폼 유효성
 * ============================================================ */

/* ---------- 유틸 ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const on = (el, type, fn, opt) => el && el.addEventListener(type, fn, opt);

/* 공통 DOM */
const snapContainer = $(".snap-container");
const navbar = $(".navbar");
const toggleBtn = $(".menu-toggle");
const navMenu = $("#nav-menu");
const themeBtn = $(".theme-toggle");

/* 컨테이너/윈도우 최대 스크롤값 (네비 상태/맨위버튼 표시용) */
function getScrollOffset() {
  const mainOffset = snapContainer ? snapContainer.scrollTop : 0;
  const pageOffset = window.scrollY || 0;
  return Math.max(mainOffset, pageOffset);
}

/* ---------- 1) Navbar 상태 & 모바일 토글 ---------- */
function onScrollNav() {
  if (getScrollOffset() > 12) navbar?.classList.add("scrolled");
  else navbar?.classList.remove("scrolled");
}
[window, snapContainer]
  .filter(Boolean)
  .forEach((t) => on(t, "scroll", onScrollNav));
onScrollNav();

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

/* ---------- 2) Snap 내 앵커 스크롤 보정 ---------- */
/* a[href^="#"] 클릭 시 기본동작을 막고, 스냅 컨테이너로 스크롤하도록 통일 */
function scrollToHash(hash) {
  const id = (hash || "").replace(/^#/, "");
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  // 섹션이 스냅 컨테이너 자식이므로, scrollIntoView가 컨테이너를 스크롤
  target.scrollIntoView({ block: "start", behavior: "smooth" });
  // 접근성: 섹션 포커스 가능하게
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}
on(document, "click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const href = a.getAttribute("href");
  const id = href.slice(1);
  const tgt = document.getElementById(id);
  if (tgt && snapContainer) {
    e.preventDefault();
    history.replaceState(null, "", href);
    scrollToHash(href);
  }
});
// 새로고침 시 해시가 있으면 해당 섹션으로 이동
if (location.hash) setTimeout(() => scrollToHash(location.hash), 0);

/* ---------- 3) ScrollSpy (스냅 컨테이너 기준) ---------- */
const navLinks = $$(".nav-link");
const sections = $$("header.section, section.section").filter((s) => s.id);
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
  {
    root: snapContainer || null, // ★ 핵심: 컨테이너 기준으로 관찰
    rootMargin: "-50% 0px -45% 0px", // 섹션 중앙 부근에서 활성화
    threshold: 0,
  }
);
sections.forEach((s) => spy.observe(s));

/* ---------- 4) Reveal on scroll ---------- */
const reveals = $$(".reveal");
const ro = new IntersectionObserver(
  (ents) => {
    ents.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        ro.unobserve(e.target);
      }
    });
  },
  { root: snapContainer || null, threshold: 0.15 }
);
function revelsInit() {
  reveals.forEach((el) => ro.observe(el));
}
revelsInit();

/* ---------- 5) FAB: 맨 위로 ---------- */
const toTopBtn = $(".fab .to-top");
function updateToTopVisibility() {
  if (!toTopBtn) return;
  toTopBtn.classList.toggle("show", getScrollOffset() > 260);
}
[window, snapContainer]
  .filter(Boolean)
  .forEach((t) => on(t, "scroll", updateToTopVisibility));
updateToTopVisibility();
on(toTopBtn, "click", () => {
  snapContainer?.scrollTo({ top: 0, behavior: "smooth" });
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------- 6) 토스트 ---------- */
const toast = $("#toast");
function showToast(message, timeout = 2000) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), timeout);
}

/* ---------- 7) 클립보드 & 이메일 FAB ---------- */
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

/* ---------- 8) 테마 전환 (로컬 저장) ---------- */
const THEME_KEY = "hojun.theme";
(function applySavedTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) document.documentElement.setAttribute("data-theme", saved);
})();
on(themeBtn, "click", () => {
  const root = document.documentElement;
  const curr = root.getAttribute("data-theme") || "dark";
  const next = curr === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
});

/* ---------- 9) Contact 데모 폼 (간단 검사) ---------- */
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

/* ---------- 10) Projects: 필터 + 검색 + 페이지네이션 ---------- */
const PAGE_SIZE = 6;
let currentFilter = "all";
let currentPage = 1;
let currentQuery = "";

const segContainer = $(".segmented");
const segButtons = $$(".seg-btn");
const gridEl = $("#project-grid");
const projectsWindow = $(".projects-window");
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

  projectsWindow?.scrollTo({ top: 0, behavior: "smooth" });
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
