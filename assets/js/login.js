"use strict";

var loginBtn = document.querySelector('.btn-login');
loginBtn.addEventListener('click', userLogin);
function userLogin() {
  var userEmail = document.querySelector('#userEmail').value.toString();
  var userPassword = document.querySelector('#userPassword').value.toString();
  if (userEmail !== '' && userPassword !== '') {
    axios.post("http://localhost:3000/api/v1/admin/login", {
      'data': {
        'userEmail': userEmail,
        'password': userPassword
      }
    }).then(function (response) {
      var userInfo = response.data.data.user;
      recordUserStatus(userInfo);
      location.replace('reservationList.html');
    })["catch"](function (error) {
      console.log(error);
      alert('帳號錯誤! 請重新輸入!');
    });
  } else {
    alert('請填寫 電子郵件 及 密碼 !');
  }
}
function redirectIfAlreadyLogin() {
  if (blingMotorUserStatus['isLogin'] === true) {
    location.replace('reservationList.html');
  }
}
redirectIfAlreadyLogin();
//# sourceMappingURL=login.js.map
