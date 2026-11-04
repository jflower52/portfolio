import { escapeHtml } from "./ui.js";

/* ==========================================
   [MODAL] 모달창 열기 및 닫기 이벤트 초기화
========================================== */
export function initModals() {
  // 1. 이력서 모달 제어 로직
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

  // 2. 프로젝트 상세 모달 닫기 제어 함수
  const projectModal = document.getElementById("projectModal");
  const closeProjectModalBtn = document.getElementById("closeProjectModalBtn");

  function closeProjectModal() {
    projectModal.classList.remove("active");
    document.body.style.overflow = "";
    const video = document.querySelector("#pm-visual video");
    if (video) video.pause(); // 모달 닫힐 때 재생 중인 시연 영상 정지
  }

  if (closeProjectModalBtn && projectModal) {
    closeProjectModalBtn.addEventListener("click", closeProjectModal);
  }
  if (projectModal) {
    projectModal.addEventListener("click", (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }
}

/* ==========================================
   [HELPER] 보고서 파일 경로 및 라벨 변환 함수
========================================== */
// PPT/PPTX 파일은 웹에서 즉시 미리보기가 가능하도록 MS Office 웹 뷰어 URL로 변환
function getReportHref(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".ppt") || lower.endsWith(".pptx")) {
    const fileUrl = new URL(filePath, window.location.href).href;
    return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`;
  }
  return filePath;
}

// 확장자별 기본 링크 텍스트 반환
function getDefaultReportLabel(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".pdf")) return "PDF 보기 및 다운로드";
  if (lower.endsWith(".ppt") || lower.endsWith(".pptx"))
    return "PPT 보기 및 다운로드";
  return "보고서 다운로드";
}

/* ==========================================
   [DATA BINDING] 프로젝트 상세 데이터 모달 바인딩
========================================== */
export function openProjectModal(p) {
  const projectModal = document.getElementById("projectModal");

  // 기본 텍스트 및 태그 정보 바인딩
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

  // GitHub 저장소 링크 제어
  const gitWrapper = document.getElementById("pm-github-wrapper");
  if (p.github) {
    const gitLink = document.getElementById("pm-github");
    gitLink.href = p.github;
    gitLink.textContent = p.github;
    gitWrapper.style.display = "flex";
  } else {
    gitWrapper.style.display = "none";
  }

  // 배포 주소 링크 제어
  const depWrapper = document.getElementById("pm-deploy-wrapper");
  if (p.deploy) {
    const depLink = document.getElementById("pm-deploy");
    depLink.href = p.deploy;
    depLink.textContent = p.deploy;
    depWrapper.style.display = "flex";
  } else {
    depWrapper.style.display = "none";
  }

  // 설치 파일(APK 등) 다운로드 링크 제어
  const downWrapper = document.getElementById("pm-download-wrapper");
  if (p.download) {
    const downLink = document.getElementById("pm-download");
    downLink.href = p.download;
    downLink.textContent = p.download.endsWith(".apk")
      ? "APK 파일 다운로드"
      : "파일 다운로드";
    downWrapper.style.display = "flex";
  } else {
    downWrapper.style.display = "none";
  }

  // 보고서 파일 링크 제어 (단일 문자열 및 다중 배열 지원)
  const reportWrapper = document.getElementById("pm-report-wrapper");
  if (Array.isArray(p.report) && p.report.length > 0) {
    const linksHtml = p.report
      .map((item) => {
        const filePath = typeof item === "string" ? item : item.file;
        const label =
          typeof item === "string"
            ? getDefaultReportLabel(item)
            : item.label || getDefaultReportLabel(item.file);
        const href = getReportHref(filePath);
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
      })
      .join("");

    reportWrapper.innerHTML = `
      <strong>보고서</strong>
      <div style="display:flex; flex-direction:column; gap:8px;">${linksHtml}</div>
    `;
    reportWrapper.style.display = "flex";
  } else if (typeof p.report === "string" && p.report.trim() !== "") {
    const href = getReportHref(p.report);
    const label = getDefaultReportLabel(p.report);
    reportWrapper.innerHTML = `
      <strong>보고서</strong>
      <a id="pm-report" href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>
    `;
    reportWrapper.style.display = "flex";
  } else {
    reportWrapper.style.display = "none";
  }

  // 상단 시연 미디어 영역 렌더링 (영상 우선 -> 이미지 -> 그라데이션 대체 순)
  const visual = document.getElementById("pm-visual");
  if (p.video) {
    visual.innerHTML = `<video src="${p.video}" controls autoplay muted loop style="width:100%; height:100%; object-fit:contain; background-color:#000; border-radius:12px;"></video>`;
  } else if (p.image) {
    visual.innerHTML = `<img src="${p.image}" alt="${escapeHtml(p.title)}" style="width:100%; height:100%; object-fit:contain; background-color:#e5e7eb; border-radius:12px;">`;
  } else {
    visual.innerHTML = `<div style="width:100%; height:100%; background:linear-gradient(135deg, ${p.color[0]}, ${p.color[1]}); display:flex; align-items:center; justify-content:center; color:#666; border-radius:12px;">시각 자료 준비중</div>`;
  }

  // 모달창 활성화 및 배경 스크롤 잠금
  projectModal.classList.add("active");
  document.body.style.overflow = "hidden";
}
