var dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
var monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
var monthNamesAccusative = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];

var oneMinute = 1000 * 60;
var date = new Date();
var weekendSaturday = 5;
var weekendSunday = 6;


var dateFormats = {
    CShartDateTime: 0
}

var datePartsEnum = {
    year: 0,
    month: 1,
    day: 2,
    hour: 3,
    minutes: 4
}

var CSharDatePartsEnum = {
    year: 2,
    month: 0,
    day: 1,
    hour: 3,
    minutes: 4
}

var dateNow = {
    year: date.getFullYear(),
    month: (date.getMonth() + 1),
    day: date.getDate(),
    hour: date.getHours(),
    minutes: date.getMinutes()
};

function setDateNow() {
    var date = new Date();

    dateNow = {
        year: date.getFullYear(),
        month: (date.getMonth() + 1),
        day: date.getDate(),
        hour: date.getHours(),
        minutes: date.getMinutes()
    };

}

var dateNowStartClock = setInterval(setDateNow, oneMinute);

function getDayOfWeek(day) {
    var trueDay = day - 1;
    if (trueDay < 0) {
        trueDay = 6;
    }
    return trueDay;
}

function compareTime(time, timeTo) {
    var totalMinutes = time.hour * 60 + time.minutes;
    var totalMinutesTo = timeTo.hour * 60 + timeTo.minutes;

    if (totalMinutes > totalMinutesTo) {
        return 1;
    } else if (totalMinutes < totalMinutesTo) {
        return -1;
    } else {
        return 0;
    }
}

function dateDiffInDays(date, dateFrom) {

    var utc1 = Date.UTC(date.year, date.month + 1, date.day);
    var utc2 = Date.UTC(dateFrom.year, dateFrom.month + 1, dateFrom.day);
    return Math.floor((utc2 - utc1) / milisecondsPerDay);

}

function copyDate(dateFrom) {

    return {
        year: dateFrom.year || dateNow.year,
        month: dateFrom.month,
        day: dateFrom.day,
        hour: dateFrom.hour,
        minutes: dateFrom.minutes
    };
}

function compareDates(date, dateTo, ignoreDays, incudeTime) {

    var ignore = ignoreDays || false;
    var time = incudeTime || false;

    if (date.year > dateTo.year) {
        return 1;
    } else if (date.year < dateTo.year) {
        return -1;
    } else if (date.month > dateTo.month) {
        return 1;
    } else if (date.month < dateTo.month) {
        return -1;
    } else if (!ignore && (date.day > dateTo.day)) {
        return 1;
    } else if (!ignore && (date.day < dateTo.day)) {
        return -1;
    } else if (time) {
        return compareTime(date, dateTo);
    } else {
        return 0;
    }
}

function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function getDurationInMinutes(hour, minutes) {
    return parseInt(hour) * 60 + parseInt(minutes);
}

function renderTimeMinutes(hours, minutes, asObject) {
    var renderHours = hours > 9 ? hours : '0' + hours;
    var renderMinutes = minutes > 9 ? minutes : '0' + minutes;

    if (asObject) {
        return { hour: renderHours, minutes: renderMinutes };
    }
    return renderHours + ':' + renderMinutes;
}

function renderDate(date) {
    return date > 9 ? date : '0' + date;
}

function getCurrentTime(returnObject) {
    var dateNow = new Date();
    if (returnObject === true) {
        return {
            hour: dateNow.getHours(),
            minutes: dateNow.getMinutes()
        };
    }
    return renderTimeMinutes(dateNow.getHours(), dateNow.getMinutes());
}

function convertToDateTime(dateTime) {
    return dateTime.day  + '/' + dateTime.month + '/' + dateTime.year
            + " " + dateTime.hour + ':' + dateTime.minutes + ':00';
}

function convertToDateObject(dateTimeString, dateFormat) {

    var dateParts = dateTimeString.replace(/[/:. ]/g, '-').split('-');

    if (dateFormat === dateFormats.CShartDateTime) {

        return {
            year: parseInt(dateParts[CSharDatePartsEnum.year]),
            month: parseInt(dateParts[CSharDatePartsEnum.month]),
            day: parseInt(dateParts[CSharDatePartsEnum.day]),
            hour: parseInt(dateParts[CSharDatePartsEnum.hour]),
            minutes: parseInt(dateParts[CSharDatePartsEnum.minutes])
        };
    }

    return {
        year: parseInt(dateParts[datePartsEnum.year]),
        month: parseInt(dateParts[datePartsEnum.month]),
        day: parseInt(dateParts[datePartsEnum.day]),
        hour: parseInt(dateParts[datePartsEnum.hour]),
        minutes: parseInt(dateParts[datePartsEnum.minutes])
    };
}

function addValueToDate(targetDate, dateObject, add) {
    var maxDayCount;
    if (add === true) {

        targetDate.year += dateObject.year || 0;
        targetDate.month += dateObject.month || 0;
        targetDate.day += dateObject.day || 0;
        targetDate.hour += dateObject.hour || 0;
        targetDate.minutes += dateObject.minutes || 0;

        while (targetDate.month > 12) {
            targetDate.month -= 12;
            targetDate.year++;
        }

        maxDayCount = getDaysInMonth(targetDate.month, targetDate.year);

        while (targetDate.minutes >= 60) {
            targetDate.minutes -= 60;
            targetDate.hour++;
        }

        while (targetDate.hour >= 24) {
            targetDate.hour -= 24;
            targetDate.day++;
        }


        while (targetDate.day > maxDayCount) {
            targetDate.day -= maxDayCount;
            targetDate.month++;
            while (targetDate.month > 12) {
                targetDate.month -= 12;
                targetDate.year++;

            }
            maxDayCount = getDaysInMonth(targetDate.month, targetDate.year);
        }

    } else {

        maxDayCount = getDaysInMonth(targetDate.month, targetDate.year);

        targetDate.year -= dateObject.year || 0;
        targetDate.month -= dateObject.month || 0;
        targetDate.day -= dateObject.day || 0;
        targetDate.hour -= dateObject.hour || 0;
        targetDate.minutes -= dateObject.minutes || 0;

        while (targetDate.month <= 0) {
            targetDate.month += 12;
            targetDate.year--;
        }

        while (targetDate.minutes < 0) {
            targetDate.minutes += 60;
            targetDate.hour--;
        }

        while (targetDate.hour < 0) {
            targetDate.hour += 24;
            targetDate.day--;
        }

        while (targetDate.day < 0) {
            targetDate.day += maxDayCount;
            targetDate.month--;

            while (targetDate.month < 0) {
                targetDate.month += 12;
                targetDate.year--;
            }

            maxDayCount = getDaysInMonth(targetDate.month, targetDate.year);
        }
    }
}
