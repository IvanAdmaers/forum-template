class DateDifference {
  inMs(date1, date2) {
    return new Date(date2) - new Date(date1);
  }

  inSeconds(date1, date2) {
    const diffInMs = Math.abs(new Date(date2) - new Date(date1));

    return diffInMs / 1000;
  }

  inMinutes(date1, date2) {
    const diff = (new Date(date2).getTime() - new Date(date1).getTime()) / 1000;
    const diffInMinutes = diff / 60;

    return Math.abs(Math.round(diffInMinutes));
  }

  inDays(date1, date2) {
    const t2 = new Date(date2).getTime();
    const t1 = new Date(date1).getTime();

    return parseInt((t2 - t1) / (24 * 3600 * 1000), 10);
  }

  inWeeks(date1, date2) {
    const t2 = new Date(date2).getTime();
    const t1 = new Date(date1).getTime();

    return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7), 10);
  }

  inMonths(date1, date2) {
    const d1Y = new Date(date1).getFullYear();
    const d2Y = new Date(date2).getFullYear();
    const d1M = new Date(date1).getMonth();
    const d2M = new Date(date2).getMonth();

    return d2M + 12 * d2Y - (d1M + 12 * d1Y);
  }

  inYears(date1, date2) {
    return new Date(date2).getFullYear() - new Date(date1).getFullYear();
  }
}

module.exports = new DateDifference();
