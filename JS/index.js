/* ===== Nav: 색 변화 & 모바일 토글 ===== */
const navbar = document.querySelector(".navbar");
const toggleBtn = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#nav-menu");

function onScrollNav() {
  if (window.scrollY > 8) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
}
window.addEventListener("scroll", onScrollNav);
onScrollNav();

toggleBtn?.addEventListener("click", () => {
  const opened = navMenu.classList.toggle("open");
  toggleBtn.setAttribute("aria-expanded", String(opened));
});
navMenu?.addEventListener("click", (e) => {
  if (e.target.matches(".nav-link")) {
    navMenu.classList.remove("open");
    toggleBtn.setAttribute("aria-expanded", "false");
  }
});

/* ===== ScrollSpy ===== */
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [
  ...document.querySelectorAll("header.section, section.section"),
].filter((s) => s.id);
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === `#${id}`)
      );
    });
  },
  { rootMargin: "-50% 0px -45% 0px", threshold: 0 }
);
sections.forEach((s) => spy.observe(s));

/* ===== Reveal on scroll ===== */
const reveals = document.querySelectorAll(".reveal");
const ro = new IntersectionObserver(
  (ents) => {
    ents.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        ro.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
revelsInit();
function revelsInit() {
  reveals.forEach((el) => ro.observe(el));
}

/* ===== FAB: to-top ===== */
const toTopBtn = document.querySelector(".fab .to-top");
function updateToTopVisibility() {
  if (window.scrollY > 260) toTopBtn.classList.add("show");
  else toTopBtn.classList.remove("show");
}
window.addEventListener("scroll", updateToTopVisibility);
updateToTopVisibility();
toTopBtn?.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

/* ===== Toast ===== */
const toast = document.getElementById("toast");
function showToast(message, timeout = 2000) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), timeout);
}

/* ===== Clipboard Copy (fallback 포함) ===== */
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
    ta.focus();
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {}
    document.body.removeChild(ta);
    return ok;
  }
}

/* ===== FAB: 이메일 복사 ===== */
const emailBtn = document.querySelector(".fab .email-btn");
emailBtn?.addEventListener("click", async () => {
  const email = "jflower0502@gmail.com";
  const ok = await copyText(email);
  showToast(
    ok
      ? `이메일이 복사되었습니다: ${email}`
      : "복사에 실패했어요. 다시 시도해주세요."
  );
});

/* ===== Contact 데모 폼 ===== */
const form = document.querySelector("#contact-form");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  console.log("Submitted form (demo):", data);
  showToast("메시지가 제출되었습니다! (데모 폼)");
  form.reset();
});

/* ===== Projects: Filter + Pagination ===== */
const PAGE_SIZE = 6; // 한 페이지 6개 (3x2)
let currentFilter = "all";
let currentPage = 1;

const segContainer = document.querySelector(".segmented");
const segButtons = document.querySelectorAll(".seg-btn");
const gridEl = document.getElementById("project-grid");
const projectCards = [...document.querySelectorAll("#project-grid .project")];

const pagerEl = document.getElementById("project-pager");
const prevBtn = pagerEl?.querySelector(".prev");
const nextBtn = pagerEl?.querySelector(".next");
const infoEl = pagerEl?.querySelector(".pager-info");

function getFiltered() {
  return projectCards.filter(
    (card) => currentFilter === "all" || card.dataset.type === currentFilter
  );
}

function renderProjects() {
  const list = getFiltered();
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  currentPage = Math.max(1, Math.min(currentPage, totalPages));

  // 모든 카드 숨김 후 현재 페이지만 표시 (display:none으로 빈칸 제거)
  projectCards.forEach((c) => c.classList.add("hide"));
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  list.slice(start, end).forEach((c) => c.classList.remove("hide"));

  // 페이저 상태
  if (infoEl) infoEl.textContent = `${currentPage} / ${totalPages}`;
  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
}

segContainer?.addEventListener("click", (e) => {
  const btn = e.target.closest(".seg-btn");
  if (!btn) return;
  segButtons.forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-selected", "false");
  });
  btn.classList.add("active");
  btn.setAttribute("aria-selected", "true");

  currentFilter = btn.dataset.filter; // 'all' | 'team' | 'single'
  currentPage = 1;
  renderProjects();
});

prevBtn?.addEventListener("click", () => {
  currentPage--;
  renderProjects();
});
nextBtn?.addEventListener("click", () => {
  currentPage++;
  renderProjects();
});

// 초기 렌더
renderProjects();
