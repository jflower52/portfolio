// JS/index.js

// 헤더 스크롤 시 배경 색상 변경
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav.fixed-nav');
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
  
  // 프로젝트 탭 전환 기능
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      tabContents.forEach(content => content.classList.remove('active'));
      const target = button.dataset.tab;
      document.getElementById(target).classList.add('active');
    });
  });
  