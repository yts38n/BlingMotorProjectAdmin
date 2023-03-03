"use strict";

var userToken = blingMotorUserStatus['userInfo']['userEmail'];
var allReservationData = [];
var calendarData = {};
var currentEdit = {};
var tbody = document.querySelector('tbody');
var editReservationElement = "\n<div class=\"reservationItem\">\n    <div class=\"calendar-wrap\">\n        <div class=\"calendar\" id=\"calendar\"></div>\n\n        <div class=\"pickerColorGuide\">\n            <div class=\"pickerColorGuide-item\">\n                <div class=\"colorBox colorBox-red\"></div>\n                <p>\u9810\u7D04\u5DF2\u6EFF</p>\n            </div>\n            <div class=\"pickerColorGuide-item\">\n                <div class=\"colorBox colorBox-gray\"></div>\n                <p>\u53EF\u9810\u7D04</p>\n            </div>\n            <div class=\"pickerColorGuide-item\">\n                <div class=\"colorBox colorBox-green\"></div>\n                <p>\u5DF2\u9078\u64C7</p>\n            </div>\n        </div>\n    </div>\n\n    <form action=\"\" class=\"bookingDetails-form\">        \n        <div class=\"form-group\">\n            <div class=\"newBooking-input\">\n                <label for=\"selectedDate\">\u9810\u7D04\u65E5\u671F</label>\n                <input type=\"text\" id=\"selectedDate\" name=\"\u9810\u7D04\u65E5\u671F\" readonly value=\"\" class=\"form-control-plaintext\">\n            </div>\n        </div>\n        \n        <div class=\"form-group\">\n            <div class=\"newBooking-input\">\n                <label for=\"status\">\u9810\u7D04\u72C0\u614B</label>\n                <select class=\"form-select form-select-sm\" id=\"bookingStatus\">\n                    <option value=\"\u9810\u7D04\u6210\u529F\">\u9810\u7D04\u6210\u529F</option>\n                    <option value=\"\u6E05\u6D17\u4E2D\">\u6E05\u6D17\u4E2D</option>\n                    <option value=\"\u5F85\u53D6\u8ECA\">\u5F85\u53D6\u8ECA</option>\n                    <option value=\"\u5DF2\u5B8C\u6210\">\u5DF2\u5B8C\u6210</option>\n                    <option value=\"\u5DF2\u53D6\u6D88\">\u5DF2\u53D6\u6D88</option>\n                </select>\n            </div>\n        </div>\n\n        <div class=\"form-group\">\n            <div class=\"newBooking-input\">\n                <label for=\"selectedPlan\">\u5957\u88DD</label>\n                <select class=\"form-select form-select-sm\" id=\"selectedPlan\">\n                    <option selected disabled>\u8ACB\u9078\u64C7\u5957\u88DD</option>\n                    <option value=\"\u57FA\u790E\u8B77\u7406\">\u57FA\u790E\u8B77\u7406</option>\n                    <option value=\"\u9032\u968E\u934D\u6676\">\u9032\u968E\u934D\u6676</option>\n                    <option value=\"\u9802\u7D1A\u934D\u819C\">\u9802\u7D1A\u934D\u819C</option>\n                </select>\n            </div>\n        </div>\n\n        <div class=\"form-group\">\n            <div class=\"newBooking-input\">\n                <label for=\"customerMsg\" class=\"align-self-start\">\u5BA2\u6236\u5099\u8A3B</label>\n                <textarea class=\"form-control form-control-sm\" id=\"customerMsg\" name=\"\u5099\u8A3B\" rows=\"3\" maxlength=\"100\" placeholder=\"\u8ACB\u63D0\u4F9B\u8ECA\u578B\"></textarea>\n            </div>\n        </div>\n\n        <div class=\"bookingDetailsBtn-group\">\n            <input type=\"button\" class=\"btn btn-dark-200\" value=\"\u653E\u68C4\u4FEE\u6539\" id=\"resetEdit\">\n            <input type=\"button\" class=\"btn btn-primary text-white\" value=\"\u78BA\u8A8D\u4FEE\u6539\" id=\"confirmEdit\">\n        </div>\n    </form>\n\n    <form action=\"\" class=\"customerInfo\">       \n        <div class=\"form-group\">\n            <div class=\"newBooking-input\">\n                <label for=\"userName\">\u5BA2\u6236\u59D3\u540D</label>\n                <input type=\"text\" name=\"\u5BA2\u6236\u59D3\u540D\" id=\"userName\" placeholder=\"\" disabled class=\"form-control\">\n            </div>\n        </div>\n\n        <div class=\"form-group\">\n            <div class=\"newBooking-input\">\n                <label for=\"userPhone\">\u96FB\u8A71\u865F\u78BC</label>\n                <input type=\"tel\" name=\"\u96FB\u8A71\u865F\u78BC\" id=\"userPhone\" placeholder=\"\" disabled class=\"form-control\">\n            </div>\n        </div>\n\n        <div class=\"form-group\">\n            <div class=\"newBooking-input\">\n                <label for=\"userEmail\">E-mail</label>\n                <input type=\"email\" name=\"E-mail\" id=\"userEmail\" placeholder=\"\" disabled class=\"form-control\">\n            </div>\n        </div>\n    </form>\n</div>";
tbody.addEventListener('click', function (e) {
  if (e.target.classList.contains('opended')) {
    removeCalendarElement(e.target);
  } else if (e.target.classList.contains('editReservationBtn')) {
    removeCalendarElement(e.target);
    renderReservationDetails(e.target);
  } else if (e.target.id === 'resetEdit') {
    var targetYear = new Date(parseInt(currentEdit['date'])).getFullYear();
    var targetMonth = new Date(parseInt(currentEdit['date'])).getMonth() + 1;
    getReservationCalendar(targetYear, targetMonth);
    //renderReservationDetails(currentEdit);
  } else if (e.target.id === 'confirmEdit') {
    updateReservation();
  }
});
function getAllReservation() {
  axios.post("http://localhost:3000/api/v1/admin/allBookings", {
    'data': {
      'token': userToken
    }
  }).then(function (response) {
    allReservationData = response.data.data;
    renderAllReservationData(allReservationData);
  })["catch"](function (error) {
    console.log(error);
  });
}
function renderAllReservationData(data) {
  var str = '';
  // 按日期 未來>過去 排序
  data.sort(function (a, b) {
    return b['date'] - a['date'];
  });
  data.forEach(function (el) {
    var date = new Date(parseInt(el['date']));
    var dateFormat = "".concat(date.getFullYear(), "/").concat(date.getMonth() + 1, "/").concat(date.getDate());
    str += "\n                <tr>\n                    <td>".concat(el['id'], "</td>\n                    <td>").concat(dateFormat, "</td>\n                    <td>").concat(el['plan'], "</td>\n                    <td>").concat(el['userInfo']['userName'], "</td>\n                    <td>").concat(el['userInfo']['userPhone'], "</td>\n                    <td class='text-start'>").concat(el['userRemarks'], "</td>\n                    <td>").concat(el['status'], "</td>\n                    <td><a href=\"#\" class=\"editReservationBtn\" data-bookingId='").concat(el['id'], "'>\u8A73\u7D30</a></td>\n                </tr>\n            ");
  });
  tbody.innerHTML = str;
}
function removeCalendarElement(targetElement) {
  var calendarElement = document.querySelector('#calendarElement');

  //移除已打開的 '詳細' 內容     
  if (calendarElement !== null) {
    calendarElement.remove();
  }
  targetElement.innerText = '詳細';
  targetElement.classList.remove("opended");
  currentEdit = {};
}
function renderReservationDetails(targetElement) {
  currentEdit = allReservationData.find(function (_ref) {
    var id = _ref.id;
    return id.toString() === targetElement.dataset.bookingid;
  });
  var insertCalendar = document.createElement('tr');
  insertCalendar.setAttribute('id', 'calendarElement');
  tbody.insertBefore(insertCalendar, targetElement.parentElement.parentElement.nextSibling);
  insertCalendar.innerHTML = "<td colspan='8'>".concat(editReservationElement, "</td>");
  var targetYear = new Date(parseInt(currentEdit['date'])).getFullYear();
  var targetMonth = new Date(parseInt(currentEdit['date'])).getMonth() + 1;
  getReservationCalendar(targetYear, targetMonth);
  targetElement.innerText = '關閉';
  targetElement.className += ' opended';
}
function getReservationCalendar(targetYear, targetMonth) {
  axios.post("http://localhost:3000/api/v1/admin/calendar", {
    'data': {
      'token': userToken,
      'calendar': {
        'year': targetYear.toString(),
        'month': targetMonth.toString()
      }
    }
  }).then(function (response) {
    calendarData = response.data.data;
    var calendar = new Calendar(calendarData);
    renderEditReservation(currentEdit);
    currentQueryYear = parseInt(calendarData['year']);
    currentQueryMonth = parseInt(calendarData['month']);
    calanderEventListeners(getReservationCalendar);
  })["catch"](function (error) {
    alert(error.response.data.data['msg']);
  });
}
function renderEditReservation(currentEdit) {
  var calendarSelected = document.querySelector("[data-date=\"".concat(parseInt(currentEdit['date']), "\"]"));
  if (calendarSelected !== null) {
    calendarSelected.classList.add('dateInners-selected');
  }
  var selectedDate = document.querySelector('#selectedDate');
  var selectedPlan = document.querySelector('#selectedPlan');
  var customerMsg = document.querySelector('#customerMsg');
  var userEmail = document.querySelector('#userEmail');
  var userName = document.querySelector('#userName');
  var userPhone = document.querySelector('#userPhone');
  var bookingStatus = document.querySelector('#bookingStatus');
  var currentEditDate = new Date(parseInt(currentEdit['date']));
  var dateFormat = "".concat(currentEditDate.getFullYear(), " / ").concat(currentEditDate.getMonth() + 1, " / ").concat(currentEditDate.getDate());
  selectedDate.value = dateFormat;
  selectedPlan.value = currentEdit['plan'];
  bookingStatus.value = currentEdit['status'];
  customerMsg.value = currentEdit['userRemarks'];
  userEmail.value = currentEdit['userInfo']['userEmail'];
  userName.value = currentEdit['userInfo']['userName'];
  userPhone.value = currentEdit['userInfo']['userPhone'];
}
function updateReservation() {
  var bookingId = currentEdit['id'];
  var selectedDate = new Date(document.querySelector('#selectedDate').value).setHours(0, 0, 0, 0).toString();
  var selectedPlan = document.querySelector('#selectedPlan').value;
  var customerMsg = document.querySelector('#customerMsg').value;
  var bookingStatus = document.querySelector('#bookingStatus').value;
  if (selectedDate !== currentEdit['date'] || selectedPlan !== currentEdit['plan'] || customerMsg !== currentEdit['userRemarks'] || bookingStatus !== currentEdit['status']) {
    axios.patch("http://localhost:3000/api/v1/admin/allBookings", {
      'data': {
        'token': userToken,
        'bookingId': bookingId,
        'newBookingInfo': {
          "date": selectedDate,
          "plan": selectedPlan,
          "userRemarks": customerMsg,
          "status": bookingStatus
        }
      }
    }).then(function (response) {
      alert(response.data.data.msg);
      location.reload();
    })["catch"](function (error) {
      console.log(error);
    });
  } else {
    alert('無修改');
  }
}
getAllReservation();
//# sourceMappingURL=reservationList.js.map
