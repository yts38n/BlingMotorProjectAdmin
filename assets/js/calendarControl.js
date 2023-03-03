"use strict";

var calendarAvailable = {};
document.querySelector('#resetEdit').addEventListener('click', function () {
  location.reload();
});
document.querySelector('#confirmEdit').addEventListener('click', function () {
  var inputNodeList = document.querySelectorAll('.form-control');
  var notAllowedCharacters = /[^0-9]/;
  var newCalendarNumber = {};
  var failAlarm = false;
  inputNodeList.forEach(function (node) {
    var date = node.dataset.date.toString();
    var num = node.value.search(notAllowedCharacters) !== -1 ? null : parseInt(node.value);
    if (num !== null && isNaN(num) !== true) {
      newCalendarNumber[date] = num;
    } else {
      failAlarm = true;
    }
  });
  if (failAlarm !== true) {
    updateCalendarNumber(newCalendarNumber);
  } else {
    alert("只能輸入數字!! 請重新檢查!!");
  }
});
function getCalendar(targetYear, targetMonth) {
  axios.post("https://bling-motor-mock-server.onrender.com/api/v1/admin/calendar", {
    'data': {
      'token': blingMotorUserStatus['userInfo']['userEmail'],
      'calendar': {
        'year': targetYear.toString(),
        'month': targetMonth.toString()
      }
    }
  }).then(function (response) {
    calendarAvailable = response.data.data;
    var calendar = new Calendar(calendarAvailable);
    renderCalendarControl(calendarAvailable);
    currentQueryYear = parseInt(calendarAvailable['year']);
    currentQueryMonth = parseInt(calendarAvailable['month']);
    calanderEventListeners(getCalendar);
  })["catch"](function (error) {
    alert(error.response.data.data['msg']);
  });
}
function renderCalendarControl(calendarAvailable) {
  var dateInnersNodeList = document.querySelectorAll('.dateInners');
  dateInnersNodeList.forEach(function (node) {
    var date = node.dataset.date.toString();
    var textDate = node.innerText;
    if (calendarAvailable['dates'].hasOwnProperty(date)) {
      var disabled = calendarAvailable['dates'][date]["available"] !== true ? 'disabled' : '';
      var renderItem = "\n                    <div class=\"flex-grow-1\">".concat(textDate, "</div>\n                    <div class=\"numberBox\">\n                        <label for=\"\" class=\"form-label\">\u6578\u91CF\uFF1A</label>\n                        <input class=\"form-control\" type=\"number\" value='").concat(calendarAvailable['dates'][date]['spaces'], "' ").concat(disabled, " data-date='").concat(date, "'></input>\n                    </div>");
      node.removeAttribute('data-date');
      node.innerHTML = renderItem;
    } else {
      node.innerHTML = '';
    }
  });
}
function updateCalendarNumber(newCalendar) {
  axios.patch("https://bling-motor-mock-server.onrender.com/api/v1/admin/calendar", {
    'data': {
      'token': blingMotorUserStatus['userInfo']['userEmail'],
      'newCalendar': {
        'year': calendarAvailable['year'],
        'month': calendarAvailable['month'],
        'dates': newCalendar
      }
    }
  }).then(function (response) {
    alert('修改成功!');
    calendarAvailable = response.data.data;
    var calendar = new Calendar(calendarAvailable);
    renderCalendarControl(calendarAvailable);
    currentQueryYear = parseInt(calendarAvailable['year']);
    currentQueryMonth = parseInt(calendarAvailable['month']);
    calanderEventListeners(getCalendar);
  })["catch"](function (error) {
    alert(error.response.data.data['msg']);
  });
}
getCalendar(currentQueryYear, currentQueryMonth);
//# sourceMappingURL=calendarControl.js.map
