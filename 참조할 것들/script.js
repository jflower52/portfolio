// 
let observer = new IntersectionObserver((entries) => {
  entries.forEach((box) => {
    if (box.isIntersecting) {
      box.target.style.opacity = 1;
    } else {
      box.target.style.opacity = 0;
    }
  });
});

let introBoxes = document.querySelectorAll(".introBox");
for (let i = 0; i < 4; i++) {
  observer.observe(introBoxes[i]);
}

let newObserver = new IntersectionObserver((entries) => {
  entries.forEach((box) => {
    if (box.isIntersecting) {
      box.target.style.opacity = 1;
      box.target.style.transform = "translateX(0)";
    } else {
      box.target.style.opacity = 0;
      box.target.style.transform = "translateX(-200px)";
    }
  });
});

// 새로운 observer 적용
newObserver.observe(introBoxes[4]);



document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll("#web-main div");
  let currentIndex = 0;

  function showImage(index) {
    images.forEach((image, i) => {
      if (i === index) {
        image.classList.add("active");
      } else {
        image.classList.remove("active");
      }
    });
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }

  // 첫 번째 이미지 표시
  showImage(currentIndex);
  setInterval(nextImage, 4000); 
});
