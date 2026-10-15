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

// ======== 프로젝트 데이터 ========
const PROJECTS = [
  // --- 팀 프로젝트 ---
  {
    id: 1,
    title: "Good-Ping",
    desc: "네이버 웹툰 굿즈 리뉴얼 사이트",
    type: "team",
    duration: "2025.06.16 ~ 2025.06.27",
    role: "프론트엔드, UI 디자인 및 구현",
    tags: ["Figma", "React", "JS", "Node.js", "PostgreSQL"],
    github: "https://github.com/movieStudioTalk/project",
    deploy: "https://good-ping.onrender.com",
    image: "img/goodping.png",
    video: "video/goodping.mp4",
    report: "report/goodping.pdf",
    color: ["#e3efff", "#f0f5ff"],
  },
  {
    id: 2,
    title: "오늘 한 빵",
    desc: "빵집 탐방 스탬프 투어 앱",
    type: "team",
    duration: "2025.07.01 ~ 2025.07.25",
    role: "디자인, 프론트엔드, 백엔드",
    tags: [
      "Figma",
      "Photoshop",
      "Visual Studio Code",
      "Android Studio",
      "Kotlin",
      "EJS",
      "Node.js",
      "MySQL",
    ],
    github: "https://github.com/orgs/TodayHanBbang/repositories",
    deploy: "https://todayhanbbang.onrender.com/",
    image: "img/todayhanbbang.png",
    video: "video/todayhanbbang.mp4", // 세로 영상도 짤림 없이 재생됩니다.
    report: "report/todayhanbbang.pptx", // pptx로 적용 완료 (클릭 시 다운로드 됨)
    color: ["#ffeaf6", "#fff2fb"],
  },
  {
    id: 3,
    title: "i-Mon",
    desc: "보안 프로그램 파일 암호화 및 통합 관리자 서버 개발",
    type: "team",
    duration: "YYYY.MM ~ YYYY.MM",
    role: "",
    tags: ["HTML", "CSS", "JavaScript"],
    github: "",
    deploy: "",
    image: "",
    video: "",
    report: "",
    color: ["#e6fff4", "#effff8"],
  },
  // --- 개인 프로젝트 ---
  {
    id: 4,
    title: "던데이",
    desc: "일정 관리 프로그램",
    type: "single",
    duration: "2026.09",
    role: "개인 프로젝트 (전체 개발)",
    tags: ["Android Studio", "Java"],
    github: "https://github.com/jflower52/DoneDay_APK",
    deploy:
      "https://github.com/jflower52/DoneDay_APK/releases/download/v1.0.0/doneday.apk",
    image: "",
    video: "",
    report: "",
    color: ["#fff2e6", "#fff8f0"],
  },
  {
    id: 5,
    title: "포켓몬 도감",
    desc: "포켓몬 도감",
    type: "single",
    duration: "YYYY.MM ~ YYYY.MM",
    role: "",
    tags: ["JavaScript", "API"],
    github: "",
    deploy: "",
    image: "",
    video: "",
    report: "",
    color: ["#f2ebff", "#f8f5ff"],
  },
  {
    id: 6,
    title: "ArtB",
    desc: "커미션, 외주, 웹툰 등 다양한 작가님들의 사용이 편한 플랫폼",
    type: "single",
    duration: "YYYY.MM ~ YYYY.MM",
    role: "",
    tags: ["HTML", "CSS", "JavaScript", "React"],
    github: "",
    deploy: "",
    image: "",
    video: "",
    report: "",
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

// Hover시 반투명 오버레이로 나타나는 썸네일 카드
function cardHTML(p) {
  const typeLabel = p.type === "team" ? "팀 프로젝트" : "개인 프로젝트";

  const bgStyle = p.image
    ? `background: url('${p.image}') center top / cover no-repeat;`
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

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        m
      ],
  );
}

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

if (closeProjectModalBtn && projectModal) {
  closeProjectModalBtn.addEventListener("click", () => {
    projectModal.classList.remove("active");
    document.body.style.overflow = "";

    const video = document.querySelector("#pm-visual video");
    if (video) video.pause();
  });
}
if (projectModal) {
  projectModal.addEventListener("click", (e) => {
    if (e.target === projectModal) {
      projectModal.classList.remove("active");
      document.body.style.overflow = "";

      const video = document.querySelector("#pm-visual video");
      if (video) video.pause();
    }
  });
}

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

// 모달 내용 동적 채우기
function openProjectModal(p) {
  document.getElementById("pm-title").textContent = p.title;
  document.getElementById("pm-type").textContent =
    p.type === "team" ? "팀 프로젝트" : "개인 프로젝트";
  document.getElementById("pm-duration").textContent =
    p.duration || "기간 미상";

  const roleWrapper = document.getElementById("pm-role-wrapper");
  if (p.role) {
    document.getElementById("pm-role").textContent = p.role;
    roleWrapper.style.display = "flex";
  } else {
    roleWrapper.style.display = "none";
  }

  const tagsContainer = document.getElementById("pm-tags");
  tagsContainer.innerHTML = p.tags
    .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
    .join("");

  const gitLink = document.getElementById("pm-github");
  const gitWrapper = document.getElementById("pm-github-wrapper");
  if (p.github) {
    gitLink.href = p.github;
    gitLink.textContent = p.github;
    gitWrapper.style.display = "flex";
  } else {
    gitWrapper.style.display = "none";
  }

  const depLink = document.getElementById("pm-deploy");
  const depWrapper = document.getElementById("pm-deploy-wrapper");
  if (p.deploy) {
    depLink.href = p.deploy;
    depLink.textContent = p.deploy;
    depWrapper.style.display = "flex";
  } else {
    depWrapper.style.display = "none";
  }

  // 💡 보고서(PPT) 링크 로직
  const reportLink = document.getElementById("pm-report");
  const reportWrapper = document.getElementById("pm-report-wrapper");
  if (p.report) {
    reportLink.href = p.report;
    // 파일명에 따라 버튼 텍스트 변경
    reportLink.textContent = p.report.endsWith(".pdf")
      ? "PDF 보기 및 다운로드"
      : "PPT 다운로드";
    reportWrapper.style.display = "flex";
  } else {
    reportWrapper.style.display = "none";
  }

  // 비주얼 영역 (세로 영상 짤림 방지 로직 적용됨)
  const visual = document.getElementById("pm-visual");
  if (p.video) {
    visual.innerHTML = `<video src="${p.video}" controls autoplay muted loop style="width:100%; height:100%; object-fit:contain; background-color:#000; border-radius:12px;"></video>`;
  } else if (p.image) {
    visual.innerHTML = `<img src="${p.image}" alt="${escapeHtml(p.title)}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">`;
  } else {
    visual.innerHTML = `<div style="width:100%; height:100%; background:linear-gradient(135deg, ${p.color[0]}, ${p.color[1]}); display:flex; align-items:center; justify-content:center; color:#666; border-radius:12px;">시각 자료 준비중</div>`;
  }

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
