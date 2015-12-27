var main = document.getElementById('main');
var drop = document.getElementById('drop');
var openfile = document.getElementById('openfile');

/*

var data = [
  ["", "Ford", "Volvo", "Toyota", "Honda"],
  ["2014", 10, 11, 12, 13],
  ["2015", 20, 11, 14, 13],
  ["2016", 30, 15, 12, 13]
];

var container = document.getElementById('main');
var hot = new Handsontable(container, {
  data: data,
  minSpareRows: 1,
  rowHeaders: true,
  colHeaders: true,
  stretchH: 'all',
  contextMenu: true
});

*/

function to_data(wb) {
  var result = [];
  var ws = wb.Sheets[wb.SheetNames[0]];
  var csv = XLS.utils.sheet_to_csv(ws);
  return csv.split('\n').map(function(x){return x.split(",")});
}

function openSpreadsheetData(data) {
  /* if binary string, read with type 'binary' */
  var workbook = XLS.read(data, {type: 'binary'});
  // console.log(workbook);
  var data = to_data(workbook)
  // console.log(data);
  
  var hot = new Handsontable(main, {
    data: data,
    minSpareRows: 1,
    rowHeaders: true,
    colHeaders: true,
    stretchH: 'all',
    contextMenu: true
  });
}

function openSpreadsheetFile(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    var data = e.target.result;
    openSpreadsheetData(data);
  };
  reader.readAsBinaryString(file); 
}

function openFile() {
  chrome.fileSystem.chooseEntry({
    type: 'openFile',
    accepts:[{
      extensions: ['xls','xlsx','ods']
    }]
  }, function (entry) {
    if (chrome.runtime.lastError) {
      showError(chrome.runtime.lastError.message);
      return;
    }
    // console.log(entry);
    entry.file(openSpreadsheetFile);
  });
}


/* set up drag-and-drop event */
function handleDrop(e) {
  e.stopPropagation();
  e.preventDefault();
  // var files = e.dataTransfer.files;
  //var i,f;
  //for (i = 0, f = files[i]; i != files.length; ++i) {
  //  openSpreadsheetFile(f);
  //}
  openSpreadsheetFile(e.dataTransfer.files[0]);
}

function handleDragover(e) {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
}

if(drop.addEventListener) {
	drop.addEventListener('dragenter', handleDragover, false);
	drop.addEventListener('dragover', handleDragover, false);
	drop.addEventListener('drop', handleDrop, false);
}
openfile.addEventListener('click', openFile, false);

console.log(launchData);

if (launchData && launchData.items && launchData.items.length > 0) {
  var entry = launchData.items[0].fileentry;
  // console.log(entry);
  entry.file(openSpreadsheetFile);
}