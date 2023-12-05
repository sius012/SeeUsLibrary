window.dataTable = [];

function calculateDaysDifference(date1, date2) {
  // Create Date objects for each date
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);

  // Calculate the difference in milliseconds
  const timeDifference = Math.abs(secondDate - firstDate);

  // Convert the difference to days
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference;
}

function getWeekInMonth(date) {
  // Clone the date object to avoid modifying the original date
  const clonedDate = new Date(date);

  // Set the date to the 1st of the month to find the start of the month
  clonedDate.setDate(1);

  // Get the day of the week for the 1st day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const firstDayOfWeek = clonedDate.getDay();

  // Calculate the offset to the first full week
  const offset = (8 - firstDayOfWeek) % 7;

  // Set the date to the input date
  clonedDate.setDate(date.getDate());

  // Calculate the week number
  const weekNumber = Math.ceil((clonedDate.getDate() - offset) / 7);

  return weekNumber;
}

// Example usage:
const today = new Date();
const weekNumber = getWeekInMonth(today);
console.log(`Week number in the month: ${weekNumber}`);

function getWeeksInYear(year) {
  const weeksInYear = [];

  // Iterate over each month
  for (let month = 0; month < 12; month++) {
    // Create a date object for the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);

    // Use the previously defined function to get the week number for the first day of the month
    const weekNumber = getWeekInMonth(firstDayOfMonth);

    // Push the week number to the array
    weeksInYear.push(weekNumber);
  }

  return weeksInYear;
}

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
    "Desember",
  ];
  for (let month = 0; month < 12; month++) {
    daysInMonth.push({
      name: namaBulan[month],
      count: new Date(year, month + 1, 0).getDate(),
    });
  }
  return daysInMonth;
}

class Dataset {
  constructor(data) {
    this.data = data;
    this.offsetX = 0;
    this.width = 0;
    this.boundingPosition = {};
  }
}

class Timechart {
  constructor(canvas) {
    this.modeList = ["day", "week", "month", "year"];
    this.activeIndex = 1;
    this.scrollvalue = 0;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.currentWidthItem = 25;
    this.offsetX = 0;
    this.data = [];
    // this.renderWeeks();
    // this.globalEvent();
    this.lastPasses;
  }

  renderDays() {
    const master = this;
    let data = getDaysInMonth(2023);
    let passess = 0;
    master.ctx.clearRect(0, 0, master.canvas.width, master.canvas.height);
    data.forEach(function (e, i1) {
      master.ctx.fillStyle = "black";
      master.ctx.font = "12pt Arial";
      master.ctx.fillText(
        e.name,
        passess * master.currentWidthItem +
          (e.count * master.currentWidthItem) / 2 -
          master.ctx.measureText(e.name).width +
          master.offsetX,
        20
      );

      //render month line
      master.ctx.beginPath();
      master.ctx.moveTo(passess * master.currentWidthItem + master.offsetX, 0);
      master.ctx.lineTo(
        passess * master.currentWidthItem + master.offsetX,
        master.canvas.height
      );
      master.ctx.stroke();
      for (let i = 0; i < e.count; i++) {
        master.ctx.font = "12pt Arial";
        master.ctx.fillText(
          i + 1,
          i * master.currentWidthItem +
            passess * master.currentWidthItem +
            master.offsetX +
            master.currentWidthItem / 2 -
            master.ctx.measureText(i + 1).width / 2,
          50
        );

        master.ctx.beginPath();
        master.ctx.moveTo(
          passess * master.currentWidthItem +
            master.currentWidthItem * i +
            master.offsetX,
          30
        );
        master.ctx.lineTo(
          passess * master.currentWidthItem +
            master.currentWidthItem * i +
            master.offsetX,
          60
        );
        master.ctx.stroke();
      }
      passess += e.count;
    });
    master.ctx.beginPath();
    master.ctx.moveTo(master.offsetX, 30);
    master.ctx.lineTo(passess * master.currentWidthItem + master.offsetX, 30);
    master.ctx.stroke();
    master.ctx.lineWidth = 0.1;
    master.ctx.beginPath();

    master.ctx.moveTo(master.offsetX, 60);
    master.ctx.lineTo(passess * master.currentWidthItem + master.offsetX, 60);

    master.ctx.stroke();

    //Render Data
    master.data.forEach(function (e, i) {
      let tanggalStart = new Date(e.deadline);
      let tanggalEnd = new Date(e.due_date);
      let len =
        calculateDaysDifference(tanggalStart, tanggalEnd) *
          master.currentWidthItem +
        master.currentWidthItem;
      let offset =
        calculateDaysDifference(
          new Date("2023-01-01"),
          new Date(tanggalStart)
        ) * master.currentWidthItem;

      master.ctx.strokeStyle = "blue";
      master.ctx.fillStyle = "blue";
      master.ctx.beginPath();
      master.ctx.roundRect(offset + master.offsetX, 40 * i + 100, len, 40, [
        10,
      ]);
      master.ctx.fill();
      master.ctx.stroke();

      master.ctx.fillStyle = "white";
      master.ctx.font = "10pt Arial";
      master.ctx.fillText(e.task, offset + master.offsetX + 5, 40 * i + 125);
    });
    master.lastPasses = passess;
  }

