let userToken = blingMotorUserStatus['userInfo']['userEmail'];
let allReservationData = [];
let calendarData = {};
let currentEdit = {};
let tbody = document.querySelector('tbody');
let editReservationElement = `
<div class="reservationItem">
    <div class="calendar-wrap">
        <div class="calendar" id="calendar"></div>

        <div class="pickerColorGuide">
            <div class="pickerColorGuide-item">
                <div class="colorBox colorBox-red"></div>
                <p>預約已滿</p>
            </div>
            <div class="pickerColorGuide-item">
                <div class="colorBox colorBox-gray"></div>
                <p>可預約</p>
            </div>
            <div class="pickerColorGuide-item">
                <div class="colorBox colorBox-green"></div>
                <p>已選擇</p>
            </div>
        </div>
    </div>

    <form action="" class="bookingDetails-form">        
        <div class="form-group">
            <div class="newBooking-input">
                <label for="selectedDate">預約日期</label>
                <input type="text" id="selectedDate" name="預約日期" readonly value="" class="form-control-plaintext">
            </div>
        </div>
        
        <div class="form-group">
            <div class="newBooking-input">
                <label for="status">預約狀態</label>
                <select class="form-select form-select-sm" id="bookingStatus">
                    <option value="預約成功">預約成功</option>
                    <option value="清洗中">清洗中</option>
                    <option value="待取車">待取車</option>
                    <option value="已完成">已完成</option>
                    <option value="已取消">已取消</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <div class="newBooking-input">
                <label for="selectedPlan">套裝</label>
                <select class="form-select form-select-sm" id="selectedPlan">
                    <option selected disabled>請選擇套裝</option>
                    <option value="基礎護理">基礎護理</option>
                    <option value="進階鍍晶">進階鍍晶</option>
                    <option value="頂級鍍膜">頂級鍍膜</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <div class="newBooking-input">
                <label for="customerMsg" class="align-self-start">客戶備註</label>
                <textarea class="form-control form-control-sm" id="customerMsg" name="備註" rows="3" maxlength="100" placeholder="請提供車型"></textarea>
            </div>
        </div>

        <div class="bookingDetailsBtn-group">
            <input type="button" class="btn btn-dark-200" value="放棄修改" id="resetEdit">
            <input type="button" class="btn btn-primary text-white" value="確認修改" id="confirmEdit">
        </div>
    </form>

    <form action="" class="customerInfo">       
        <div class="form-group">
            <div class="newBooking-input">
                <label for="userName">客戶姓名</label>
                <input type="text" name="客戶姓名" id="userName" placeholder="" disabled class="form-control">
            </div>
        </div>

        <div class="form-group">
            <div class="newBooking-input">
                <label for="userPhone">電話號碼</label>
                <input type="tel" name="電話號碼" id="userPhone" placeholder="" disabled class="form-control">
            </div>
        </div>

        <div class="form-group">
            <div class="newBooking-input">
                <label for="userEmail">E-mail</label>
                <input type="email" name="E-mail" id="userEmail" placeholder="" disabled class="form-control">
            </div>
        </div>
    </form>
</div>`;

tbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('opended')) {
        removeCalendarElement(e.target);
    } else if (e.target.classList.contains('editReservationBtn')) {
        removeCalendarElement(e.target);
        renderReservationDetails(e.target);
    } else if (e.target.id === 'resetEdit') {
        let targetYear = new Date(parseInt(currentEdit['date'])).getFullYear();
        let targetMonth = new Date(parseInt(currentEdit['date'])).getMonth() + 1;
        getReservationCalendar(targetYear, targetMonth);
        //renderReservationDetails(currentEdit);
    } else if (e.target.id === 'confirmEdit') {
        updateReservation();
    }
})

function getAllReservation() {
    axios.post(`http://localhost:3000/api/v1/admin/allBookings`, {
            'data': {
                'token': userToken,
            }
        })
        .then(response => {
            allReservationData = response.data.data;
            renderAllReservationData(allReservationData);
        })
        .catch(error => {
            console.log(error);
        });
}

