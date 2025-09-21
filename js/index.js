/* ========== 1) Nav: 색 변화 & 모바일 토글 ========== */
// 스크롤 시 .navbar에 scrolled 클래스 토글, 모바일 메뉴 토글/닫기
const navbar   = document.querySelector(".navbar");
const toggleBtn = document.querySelector(".menu-toggle");
const navMenu  = document.querySelector("#nav-menu");

function onScrollNav() {
  if (window.scrollY > 8) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
}
window.addEventListener("scroll", onScrollNav);
onScrollNav(); // 초기 상태 반영

// 햄버거 버튼 클릭 시 네비 열기/닫기 및 접근성 속성 반영
toggleBtn?.addEventListener("click", () => {
  const opened = navMenu.classList.toggle("open");
  toggleBtn.setAttribute("aria-expanded", String(opened));
});

// 네비 링크 클릭 시 메뉴 닫기
navMenu?.addEventListener("click", (e) => {
  if (e.target.matches(".nav-link")) {
    navMenu.classList.remove("open");
    toggleBtn.setAttribute("aria-expanded", "false");
  }
});


/* ========== 2) ScrollSpy ========== */
// 현재 뷰포트에 들어온 섹션의 id와 일치하는 .nav-link에 active 표시
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
  // 뷰포트 중앙을 지나갈 때 활성화되도록 마진 세팅
  { rootMargin: "-50% 0px -45% 0px", threshold: 0 }
);
sections.forEach((s) => spy.observe(s));


/* ========== 3) Reveal on scroll ========== */
// .reveal 요소가 뷰포트에 들어오면 .visible 추가 (한 번만 실행)
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

// 초기화 함수 (함수명 오타 유지: 기존 코드와 동일 동작을 위해 변경하지 않음)
revelsInit();
function revelsInit() {
  reveals.forEach((el) => ro.observe(el));
}


/* ========== 4) FAB: 맨 위로 버튼 ========== */
// 스크롤 위치에 따라 버튼 노출/비노출, 클릭 시 부드럽게 상단 이동
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


/* ========== 5) 토스트 ========== */
// #toast 요소에 메시지를 표시하고 일정 시간 후 자동 숨김
const toast = document.getElementById("toast");
function showToast(message, timeout = 2000) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), timeout);
}


/* ========== 6) Clipboard Copy (fallback 포함) ========== */
// 최신 Clipboard API 시도 후 실패 시 textarea + execCommand 폴백
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


/* ========== 7) FAB: 이메일 복사 ========== */
// FAB의 이메일 버튼 클릭 시 이메일 주소 복사 후 토스트로 피드백
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


/* ========== 8) Contact 데모 폼 ========== */
// 실제 전송 대신 콘솔 로깅 + 토스트 알림 후 폼 리셋
const form = document.querySelector("#contact-form");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  console.log("Submitted form (demo):", data);
  showToast("메시지가 제출되었습니다! (데모 폼)");
  form.reset();
});


/* ========== 9) Projects: 필터 + Pagination ========== */
// Segmented 버튼으로 타입 필터링, 페이지네이션으로 그리드 표시 제어
const PAGE_SIZE = 6; // 한 페이지 6개 (3x2)
let currentFilter = "all";
let currentPage = 1;

const segContainer = document.querySelector(".segmented");
const segButtons   = document.querySelectorAll(".seg-btn");
const gridEl       = document.getElementById("project-grid");
const projectCards = [...document.querySelectorAll("#project-grid .project")];

const pagerEl = document.getElementById("project-pager");
const prevBtn = pagerEl?.querySelector(".prev");
const nextBtn = pagerEl?.querySelector(".next");
const infoEl  = pagerEl?.querySelector(".pager-info");

// 현재 필터 조건을 만족하는 카드 목록 반환
function getFiltered() {
  return projectCards.filter(
    (card) => currentFilter === "all" || card.dataset.type === currentFilter
  );
}

// 페이지에 따라 표시/숨김 및 페이저 상태 반영
function renderProjects() {
  const list = getFiltered();
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  currentPage = Math.max(1, Math.min(currentPage, totalPages));

  // 모든 카드 숨김 후 현재 페이지만 표시 (display:none으로 빈칸 제거)
  projectCards.forEach((c) => c.classList.add("hide"));
  const start = (currentPage - 1) * PAGE_SIZE;
  const end   = start + PAGE_SIZE;
  list.slice(start, end).forEach((c) => c.classList.remove("hide"));

  // 페이저 상태
  if (infoEl)  infoEl.textContent = `${currentPage} / ${totalPages}`;
  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
}

// 세그먼트(필터) 버튼 클릭 처리
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

// 페이지 버튼 처리
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