  renderWeeks() {
    const master = this;
    let data = getWeeksInYear(2023);
    console.log(data);
  }

  renderChart() {}

  render() {
    this.globalEvent();
  }

  globalEvent() {
    const master = this;
    this.canvas.addEventListener("wheel", function (e) {
      if (e.ctrlKey) {
        e.preventDefault();
        master.currentWidthItem = master.currentWidthItem + e.deltaY / 20;
        master.renderDays();
      }

      if (e.shiftKey) {
        e.preventDefault();
        if (
          Math.abs(master.offsetX + e.deltaY / 1) <
          master.currentWidthItem * master.lastPasses - 1000
        ) {
          master.offsetX = master.offsetX + e.deltaY / 1;
          master.renderDays();
          console.log(
            master.lastPasses * master.currentWidthItem +
              -1000 +
              " : " +
              Math.abs(master.offsetX + e.deltaY / 10)
          );
        }
      }
    });
  }

  static parse(canvas, data) {
    let timechart = new Timechart(canvas);
    timechart.data = data;
    return timechart;
  }
}

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
    "Desember",
  ];
  for (let month = 0; month < 12; month++) {
    daysInMonth.push({
      name: namaBulan[month],
      count: new Date(year, month + 1, 0).getDate(),
    });
  }
  return daysInMonth;
}

function generateUniqueID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function sumByKey(array, key) {
  return array.reduce(function (acc, obj) {
    return acc + obj[key];
  }, 0);
}

function formatDateToYMD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 to month since it's zero-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateFromIntegers(day, month) {
  // Assuming the current year for this example
  const currentYear = new Date().getFullYear();

  // Creating a new Date object with the provided year, month, and day
  const parsedDate = new Date(2023, month - 1, day);

  return parsedDate;
}

function getDateFromDayCount(dayCount) {
  const year = new Date().getFullYear(); // Get the current year
  const date = new Date(year, 0); // Initialize with January 1st of the current year

  date.setDate(dayCount); // Set the day count within the year

  // Format the date as desired (e.g., 'YYYY-MM-DD')
  const formattedDate = date.toISOString().split("T")[0];

  return formattedDate;
}

// $.fn.Timeliner = function (
//   params = { title: "title", start_date: "start_date", end_date: "end_date" }
// ) {
//   const masterctx = $(this);
//   let id = generateUniqueID();
//   //Wrap Component
//   $(this).wrap('<div class="timeline-wrapper"></div>');

//   let wrapper = $(this).closest(".timeline-wrapper");
//   console.log(wrapper);
//   console.log(getDaysInMonth(2023));

//   let dayCount = getDaysInMonth(2023);

//   let titleIndex = $(this).find(`th[data-name=${params.title}]`).index();
//   let startIndex = $(this).find(`th[data-name=${params.start_date}]`).index();
//   let endIndex = $(this).find(`th[data-name=${params.end_date}]`).index();

//   var listOfData = [];

//   $(this)
//     .find("tbody")
//     .children("tr")
//     .each(function (idata) {
//       let ctx = $(this);

//       let otherAttribute = masterctx.find("thead").find("tr").children("th");
//       let anyAttr = [];

//       otherAttribute.each(function () {
//         if (![titleIndex, startIndex, endIndex].includes($(this).index())) {
//           let attrName = {};
//           attrName["value"] = ctx.children("td").eq($(this).index()).text();
//           attrName["attr"] = $(this).text();
//           anyAttr.push(attrName);
//         }
//       });

//       console.log(anyAttr);

//       listOfData[idata] = {
//         name: $(this).children("td").eq(titleIndex).text(),
//         start: $(this).children("td").eq(startIndex).text(),
//         end: $(this).children("td").eq(endIndex).text(),
//         otherAttr: anyAttr,
//       };
//     });

//   window.dataTable[id] = listOfData;
//   console.log(window.dataTable);
//   let colmonth = "";

//   //updatetable
//   let thead = $(this).find("thead");
//   let tbody = $(this).find("tbody");
//   //   thead.empty();
//   //   tbody.empty();

//   dayCount.forEach(function (e, ij) {
//     let dayCount = "";

