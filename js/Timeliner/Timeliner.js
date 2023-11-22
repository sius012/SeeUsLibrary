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

function sumByKey(array, key) {
  return array.reduce(function (acc, obj) {
    return acc + obj[key];
  }, 0);
}

function formatDateToYMD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 to month since it's zero-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseDateFromIntegers(day, month) {
  // Assuming the current year for this example
  const currentYear = new Date().getFullYear();

  // Creating a new Date object with the provided year, month, and day
  const parsedDate = new Date(2023, month - 1, day);

  return parsedDate;
}



$.fn.Timeliner = function (params = {title: "title", start_date: "start_date", end_date: "end_date"}) {
    console.log(getDaysInMonth(2023))

    let dayCount = getDaysInMonth(2023)


    let titleIndex = $(this).find(`th[data-name=${params.title}]`).index()
    let startIndex = $(this).find(`th[data-name=${params.start_date}]`).index()
    let endIndex = $(this).find(`th[data-name=${params.end_date}]`).index()

    let listOfData = []
    $(this).find("tbody").children("tr").each(function(){
      listOfData.push({
        name: $(this).children("td").eq(titleIndex).text(),
        start: $(this).children("td").eq(startIndex).text(),
        end: $(this).children("td").eq(endIndex).text(),
      })
    })
    

    //updatetable
    let thead = $(this).find("thead")
    let tbody = $(this).find("tbody")
    thead.empty()
    tbody.empty()
    $(thead).append(jQuery('<tr>', {
      class: 'month-cont'
    }))

    $(thead).append(jQuery('<tr>', {
      class: 'day-cont'
    }))
    
    dayCount.forEach(function(e,ij){
      thead.find(".month-cont").append(`<th colspan="${e.count}">${e.name}</th>`)
      for (let i = 0;i < e.count;i++){
        thead.find(".day-cont").append(`<th data-address='${formatDateToYMD(parseDateFromIntegers(i+1, ij+1 ))}'>${i+1}</th>`)
      }
    })

    //renderdata
    listOfData.forEach(function(e){
      tbody.append(`<tr><td colspan="${sumByKey(dayCount,"count")}">s</td></tr>`)
    })
    
};
