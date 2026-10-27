import { PROJECTS } from "./data.js";
import { escapeHtml } from "./ui.js";
import { openProjectModal } from "./modal.js";

/* ==========================================
   [PROJECTS] 프로젝트 목록 렌더링 및 필터링 모듈
========================================== */
export function initProjects() {
  const PAGE_SIZE = 6;

  // 프로젝트 검색, 탭 필터, 현재 페이지 번호를 관리하는 상태 객체
  let state = { filter: "all", query: "", page: 1 };

  // DOM 요소 참조
  const grid = document.getElementById("project-grid");
  const tabs = document.querySelectorAll(".tab");
  const searchInput = document.getElementById("project-search");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageInd = document.getElementById("pageIndicator");

  // 1. 상단 카테고리 탭(All, Team, Single) 클릭 이벤트 제어
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.filter = btn.dataset.filter;
      state.page = 1; // 필터 변경 시 첫 페이지로 초기화
      render();
    });
  });

  // 2. 검색창 입력 이벤트 제어 (제목 및 태그 기반 실시간 검색)
  searchInput?.addEventListener("input", (e) => {
    state.query = e.target.value.trim().toLowerCase();
    state.page = 1; // 검색어 변경 시 첫 페이지로 초기화
    render();
  });

  // 3. 페이지네이션 이전 버튼 클릭 이벤트
  prevBtn?.addEventListener("click", () => {
    if (state.page > 1) {
      state.page--;
      render();
    }
  });

  // 4. 페이지네이션 다음 버튼 클릭 이벤트
  nextBtn?.addEventListener("click", () => {
    const totalPages = getPages(filteredProjects()).totalPages;
    if (state.page < totalPages) {
      state.page++;
      render();
    }
  });

  // 5. 현재 상태(탭, 검색어)에 따른 프로젝트 필터링 함수
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

  // 6. 페이지네이션 단위로 데이터 슬라이싱 및 총 페이지 수 계산 함수
  function getPages(list) {
    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = list.slice(start, start + PAGE_SIZE);
    return { total, totalPages, pageItems };
  }

  // 7. 개별 프로젝트 카드 HTML 템플릿 생성 함수 (썸네일 또는 그라데이션 배경)
  function cardHTML(p) {
    const typeLabel = p.type === "team" ? "팀 프로젝트" : "개인 프로젝트";
    const targetImage = p.thumbImage || p.image;
    const bgStyle = targetImage
      ? `background: url('${targetImage}') center top / cover no-repeat;`
      : `background: linear-gradient(135deg, ${p.color[0]}, ${p.color[1]});`;

    return `
    <article class="card" aria-label="${escapeHtml(p.title)} 카드">
      <div class="thumb" style="${bgStyle}"></div>
      <div class="card-overlay">
        <span class="proj-type">${typeLabel}</span>
        <h4>${escapeHtml(p.title)}</h4>
        <p>${escapeHtml(p.desc)}</p>
        <button class="more-btn" data-id="${p.id}">자세히 보기</button>
      </div>
    </article>`;
  }

  // 8. 검색 결과가 없을 때 표시할 빈 상태 HTML 생성 함수
  function emptyHTML() {
    return `<div style="grid-column:1/-1;text-align:center;color:#6b7280;padding:24px 0;">검색 조건에 맞는 프로젝트가 없습니다.</div>`;
  }

  // 9. 화면 렌더링 및 페이지네이션 버튼 활성화/비활성화 상태 동기화 함수
  function render() {
    const list = filteredProjects();
    const { totalPages, pageItems } = getPages(list);

    if (grid) grid.innerHTML = pageItems.map(cardHTML).join("") || emptyHTML();

    if (prevBtn) prevBtn.disabled = state.page <= 1;
    if (nextBtn) nextBtn.disabled = state.page >= totalPages;
    if (pageInd) pageInd.textContent = `${state.page} / ${totalPages}`;
  }

  // 10. 프로젝트 카드 그리드 내 "자세히 보기" 버튼 클릭 이벤트 위임 (모달 호출)
  if (grid) {
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".more-btn");
      if (btn) {
        const id = parseInt(btn.dataset.id, 10);
        const proj = PROJECTS.find((p) => p.id === id);
        if (proj) {
          openProjectModal(proj);
        }
      }
    });
  }

  // 초기 렌더링 실행
  render();
}
