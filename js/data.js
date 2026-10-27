/* ==========================================
   [DATA] 포트폴리오 프로젝트 데이터 목록
   ------------------------------------------
   - id         : 프로젝트 고유 식별 번호
   - title      : 프로젝트 명칭
   - desc       : 카드 오버레이용 한 줄 요약 설명
   - type       : 분류 기준 ("team": 팀 프로젝트 | "single": 개인 프로젝트)
   - duration   : 제작 기간
   - role       : 담당 역할
   - tags       : 사용 기술 스택 배열
   - github     : GitHub 저장소 URL
   - deploy     : 배포 사이트 URL (없을 시 빈 문자열)
   - download   : 설치 파일(APK 등) 다운로드 URL
   - thumbImage : 목록 카드 전용 썸네일 경로 (생략 시 image 사용)
   - image      : 대표 이미지 경로 (모달 및 기본 썸네일)
   - video      : 시연 영상 경로 (존재 시 모달에서 최우선 재생)
   - report     : 결과 보고서/발표자료 파일 경로 (PDF, PPTX)
   - color      : 카드 테마 그라데이션 색상 배열
========================================== */
export const PROJECTS = [
  // 1. Good-Ping (팀 프로젝트)
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
    download: "",
    image: "img/goodping.png",
    video: "video/goodping.mp4",
    report: "report/goodping.pdf",
    color: ["#e3efff", "#f0f5ff"],
  },

  // 2. 오늘 한 빵 (팀 프로젝트)
  {
    id: 2,
    title: "오늘 한 빵",
    desc: "빵집 탐방 스탬프 투어 앱",
    type: "team",
    duration: "2025.07.01 ~ 2025.07.25",
    role: "디자인, 프론트엔드",
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
    download: "",
    image: "img/todayhanbbang.png",
    video: "video/todayhanbbang.mp4",
    report: "report/todayhanbbang.pptx",
    color: ["#ffeaf6", "#fff2fb"],
  },

  // 3. i-Mon (팀 프로젝트)
  {
    id: 3,
    title: "i-Mon",
    desc: "보안 프로그램 파일 암호화 및 통합 관리자 서버 개발",
    type: "team",
    duration: "2025.04.29 ~ 2025.06.11",
    role: "디자인, 프론트엔드",
    tags: [
      "Figma",
      "PhotoShop",
      "Illustrator",
      "HTML",
      "CSS",
      "JavaScript",
      "PHP",
      "Laravel",
      "MariaDB",
      "C#",
    ],
    github: "https://github.com/CodeNation04/CodeNation",
    deploy: "",
    download: "",
    image: "img/imon.png",
    video: "video/imon.mp4",
    report: "report/imon.pdf",
    color: ["#e6fff4", "#effff8"],
  },

  // 4. 던데이 (개인 프로젝트)
  {
    id: 4,
    title: "던데이",
    desc: "일정 관리 프로그램",
    type: "single",
    duration: "2026.09.24 ~ 2026.09.26",
    role: "개인 프로젝트 (전체 개발)",
    tags: [
      "React",
      "CSS",
      "JavaScript",
      "Node.js",
      "Visual Studio Code",
      "Android Studio",
    ],
    github: "https://github.com/jflower52/todolist",
    deploy: "https://todolist-ohj.web.app",
    download:
      "https://github.com/jflower52/DoneDay_APK/releases/download/v1.0.0/doneday.apk",
    thumbImage: "img/doneday1.png",
    image: "img/doneday2.png",
    video: "",
    report: "",
    color: ["#fff2e6", "#fff8f0"],
  },

  // 5. 포켓몬 도감 (개인 프로젝트)
  {
    id: 5,
    title: "포켓몬 도감",
    desc: "포켓몬 도감",
    type: "single",
    duration: "2025.04.17 ~ 2025.04.25",
    role: "개인 프로젝트 (전체 개발)",
    tags: ["React", "Tailwindcss", "Firebase"],
    github: "https://github.com/jflower52/pokemon",
    deploy: "https://pokemon-d5bca.web.app/",
    download: "",
    image: "img/pokemon.png",
    video: "",
    report: "",
    color: ["#f2ebff", "#f8f5ff"],
  },

  // 6. ArtB (개인 프로젝트)
  {
    id: 6,
    title: "ArtB",
    desc: "작가님들 커미션, 외주 등 통합 플랫폼",
    type: "single",
    duration: "2025.03.19 ~ 2025.04.02",
    role: "개인 프로젝트 (전체 개발)",
    tags: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/jflower52/ArtB",
    deploy: "https://jflower52.github.io/ArtB/",
    download: "",
    thumbImage: "img/artb1.png",
    image: "img/artb2.png",
    video: "",
    report: "",
    color: ["#e3efff", "#f0f5ff"],
  },
];
