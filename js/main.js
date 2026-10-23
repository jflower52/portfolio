import { initUI } from "./ui.js";
import { initModals } from "./modal.js";
import { initProjects } from "./projects.js";
import { initEmail } from "./email.js";

// HTML 문서가 전부 로드되면 모든 기능을 실행합니다.
document.addEventListener("DOMContentLoaded", () => {
  initUI();
  initModals();
  initProjects();
  initEmail();
});
