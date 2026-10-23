export function initEmail() {
  // window.emailjs는 HTML 파일에서 CDN으로 먼저 로드되어 있어야 합니다.
  if (typeof window.emailjs === "undefined") return;

  window.emailjs.init("ezf6zr_fAcqDybjpi");

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector(".submit-btn");
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '전송 중... <i class="fa-solid fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;

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
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        });
    });
  }
}
