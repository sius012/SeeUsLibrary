window.dataTable = [];

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
    daysInMonth.push({ name: namaBulan[month], count: new Date(year, month + 1, 0).getDate() });
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


function getDateFromDayCount(dayCount) {
  const year = new Date().getFullYear(); // Get the current year
  const date = new Date(year, 0); // Initialize with January 1st of the current year

  date.setDate(dayCount); // Set the day count within the year

  // Format the date as desired (e.g., 'YYYY-MM-DD')
  const formattedDate = date.toISOString().split('T')[0];

  return formattedDate;
}



$.fn.Timeliner = function (params = { title: "title", start_date: "start_date", end_date: "end_date" }) {
  const masterctx = $(this)
  let id = generateUniqueID()
  //Wrap Component
  $(this).wrap('<div class="timeline-wrapper"></div>');


  let wrapper = $(this).closest(".timeline-wrapper");
  console.log(wrapper);
  console.log(getDaysInMonth(2023))

  let dayCount = getDaysInMonth(2023)


  let titleIndex = $(this).find(`th[data-name=${params.title}]`).index()
  let startIndex = $(this).find(`th[data-name=${params.start_date}]`).index()
  let endIndex = $(this).find(`th[data-name=${params.end_date}]`).index()
  
  var listOfData = [];
 
  $(this).find("tbody").children("tr").each(function (idata) {
    let ctx = $(this);
   
    let otherAttribute = masterctx.find("thead").find("tr").children("th")
    let anyAttr = [];

    otherAttribute.each(function(){
      if(![titleIndex,startIndex,endIndex].includes($(this).index())){
        
        let attrName = {}
        attrName["value"] = ctx.children("td").eq($(this).index()).text()
        attrName["attr"] =   $(this).text()
        anyAttr.push(attrName)
      }
    })

    console.log(anyAttr)
    
    listOfData[idata] ={
      name: $(this).children("td").eq(titleIndex).text(),
      start: $(this).children("td").eq(startIndex).text(),
      end: $(this).children("td").eq(endIndex).text(),
      otherAttr: anyAttr
    }
    
  })

  window.dataTable[id] = listOfData
  console.log(window.dataTable)
  let colmonth = "";




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

  dayCount.forEach(function (e, ij) {
    let dayCount = "";

    for(let i = 0; i < e["count"]; i++){
      dayCount+=`<div class=' col-day' style='width:20px; text-align:center' data-address='${formatDateToYMD(new Date(2023, ij, i+1))}'>${i+1}</div>`
    }
    colmonth += (`<div class='col-big'><div class=''>
    <div class='' style='padding: 10px'>${e["name"]}</div>
    </div><div class='row-day'>${dayCount}</div></div>`)
  })

  //renderdata
  let rowdata = "";

  $(".container-data").empty()

  let newContainer = `<div class="scroller" style='width: 100%; overflow-x: scroll'>

 
  <div class="container-timeline " style="  display: inline-block" data-id="${id}">
      <div class=" header-month" style="display: inline-flex;" >
          ${colmonth}
      </div>
      <div class="container-data">

      </div>
      
    </div>
    <div class='tooltip-timeline'>
    <ul>
      <li>Nama</li>
    </ul
  </div>
  </div>`;

  
$(this).replaceWith(newContainer)
      
listOfData.forEach(function(e){
  let endRange = wrapper.find(`div[data-address=${e.end}]`).position().left
  let startRange = wrapper.find(`div[data-address=${e.start}]`).position().left
  let width = endRange - startRange;
  let col = ""


  for(let i = 0;i< sumByKey(dayCount,"count");i++){
    let data = getDateFromDayCount(i+2) == e.start ? `<div class='col-data' style='background: #3333cc; box-shadow: 0px 0px 10px black; position: absolute; width: ${width+20}px; top: 2px; left: 0px;z-index: 2; height: 30px; border-radius: 5px'><div style='padding: 3px'>${e.name}</div></div>` : ""
    col+=`<div class='col col-day' style='width:1px; position: relative' data-address=''>${data}</div>`
  }

  let startEl = {dateIndex: $(`div[data-address=${e.start}]`).index(), monthIndex: $(`div[data-address=${e.start}]`).closest(".col-big").index( )}
  let endEl = {dateIndex: $(`div[data-address=${e.end}]`).index(), monthIndex: $(`div[data-address=${e.end}]`).closest(".col-big").index()}

  console.log([startEl,endEl])
 
  rowdata += `<div class='row-data' style='display: flex;'>${col}</div>`;
 // wrapper.find(".container-data").append(`<div class='row-data' ><div class='card-timeline col-data' style='background-color: #849e4f; width: ${width}px; position:absolute; left: ${startRange}px; height: 40px'><div class='p-1'>${e.name}</div></div></div>`)
});

wrapper.find(".container-data").html(rowdata)
document.querySelectorAll(".container-timeline").forEach(function(e){
  e.addEventListener(
    "wheel",
    function touchHandler(e) {
      if (e.ctrlKey) {
        e.preventDefault();
        let width = $(e.target).closest(".container-timeline").find(".col-day").width();
        console.log(e.deltaY/10)
        $(e.target).closest(".container-timeline").find(".col-day").css("width", (width+(e.deltaY/10))+"px")
      }
    }, { passive: false } );
})
};


$(document).ready(function(){
  

  $(document).delegate(".col-data",'mouseover', function(event) {
      let tooltip = $(this).closest(".timeline-wrapper").find(".tooltip-timeline");
      let dataAttr = window.dataTable[$(this).closest(".container-timeline").data("id")][$(this).closest(".row-data").index()];
      let dataList = dataAttr.otherAttr.map(function(e){
        return `<li><b>${e["attr"]}</b>   ${e["value"]}</li>`
      }).join("")
      tooltip.find("ul").html(dataList)
      console.log(dataList)
      tooltip.appendTo($(this))
  });



})







