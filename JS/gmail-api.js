// 1) Google API 설정
const CLIENT_ID =
   "176709535488-ps06stgm1it6e3l48qk3l80qpt08nr94.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/gmail.send";

// 버튼/폼 참조
const btnSignin = document.getElementById("btn-signin");
const btnSignout = document.getElementById("btn-signout");
const mailForm = document.getElementById("mail-form");

// 2) gapi 로드 및 초기화
function handleClientLoad() {
   gapi.load("client:auth2", {
      callback: initClient,
      onerror: () => console.error("gapi.load 실패"),
   });
}

async function initClient() {
   try {
      await gapi.client.init({
         apiKey: "YOUR_API_KEY",
         clientId: CLIENT_ID,
         discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
         ],
         scope: SCOPES,
      });
      const auth = gapi.auth2.getAuthInstance();
      auth.isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(auth.isSignedIn.get());
   } catch (e) {
      console.error("gapi.client.init 에러:", e);
      alert("API 초기화 중 오류 발생: " + e.message);
   }
}

// 3) 로그인 상태 UI 전환
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

// 5) 메일 RAW 생성
function makeRawEmail(to, subject, body) {
   const nl = "\r\n";
   let str = `To: ${to}${nl}`;
   str += `Subject: ${subject}${nl}`;
   str += `Content-Type: text/html; charset=UTF-8${nl}${nl}`;
   str += body;
   return btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
}

// 6) 폼 제출 → Gmail API 호출
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

// 7) 페이지 로드시 Google API 로드
handleClientLoad();
