// ======== 헤더 실제 높이로 CSS 변수 동기화 ========
const headerEl = document.querySelector(".site-header");
function syncHeaderHeightVar() {
  const h = headerEl ? headerEl.offsetHeight : 64;
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

// ======== 프로젝트 데이터 (상세 정보 확장) ========
const PROJECTS = [
  {
    id: 1,
    title: "UI 컴포넌트 시스템",
    desc: "재사용 가능한 컴포넌트와 스토리북 기반 설계",
    type: "team",
    duration: "2023.09 ~ 2023.11 (2개월)",
    tags: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/jflower52/project1",
    deploy: "https://project1-deploy.com",
    image: "", // 실제 이미지가 있다면 "img/project1.png" 처럼 입력 (없으면 컬러 그라데이션)
    video: "", // 영상 파일 경로가 있다면 입력 ("video/sample.mp4")
    color: ["#e3efff", "#f0f5ff"],
  },
  {
    id: 2,
    title: "실시간 채팅",
    desc: "WebSocket을 사용한 실시간 메시징",
    type: "single",
    duration: "2023.12 (1개월)",
    tags: ["WebSocket", "JS"],
    github: "https://github.com/jflower52/project2",
    deploy: "", // 배포 주소가 없다면 비워두기
    image: "",
    color: ["#e6fff4", "#effff8"],
  },
  {
    id: 3,
    title: "API 대시보드",
    desc: "Fetch + 차트 시각화",
    type: "team",
    duration: "2024.01 ~ 2024.03 (3개월)",
    tags: ["JavaScript", "Fetch"],
    github: "https://github.com/jflower52/project3",
    deploy: "https://project3.com",
    image: "",
    color: ["#ffeaf6", "#fff2fb"],
  },
  {
    id: 4,
    title: "반응형 랜딩 페이지",
    desc: "접근성과 성능 최적화",
    type: "single",
    duration: "2024.04 (2주)",
    tags: ["HTML", "CSS"],
    github: "https://github.com/jflower52/project4",
    deploy: "https://project4.com",
    image: "",
    color: ["#e6fff4", "#effff8"],
  },
  {
    id: 5,
    title: "훅 기반 상태관리",
    desc: "React Hooks로 전역 상태 최소화",
    type: "team",
    duration: "2024.05 ~ 2024.06",
    tags: ["React", "Hooks"],
    github: "https://github.com/jflower52/project5",
    deploy: "",
    image: "",
    color: ["#e3efff", "#f0f5ff"],
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

// Hover시 반투명 오버레이로 나타나는 새 카드 UI
function cardHTML(p) {
  const typeLabel = p.type === "team" ? "팀 프로젝트" : "개인 프로젝트";

  // 이미지가 있으면 이미지를 띄우고, 없으면 설정된 색상의 그라데이션으로 띄움
  const bgStyle = p.image
    ? `background: url('${p.image}') center/cover no-repeat;`
    : `background: linear-gradient(135deg, ${p.color[0]}, ${p.color[1]});`;

  return `
  <article class="card" aria-label="${escapeHtml(p.title)} 카드">
    <div class="thumb" style="${bgStyle}"></div>
    
    <!-- Hover 시 나타나는 반투명 오버레이 -->
    <div class="card-overlay">
      <span class="proj-type">${typeLabel}</span>
      <h4>${escapeHtml(p.title)}</h4>
      <p>${escapeHtml(p.desc)}</p>
      <!-- 더보기 버튼 클릭 시 id 값으로 정보를 찾아서 모달을 띄웁니다 -->
      <button class="more-btn" data-id="${p.id}">자세히 보기</button>
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
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        m
      ],
  );
}

// 초기 프로젝트 렌더링 실행
render();

// ======== 스크롤 이벤트 처리 ========
const header = document.querySelector(".site-header");
const scrollIndicator = document.querySelector(".scroll-indicator");

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  if (scrollIndicator) {
    if (window.scrollY > 50) {
      scrollIndicator.classList.add("hidden");
    } else {
      scrollIndicator.classList.remove("hidden");
    }
  }
});

// ======== 이력서 모달창 제어 ========
const resumeModalBtn = document.getElementById("resumeModalBtn");
const resumeModal = document.getElementById("resumeModal");
const closeModalBtn = document.getElementById("closeModalBtn");

if (resumeModalBtn && resumeModal) {
  resumeModalBtn.addEventListener("click", () => {
    resumeModal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
}
if (closeModalBtn && resumeModal) {
  closeModalBtn.addEventListener("click", () => {
    resumeModal.classList.remove("active");
    document.body.style.overflow = "";
  });
}
if (resumeModal) {
  resumeModal.addEventListener("click", (e) => {
    if (e.target === resumeModal) {
      resumeModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// ======== 프로젝트 전용 모달창 제어 ========
const projectModal = document.getElementById("projectModal");
const closeProjectModalBtn = document.getElementById("closeProjectModalBtn");

// 모달 닫기
if (closeProjectModalBtn && projectModal) {
  closeProjectModalBtn.addEventListener("click", () => {
    projectModal.classList.remove("active");
    document.body.style.overflow = "";
  });
}
if (projectModal) {
  projectModal.addEventListener("click", (e) => {
    if (e.target === projectModal) {
      projectModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// 그리드 안에서 "자세히 보기" 버튼을 클릭했을 때 모달을 열어주는 이벤트 위임
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

// 선택된 프로젝트 정보를 바탕으로 모달 내용 채우고 띄우기
function openProjectModal(p) {
  document.getElementById("pm-title").textContent = p.title;
  document.getElementById("pm-type").textContent =
    p.type === "team" ? "팀 프로젝트" : "개인 프로젝트";
  document.getElementById("pm-duration").textContent =
    p.duration || "기간 미상";

  // 사용 기술 태그 렌더링
  const tagsContainer = document.getElementById("pm-tags");
  tagsContainer.innerHTML = p.tags
    .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
    .join("");

  // 깃허브 링크 유무 처리
  const gitLink = document.getElementById("pm-github");
  const gitWrapper = document.getElementById("pm-github-wrapper");
  if (p.github) {
    gitLink.href = p.github;
    gitLink.textContent = p.github;
    gitWrapper.style.display = "flex";
  } else {
    gitWrapper.style.display = "none";
  }

  // 배포 링크 유무 처리
  const depLink = document.getElementById("pm-deploy");
  const depWrapper = document.getElementById("pm-deploy-wrapper");
  if (p.deploy) {
    depLink.href = p.deploy;
    depLink.textContent = p.deploy;
    depWrapper.style.display = "flex";
  } else {
    depWrapper.style.display = "none";
  }

  // 비주얼 영역 (영상 > 이미지 > 기본 컬러 순서로 표시)
  const visual = document.getElementById("pm-visual");
  if (p.video) {
    visual.innerHTML = `<video src="${p.video}" controls autoplay muted loop></video>`;
  } else if (p.image) {
    visual.innerHTML = `<img src="${p.image}" alt="${escapeHtml(p.title)}">`;
  } else {
    visual.innerHTML = `<div style="width:100%; height:100%; background:linear-gradient(135deg, ${p.color[0]}, ${p.color[1]}); display:flex; align-items:center; justify-content:center; color:#666;">이미지/영상 준비중</div>`;
  }

  // 모달 활성화
  projectModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// ======== EmailJS 메일 폼 연동 로직 ========
emailjs.init("ezf6zr_fAcqDybjpi");

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector(".submit-btn");
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '전송 중... <i class="fa-solid fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    emailjs
      .sendForm("service_jflower0502", "template_kjt4qz2", contactForm)
      .then(() => {
        alert(
          "성공적으로 메일이 전송되었습니다! 빠른 시일 내에 회신드리겠습니다.",
        );
        contactForm.reset();
      })
      .catch((error) => {
        alert("메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
        console.error("EmailJS Error:", error);
      })
      .finally(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      });
  });
}
