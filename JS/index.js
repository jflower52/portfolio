document.addEventListener("DOMContentLoaded", () => {
   // 네비게이션 배경 토글
   window.addEventListener("scroll", () => {
      document
         .querySelector(".navbar")
         .classList.toggle("scrolled", window.scrollY > 50);
   });

   // 탭 & 페이지네이션
   const tabs = document.querySelectorAll(".tab-btn");
   const cards = Array.from(document.querySelectorAll(".project-card"));
   const pagination = document.querySelector(".pagination");
   let currentTab = "all";
   let currentPage = 1;
   const itemsPerPage = 6;

   // 탭 클릭
   tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
         tabs.forEach((t) => t.classList.remove("active"));
         tab.classList.add("active");
         currentTab = tab.dataset.tab;
         currentPage = 1;
         renderProjects();
      });
   });

   // 페이지네이션 클릭
   pagination.addEventListener("click", (e) => {
      if (!e.target.classList.contains("page-btn")) return;
      const page = Number(e.target.dataset.page);
      if (!isNaN(page)) {
         currentPage = page;
         renderProjects();
      }
   });

   // 페이지 버튼 생성
   function makeBtn(label, page, disabled = false) {
      const btn = document.createElement("button");
      btn.className = "page-btn";
      btn.textContent = label;
      btn.dataset.page = page;
      if (disabled) btn.disabled = true;
      return btn;
   }

   // 프로젝트 렌더링
   function renderProjects() {
      const filtered = cards.filter(
         (card) => currentTab === "all" || card.dataset.category === currentTab
      );
      const pageCount = Math.ceil(filtered.length / itemsPerPage);

      cards.forEach((c) => (c.style.display = "none"));
      const start = (currentPage - 1) * itemsPerPage;
      filtered.slice(start, start + itemsPerPage).forEach((c) => {
         c.style.display = "flex";
      });

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

   // 초기 렌더
   renderProjects();
});
