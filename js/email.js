/* ==========================================
   [EMAIL] EmailJS 기반 메일 전송 모듈
========================================== */
export function initEmail() {
  // 1. window.emailjs 객체가 CDN을 통해 정상 로드되었는지 확인
  if (typeof window.emailjs === "undefined") return;

  // 2. EmailJS Public Key를 사용해 서비스 초기화
  window.emailjs.init("ezf6zr_fAcqDybjpi");

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    // 3. Contact 폼 제출(Submit) 이벤트 가로채기 및 비동기 전송 처리
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // 전송 중 버튼 상태 비활성화 및 로딩 스피너 표시
      const submitBtn = contactForm.querySelector(".submit-btn");
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '전송 중... <i class="fa-solid fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;

      // 4. EmailJS 서비스 및 템플릿 ID를 통한 폼 데이터 전송
      window.emailjs
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
          // 전송 완료 또는 실패 시 버튼 상태 원복
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        });
    });
  }
}
