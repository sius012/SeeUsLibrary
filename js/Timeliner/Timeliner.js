function getDaysInMonth(year) {
    const daysInMonth = [];

    let namaBulan = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
      ];
    for (let month = 0; month < 12; month++) {
      daysInMonth.push({name: namaBulan[month],count: new Date(year, month + 1, 0).getDate()});
    }
    return daysInMonth;
}


$.fn.Timeliner = function (params = {title: "title", start_date: "start_date", end_date: "end_date"}) {
    console.log(getDaysInMonth(2023))
      
};
