// gmail-api.js

// 1) Google API 설정
const CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/gmail.send";

// 버튼/폼 참조
const btnSignin = document.getElementById("btn-signin");
const btnSignout = document.getElementById("btn-signout");
const mailForm = document.getElementById("mail-form");

// 2) gapi 로드 및 초기화
function handleClientLoad() {
   gapi.load("client:auth2", initClient);
}
async function initClient() {
   await gapi.client.init({
      clientId: CLIENT_ID,
      scope: SCOPES,
   });
   gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
   updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
}

// 3) 로그인 상태에 따른 UI 전환
function updateSigninStatus(isSignedIn) {
   if (isSignedIn) {
      btnSignin.style.display = "none";
      btnSignout.style.display = "inline-block";
      mailForm.style.display = "block";
   } else {
      btnSignin.style.display = "inline-block";
      btnSignout.style.display = "none";
      mailForm.style.display = "none";
   }
}

// 4) 로그인/로그아웃 이벤트
btnSignin.onclick = () => gapi.auth2.getAuthInstance().signIn();
btnSignout.onclick = () => gapi.auth2.getAuthInstance().signOut();

// 5) 메일 RAW 생성 (Base64 URL-safe)
function makeRawEmail(to, subject, body) {
   const nl = "\r\n";
   let str = `To: ${to}${nl}Subject: ${subject}${nl}Content-Type: text/html; charset=UTF-8${nl}${nl}${body}`;
   return btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
}

// 6) 폼 제출 시 Gmail API 호출
mailForm.addEventListener("submit", async (e) => {
   e.preventDefault();
   const to = document.getElementById("mail-to").value;
   const subject = document.getElementById("mail-subject").value;
   const body = document.getElementById("mail-body").value;
   const raw = makeRawEmail(to, subject, body);

   try {
      const response = await gapi.client.gmail.users.messages.send({
         userId: "me",
         resource: { raw },
      });
      alert("메일이 전송되었습니다!");
      console.log(response);
      mailForm.reset();
   } catch (err) {
      console.error(err);
      alert("전송 오류: " + (err.result?.error?.message || err.message));
   }
});

// 7) 첫 로드시 Google API 로드
handleClientLoad();
