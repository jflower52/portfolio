import { PROJECTS } from "./data.js";
import { escapeHtml } from "./ui.js";
import { openProjectModal } from "./modal.js";

export function initProjects() {
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

  function emptyHTML() {
    return `<div style="grid-column:1/-1;text-align:center;color:#6b7280;padding:24px 0;">검색 조건에 맞는 프로젝트가 없습니다.</div>`;
  }

  function render() {
    const list = filteredProjects();
    const { totalPages, pageItems } = getPages(list);

    if (grid) grid.innerHTML = pageItems.map(cardHTML).join("") || emptyHTML();

    if (prevBtn) prevBtn.disabled = state.page <= 1;
    if (nextBtn) nextBtn.disabled = state.page >= totalPages;
    if (pageInd) pageInd.textContent = `${state.page} / ${totalPages}`;
  }

  // "자세히 보기" 버튼 이벤트 위임
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
