// ======== 헤더 실제 높이로 CSS 변수 동기화 ========
const headerEl = document.querySelector(".site-header");
function syncHeaderHeightVar() {
  const h = headerEl ? headerEl.offsetHeight : 64; // border 포함 실제 렌더 높이
  document.documentElement.style.setProperty("--header-h", `${h}px`);
}
window.addEventListener("load", syncHeaderHeightVar);
window.addEventListener("resize", syncHeaderHeightVar);
document.fonts?.ready?.then?.(syncHeaderHeightVar);

// ======== 헤더: 모바일 토글 ========
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".primary-nav");

navToggle?.addEventListener("click", () => {
  const open = primaryNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

// 메뉴 클릭 시: 부드러운 스크롤 + 스냅 정렬 + 모바일 메뉴 닫기
document.querySelectorAll('.menu a[href^="#"]').forEach((a) => {
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

// ======== 우하단 버튼 ========
document.getElementById("toTopBtn")?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("copyEmailBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("jflower0502@gmail.com");
    toast("이메일이 복사되었습니다.");
  } catch {
    alert("복사에 실패했습니다. 클립보드 권한을 확인해주세요.");
  }
});

// 간단 토스트
function toast(msg) {
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

// ======== 프로젝트 데이터 ========
const PROJECTS = [
  {
    id: 1,
    title: "UI 컴포넌트 시스템",
    desc: "재사용 가능한 컴포넌트와 스토리북 기반 설계",
    type: "team",
    tags: ["HTML", "CSS", "JavaScript"],
    demo: "#",
    code: "#",
    color: ["#e3efff", "#f0f5ff"],
  },
  {
    id: 2,
    title: "실시간 채팅",
    desc: "WebSocket을 사용한 실시간 메시징",
    type: "single",
    tags: ["WebSocket", "JS"],
    demo: "#",
    code: "#",
    color: ["#e6fff4", "#effff8"],
  },
  {
    id: 3,
    title: "API 대시보드",
    desc: "Fetch + 차트 시각화",
    type: "team",
    tags: ["JavaScript", "Fetch"],
    demo: "#",
    code: "#",
    color: ["#ffeaf6", "#fff2fb"],
  },
  {
    id: 4,
    title: "반응형 랜딩 페이지",
    desc: "접근성과 성능 최적화",
    type: "single",
    tags: ["HTML", "CSS"],
    demo: "#",
    code: "#",
    color: ["#e6fff4", "#effff8"],
  },
  {
    id: 5,
    title: "훅 기반 상태관리",
    desc: "React Hooks로 전역 상태 최소화",
    type: "team",
    tags: ["React", "Hooks"],
    demo: "#",
    code: "#",
    color: ["#e3efff", "#f0f5ff"],
  },
  {
    id: 6,
    title: "마크다운 블로그",
    desc: "정적 생성 & 검색",
    type: "single",
    tags: ["JavaScript"],
    demo: "#",
    code: "#",
    color: ["#ffeaf6", "#fff2fb"],
  },
  {
    id: 7,
    title: "디자인 협업 템플릿",
    desc: "Figma → 코드 핸드오프",
    type: "team",
    tags: ["Figma", "HTML", "CSS"],
    demo: "#",
    code: "#",
    color: ["#e3efff", "#f0f5ff"],
  },
  {
    id: 8,
    title: "알고리즘 비주얼라이저",
    desc: "정렬/그래프 시각화",
    type: "single",
    tags: ["JavaScript"],
    demo: "#",
    code: "#",
    color: ["#e6fff4", "#effff8"],
  },
  {
    id: 9,
    title: "폼 빌더",
    desc: "드래그앤드롭 + 검증",
    type: "team",
    tags: ["React", "JS"],
    demo: "#",
    code: "#",
    color: ["#ffeaf6", "#fff2fb"],
  },
];

// ======== 필터/검색/페이지네이션 ========
const PAGE_SIZE = 6;
let state = { filter: "all", query: "", page: 1 };

const grid = document.getElementById("project-grid");
const tabs = document.querySelectorAll(".tab");
const searchInput = document.getElementById("project-search");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageInd = document.getElementById("pageIndicator");

tabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabs.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    state.filter = btn.dataset.filter;
    state.page = 1;
    render();
  });
});

searchInput?.addEventListener("input", (e) => {
  state.query = e.target.value.trim().toLowerCase();
  state.page = 1;
  render();
});

prevBtn?.addEventListener("click", () => {
  if (state.page > 1) {
    state.page--;
    render();
  }
});
nextBtn?.addEventListener("click", () => {
  const totalPages = getPages(filteredProjects()).totalPages;
  if (state.page < totalPages) {
    state.page++;
    render();
  }
});

function filteredProjects() {
  return PROJECTS.filter((p) => {
    const passType = state.filter === "all" ? true : p.type === state.filter;
    const q = state.query;
    const passQuery = !q
      ? true
      : p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
    return passType && passQuery;
  });
}

function getPages(list) {
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (state.page - 1) * PAGE_SIZE;
  const pageItems = list.slice(start, start + PAGE_SIZE);
  return { total, totalPages, pageItems };
}

function render() {
  const list = filteredProjects();
  const { totalPages, pageItems } = getPages(list);

  grid.innerHTML = pageItems.map(cardHTML).join("") || emptyHTML();

  prevBtn.disabled = state.page <= 1;
  nextBtn.disabled = state.page >= totalPages;
  pageInd.textContent = `${state.page} / ${totalPages}`;
}

function cardHTML(p) {
  const tags = p.tags
    .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
    .join("");
  const bg = `background:linear-gradient(135deg, ${p.color[0]}, ${p.color[1]});`;
  return `
  <article class="card" aria-label="${escapeHtml(p.title)} 카드">
    <div class="thumb" style="${bg}"></div>
    <div class="card-body">
      <h4>${escapeHtml(p.title)}</h4>
      <p>${escapeHtml(p.desc)}</p>
      <div class="tags">${tags}</div>
      <div class="actions">
        <a class="btn" href="${p.demo}" target="_blank" rel="noopener">Demo</a>
        <a class="btn" href="${p.code}" target="_blank" rel="noopener">Code</a>
      </div>
    </div>
  </article>`;
}

function emptyHTML() {
  return `<div style="grid-column:1/-1;text-align:center;color:#6b7280;padding:24px 0;">검색 조건에 맞는 프로젝트가 없습니다.</div>`;
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        m
      ])
  );
}

// 초기 렌더
render();
