// ==UserScript==
// @name         Comarch HRM leave calendar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds leave calendar on the bottom of Comarch HRM profile page
// @author       Paweł Borecki
// @match        https://hrm.online.comarch.pl/*/pracownicy/lista
// @icon         https://www.google.com/s2/favicons?domain=comarch.pl
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(function() {
    'use strict';
    var MutationObserver = window.MutationObserver;

    const myObserver = new MutationObserver (mutationHandler);
    const obsConfig = {
        childList: true, attributes: true,
        subtree: true, attributeFilter: ['id']
    };

    myObserver.observe (document, obsConfig);

    function mutationHandler (mutationRecords) {
        if(document.querySelector('#dashboard-pracownik') && !document.querySelector('#hrm_leave_calendar') && !document.querySelector('.mini-kalendarz')) {
            getCalendar();
        }
    }

    function getCalendar() {
        const pracownikDataset = document.querySelector('#dashboard-pracownik').dataset;
        const id = pracownikDataset.id;
        const szyfrowaneId = pracownikDataset.szyfrowaneid;
        const dateObject = new Date();

        let calendar = document.createElement("div");
        calendar.id = 'hrm_leave_calendar';
        calendar.classList.add('row');
        calendar.innerHTML += `<h3 class="mt-3 mb-3">Urlopy:</h3>`;

        GM.xmlHttpRequest({
            method: "POST",
            data: JSON.stringify({
                "data": dateObject.getFullYear() + '-' + new String(dateObject.getMonth()+1).padStart(2, '0') + '-' + new String(dateObject.getDate()).padStart(2, '0'),
                "uzytkownikId": szyfrowaneId
            }),
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
                "hrmrequestverificationtoken": document.querySelector('[name=__RequestVerificationToken]').value
            },
            url: window.location.href.replace('pracownicy/lista', 'Dashboard/PobierzDaneKalendarz'),
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                let count = 0;

                for (let dataIndex in data) {
                    const row = data[dataIndex];
                    if (row.nieobecnoscZatwierdzono || row.delegacjaZatwierdzono || row.szkolenieZatwierdzono) {
                        count++;
                        let date = new Date(row.data);
                        date = date.toLocaleDateString("pl-PL");
                        calendar.innerHTML += `<p class="col-md-4">${date}</p>`;
                    }
                }
                if (!count) {
                    calendar.innerHTML += `<h4>Brak zaakceptowanych urlopów</h4>`;
                }
                document.querySelector('#likedashboard').append(calendar);
            }
        });
    }
})();