function renderAllReservationData(data) {
    let str = '';
    // 按日期 未來>過去 排序
    data.sort((a, b) => b['date'] - a['date']);

    data.forEach(el => {
        let date = new Date(parseInt(el['date']));
        let dateFormat = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
        str += `
                <tr>
                    <td>${el['id']}</td>
                    <td>${dateFormat}</td>
                    <td>${el['plan']}</td>
                    <td>${el['userInfo']['userName']}</td>
                    <td>${el['userInfo']['userPhone']}</td>
                    <td class='text-start'>${el['userRemarks']}</td>
                    <td>${el['status']}</td>
                    <td><a href="#" class="editReservationBtn" data-bookingId='${el['id']}'>詳細</a></td>
                </tr>
            `;
    });
    tbody.innerHTML = str;
}

function removeCalendarElement(targetElement) {
    let calendarElement = document.querySelector('#calendarElement');

    //移除已打開的 '詳細' 內容     
    if (calendarElement !== null) {
        calendarElement.remove();
    }

    targetElement.innerText = '詳細';
    targetElement.classList.remove("opended");
    currentEdit = {};
}

function renderReservationDetails(targetElement) {
    currentEdit = allReservationData.find(({
        id
    }) => {
        return id.toString() === targetElement.dataset.bookingid;
    });

    let insertCalendar = document.createElement('tr')
    insertCalendar.setAttribute('id', 'calendarElement')

    tbody.insertBefore(insertCalendar, targetElement.parentElement.parentElement.nextSibling);
    insertCalendar.innerHTML = `<td colspan='8'>${editReservationElement}</td>`;

    let targetYear = new Date(parseInt(currentEdit['date'])).getFullYear();
    let targetMonth = new Date(parseInt(currentEdit['date'])).getMonth() + 1;
    getReservationCalendar(targetYear, targetMonth);

    targetElement.innerText = '關閉';
    targetElement.className += ' opended';
}

function getReservationCalendar(targetYear, targetMonth) {
    axios.post(`http://localhost:3000/api/v1/admin/calendar`, {
            'data': {
                'token': userToken,
                'calendar': {
                    'year': targetYear.toString(),
                    'month': targetMonth.toString(),
                }
            }
        })
        .then(response => {
            calendarData = response.data.data;
            const calendar = new Calendar(calendarData);
            renderEditReservation(currentEdit);

            currentQueryYear = parseInt(calendarData['year']);
            currentQueryMonth = parseInt(calendarData['month']);
            calanderEventListeners(getReservationCalendar);
        })
        .catch(error => {
            alert(error.response.data.data['msg'])
        });
}

function renderEditReservation(currentEdit) {
    let calendarSelected = document.querySelector(`[data-date="${parseInt(currentEdit['date'])}"]`);
    if (calendarSelected !== null) {
        calendarSelected.classList.add('dateInners-selected');
    }

    let selectedDate = document.querySelector('#selectedDate');
    let selectedPlan = document.querySelector('#selectedPlan');
    let customerMsg = document.querySelector('#customerMsg');
    let userEmail = document.querySelector('#userEmail');
    let userName = document.querySelector('#userName');
    let userPhone = document.querySelector('#userPhone');
    let bookingStatus = document.querySelector('#bookingStatus');

    let currentEditDate = new Date(parseInt(currentEdit['date']));
    let dateFormat = `${currentEditDate.getFullYear()} / ${currentEditDate.getMonth() + 1} / ${currentEditDate.getDate()}`

    selectedDate.value = dateFormat;
    selectedPlan.value = currentEdit['plan'];
    bookingStatus.value = currentEdit['status'];
    customerMsg.value = currentEdit['userRemarks'];
    userEmail.value = currentEdit['userInfo']['userEmail'];
    userName.value = currentEdit['userInfo']['userName'];
    userPhone.value = currentEdit['userInfo']['userPhone'];
}

function updateReservation() {
    let bookingId = currentEdit['id'];
    let selectedDate = new Date(document.querySelector('#selectedDate').value).setHours(0, 0, 0, 0).toString();
    let selectedPlan = document.querySelector('#selectedPlan').value;
    let customerMsg = document.querySelector('#customerMsg').value;
    let bookingStatus = document.querySelector('#bookingStatus').value;

    if (selectedDate !== currentEdit['date'] || selectedPlan !== currentEdit['plan'] || customerMsg !== currentEdit['userRemarks'] || bookingStatus !== currentEdit['status']) {
        axios.patch(`http://localhost:3000/api/v1/admin/allBookings`, {
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
            })
            .then(response => {
                alert(response.data.data.msg);
                location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        alert('無修改');
    }
}

getAllReservation();