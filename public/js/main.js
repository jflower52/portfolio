/* ==========================================
   [MAIN] 애플리케이션 진입점 (Entry Point)
   - 각 기능별 모듈(UI, 모달, 프로젝트, 이메일)을 임포트하여 초기화
========================================== */
import { initUI } from "./ui.js";
import { initModals } from "./modal.js";
import { initProjects } from "./projects.js";
import { initEmail } from "./email.js";

// HTML 문서 구조가 완전히 로드된 시점에 전체 모듈 기능 실행
document.addEventListener("DOMContentLoaded", () => {
  initUI();
  initModals();
  initProjects();
  initEmail();
});
