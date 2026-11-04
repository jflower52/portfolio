import { PROJECTS } from "./data.js";
import { escapeHtml } from "./ui.js";
import { openProjectModal } from "./modal.js";

/* ==========================================
   [PROJECTS] 프로젝트 목록 렌더링 및 필터링 모듈
========================================== */
export function initProjects() {
  const PAGE_SIZE = 6;
  let state = { filter: "all", query: "", page: 1 };

  const grid = document.getElementById("project-grid");
  const tabs = document.querySelectorAll(".tab");
  const searchInput = document.getElementById("project-search");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageInd = document.getElementById("pageIndicator");

  // 1. 카테고리 탭 필터링 이벤트
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.filter = btn.dataset.filter;
      state.page = 1;
      render();
    });
  });

  // 2. 검색어 입력 필터링 이벤트
  searchInput?.addEventListener("input", (e) => {
    state.query = e.target.value.trim().toLowerCase();
    state.page = 1;
    render();
  });

  // 3. 페이지네이션 이전/다음 버튼 이벤트
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

  // 조건(탭 분류 및 검색어)에 맞는 프로젝트 목록 필터링
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

  // 현재 페이지에 해당하는 데이터 슬라이싱 및 전체 페이지 계산
  function getPages(list) {
    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = list.slice(start, start + PAGE_SIZE);
    return { total, totalPages, pageItems };
  }

  // 개별 프로젝트 카드 HTML 생성 (thumbVideo 존재 시 무음 반복재생 비디오 렌더링)
  function cardHTML(p) {
    const typeLabel = p.type === "team" ? "팀 프로젝트" : "개인 프로젝트";
    const targetImage = p.thumbImage || p.image;

    let thumbContent = "";
    if (p.thumbVideo) {
      thumbContent = `
        <div class="thumb">
          <video src="${p.thumbVideo}" autoplay loop muted playsinline style="width:100%; height:100%; object-fit:cover; display:block;"></video>
        </div>`;
    } else {
      const bgStyle = targetImage
        ? `background: url('${targetImage}') center top / cover no-repeat;`
        : `background: linear-gradient(135deg, ${p.color[0]}, ${p.color[1]});`;
      thumbContent = `<div class="thumb" style="${bgStyle}"></div>`;
    }

    return `
    <article class="card" aria-label="${escapeHtml(p.title)} 카드">
      ${thumbContent}
      <div class="card-overlay">
        <span class="proj-type">${typeLabel}</span>
        <h4>${escapeHtml(p.title)}</h4>
        <p>${escapeHtml(p.desc)}</p>
        <button class="more-btn" data-id="${p.id}">자세히 보기</button>
      </div>
    </article>`;
  }

  // 검색 결과가 없을 때의 안내 문구 HTML 반환
  function emptyHTML() {
    return `<div style="grid-column:1/-1;text-align:center;color:#6b7280;padding:24px 0;">검색 조건에 맞는 프로젝트가 없습니다.</div>`;
  }

  // 화면 렌더링 및 페이지네이션 상태 업데이트
  function render() {
    const list = filteredProjects();
    const { totalPages, pageItems } = getPages(list);

    if (grid) grid.innerHTML = pageItems.map(cardHTML).join("") || emptyHTML();

    if (prevBtn) prevBtn.disabled = state.page <= 1;
    if (nextBtn) nextBtn.disabled = state.page >= totalPages;
    if (pageInd) pageInd.textContent = `${state.page} / ${totalPages}`;
  }

  // 4. 카드 내 '자세히 보기' 클릭 시 상세 모달 호출
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

  render();
}
