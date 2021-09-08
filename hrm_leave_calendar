// ==UserScript==
// @name         DTP HRM
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
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
        if(document.querySelector('#dashboard-pracownik') && !document.querySelector('#dtp_calendar') && !document.querySelector('.mini-kalendarz')) {
            getCalendar();
        }
    }

    function getCalendar() {
        const pracownikDataset = document.querySelector('#dashboard-pracownik').dataset;
        const id = pracownikDataset.id;
        const szyfrowaneId = pracownikDataset.szyfrowaneid;

        let formData=new FormData();
        let dateObject = new Date();

        formData.append("data", dateObject.toISOString());
        formData.append("uzytkownikId", szyfrowaneId);

        GM.xmlHttpRequest({
            method: "POST",
            data: formData,
            url: "https://hrm.online.comarch.pl/dtpzie_dtpzie/pl/Dashboard/PobierzDaneKalendarz/",
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                let calendar = document.createElement("div");
                let count = 0;

                calendar.id = 'dtp_calendar';
                calendar.classList.add('row');
                calendar.innerHTML += `<h3 class="mt-3 mb-3">Urlopy:</h3>`;
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
