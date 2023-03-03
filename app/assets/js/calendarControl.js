let calendarAvailable = {};

document.querySelector('#resetEdit').addEventListener('click', () => {
    location.reload();
});
document.querySelector('#confirmEdit').addEventListener('click', () => {
    let inputNodeList = document.querySelectorAll('.form-control');
    const notAllowedCharacters = /[^0-9]/;
    let newCalendarNumber = {};
    let failAlarm = false;
    
    inputNodeList.forEach(
        (node) => {
            let date = node.dataset.date.toString();
            let num = (node.value.search(notAllowedCharacters) !== -1) ? null : parseInt(node.value);
            if (num !== null && isNaN(num) !== true) {
                newCalendarNumber[date] = num;
            } else {
                failAlarm = true;
            }
        }
    )

    if (failAlarm !== true) {
        updateCalendarNumber(newCalendarNumber);
    } else {
        alert("只能輸入數字!! 請重新檢查!!");
    }
})

function getCalendar(targetYear, targetMonth) {
    axios.post(`http://localhost:3000/api/v1/admin/calendar`, {
            'data': {
                'token': blingMotorUserStatus['userInfo']['userEmail'],
                'calendar': {
                    'year': targetYear.toString(),
                    'month': targetMonth.toString(),
                }
            }
        })
        .then(response => {
            calendarAvailable = response.data.data;
            const calendar = new Calendar(calendarAvailable);
            renderCalendarControl(calendarAvailable);

            currentQueryYear = parseInt(calendarAvailable['year']);
            currentQueryMonth = parseInt(calendarAvailable['month']);

            calanderEventListeners(getCalendar);
        })
        .catch(error => {
            alert(error.response.data.data['msg'])
        });
}

function renderCalendarControl(calendarAvailable) {
    let dateInnersNodeList = document.querySelectorAll('.dateInners');
    dateInnersNodeList.forEach(
        (node) => {
            let date = node.dataset.date.toString();
            let textDate = node.innerText;

            if (calendarAvailable['dates'].hasOwnProperty(date)) {
                let disabled = (calendarAvailable['dates'][date]["available"] !== true) ? 'disabled' : '';
                let renderItem = `
                    <div class="flex-grow-1">${textDate}</div>
                    <div class="numberBox">
                        <label for="" class="form-label">數量：</label>
                        <input class="form-control" type="number" value='${calendarAvailable['dates'][date]['spaces']}' ${disabled} data-date='${date}'></input>
                    </div>`;

                node.removeAttribute('data-date');
                node.innerHTML = renderItem;
            } else {
                node.innerHTML = '';
            }
        }
    )
}

function updateCalendarNumber(newCalendar) {
    axios.patch(`http://localhost:3000/api/v1/admin/calendar`, {
        'data': {
            'token': blingMotorUserStatus['userInfo']['userEmail'],
            'newCalendar': {
                'year': calendarAvailable['year'],
                'month': calendarAvailable['month'],
                'dates':newCalendar
            }
        }
        })
        .then(response => {
            alert('修改成功!')
            calendarAvailable = response.data.data;
            const calendar = new Calendar(calendarAvailable);
            renderCalendarControl(calendarAvailable);

            currentQueryYear = parseInt(calendarAvailable['year']);
            currentQueryMonth = parseInt(calendarAvailable['month']);

            calanderEventListeners(getCalendar);
        })
        .catch(error => {
            alert(error.response.data.data['msg'])
        });
}

getCalendar(currentQueryYear, currentQueryMonth);