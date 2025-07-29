// JS/index.js

document.addEventListener("DOMContentLoaded", () => {
   // 1) 네비게이션 배경 토글
   window.addEventListener("scroll", () => {
      document
         .querySelector(".navbar")
         .classList.toggle("scrolled", window.scrollY > 50);
   });

   // 2) 탭 & 페이지네이션 요소 참조
   const tabs = document.querySelectorAll(".tab-btn");
   const cards = Array.from(document.querySelectorAll(".project-card"));
   const pagination = document.querySelector(".pagination");

   // 3) 상태 변수 초기화
   let currentTab = "all";
   let currentPage = 1;
   const itemsPerPage = 6;

   // 4) 탭 클릭 시 필터링 & 페이지 재설정
   tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
         tabs.forEach((t) => t.classList.remove("active"));
         tab.classList.add("active");
         currentTab = tab.dataset.tab;
         currentPage = 1;
         renderProjects();
      });
   });

   // 5) 페이지네이션 클릭 시 페이지 변경
   pagination.addEventListener("click", (e) => {
      if (!e.target.classList.contains("page-btn")) return;
      const page = Number(e.target.dataset.page);
      if (!isNaN(page)) {
         currentPage = page;
         renderProjects();
      }
   });

   // 6) 페이지 버튼 생성 헬퍼
   function makeBtn(label, page, disabled = false) {
      const btn = document.createElement("button");
      btn.className = "page-btn";
      btn.textContent = label;
      btn.dataset.page = page;
      if (disabled) btn.disabled = true;
      return btn;
   }

   // 7) 프로젝트 카드 필터링·페이지네이션·렌더링
   function renderProjects() {
      // 7.1) 필터링
      const filtered = cards.filter(
         (card) => currentTab === "all" || card.dataset.category === currentTab
      );

      // 7.2) 총 페이지 수 계산
      const pageCount = Math.ceil(filtered.length / itemsPerPage);

      // 7.3) 카드 표시/숨김
      cards.forEach((c) => (c.style.display = "none"));
      const start = (currentPage - 1) * itemsPerPage;
      filtered
         .slice(start, start + itemsPerPage)
         .forEach((c) => (c.style.display = "flex"));

      // 7.4) 페이지 버튼 생성
      pagination.innerHTML = "";
      pagination.appendChild(makeBtn("« First", 1, currentPage === 1));
      pagination.appendChild(
         makeBtn("‹ Prev", Math.max(1, currentPage - 1), currentPage === 1)
      );

      for (let i = 1; i <= pageCount; i++) {
         const btn = makeBtn(i, i);
         if (i === currentPage) btn.classList.add("active");
         pagination.appendChild(btn);
      }

      pagination.appendChild(
         makeBtn(
            "Next ›",
            Math.min(pageCount, currentPage + 1),
            currentPage === pageCount
         )
      );
      pagination.appendChild(
         makeBtn("Last »", pageCount, currentPage === pageCount)
      );
   }

   // 8) 초기 렌더 호출
   renderProjects();
});