//     for (let i = 0; i < e["count"]; i++) {
//       dayCount += `<div class=' col-day' style='width:20px; text-align:center' data-address='${formatDateToYMD(
//         new Date(2023, ij, i + 1)
//       )}'>${i + 1}</div>`;
//     }
//     colmonth += `<div class='col-big'><div class=''>
//     <div class='' style='padding: 10px'>${e["name"]}</div>
//     </div><div class='row-day'>${dayCount}</div></div>`;
//   });

//   //renderdata
//   let rowdata = "";

//   $(".container-data").empty();

//   let newContainer = `<div class="scroller" style='width: 100%; overflow-x: scroll'>

//   <div class="container-timeline " style="  display: inline-block" data-id="${id}">
//       <div class=" header-month" style="display: inline-flex;" >
//           ${colmonth}
//       </div>
//       <div class="container-data">

//       </div>

//     </div>
//     <div class='tooltip-timeline'>
//     <ul>
//       <li>Nama</li>
//     </ul
//   </div>
//   </div>`;

//   wrapper.append(newContainer);

//   listOfData.forEach(function (e) {
//     let endRange = wrapper.find(`div[data-address=${e.end}]`).position().left;
//     let startRange = wrapper.find(`div[data-address=${e.start}]`).offset().left;
//     let width = endRange - startRange;
//     let col = "";
//     console.log(endRange);
//     console.log(width);
//     for (let i = 0; i < sumByKey(dayCount, "count"); i++) {
//       let data =
//         getDateFromDayCount(i + 2) == e.start
//           ? `<div class='col-data' style='background: #3333cc; box-shadow: 0px 0px 10px black; position: absolute; width: ${width}px; top: 2px; left: 0px;z-index: 2; height: 30px; border-radius: 5px'><div style='padding: 3px'>${e.name}</div></div>`
//           : "";
//       col += `<div class='col col-day' style='width:1px;position:relative' data-address=''>${data}</div>`;
//     }
//     let startEl = {
//       dateIndex: $(`div[data-address=${e.start}]`).index(),
//       monthIndex: $(`div[data-address=${e.start}]`).closest(".col-big").index(),
//     };
//     let endEl = {
//       dateIndex: $(`div[data-address=${e.end}]`).index(),
//       monthIndex: $(`div[data-address=${e.end}]`).closest(".col-big").index(),
//     };

//     console.log([startEl, endEl]);

//     rowdata += `<div class='row-data' style='display: flex;'>${col}</div>`;
//     // wrapper.find(".container-data").append(`<div class='row-data' ><div class='card-timeline col-data' style='background-color: #849e4f; width: ${width}px; position:absolute; left: ${startRange}px; height: 40px'><div class='p-1'>${e.name}</div></div></div>`)
//   });

//   wrapper.find(".container-data").html(rowdata);
//   document.querySelectorAll(".container-timeline").forEach(function (e) {
//     e.addEventListener(
//       "wheel",
//       function touchHandler(e) {
//         if (e.ctrlKey) {
//           e.preventDefault();
//           var table = $(e.target).closest(".container-timeline");

//           let width =
//             $(e.target)
//               .closest(".container-timeline")
//               .find(".col-day")
//               .width() +
//             e.deltaY / 10;
//           $(e.target)
//             .closest(".container-timeline")
//             .find(".col-day")
//             .css("width", width + e.deltaY / 10 + "px");

//           let idchart = table.data("id");

//           $(e.target)
//             .closest(".container-timeline")
//             .find(".container-data")
//             .children(".row-data")
//             .each(function () {});
//           window.dataTable[idchart].forEach(function (e, i) {
//             let row = table
//               .find(".container-data")
//               .children(".row-data")
//               .eq(i)
//               .find(".col-data");
//             let startPos = table.find("div[data-address=" + e.start + "]");
//             let startPosData = startPos[0].getBoundingClientRect().left;
//             let endPos = table.find("div[data-address=" + e.end + "]");
//             let endPosData = endPos[0].getBoundingClientRect().left;
//             let width = endPosData - startPosData;
//             row.width(width);
//           });

//           if (table.find(".col-big").width() < 700) {
//             let curWidth = table.find(".col-big").width();
//             console.log(curWidth);
//             table.find(".header-month").find(".col-day").hide();
//           }
//         }
//       },
//       { passive: false }
//     );
//   });
// };

$(document).ready(function () {
  $(document).delegate(".col-data", "mouseover", function (event) {
    let tooltip = $(this)
      .closest(".timeline-wrapper")
      .find(".tooltip-timeline");
    let dataAttr =
      window.dataTable[$(this).closest(".container-timeline").data("id")][
        $(this).closest(".row-data").index()
      ];
    let dataList = dataAttr.otherAttr
      .map(function (e) {
        return `<li><b>${e["attr"]}</b>   ${e["value"]}</li>`;
      })
      .join("");
    tooltip.find("ul").html(dataList);
    console.log(dataList);
    tooltip.appendTo($(this));
  });
});
