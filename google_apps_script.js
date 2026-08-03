// GOOGLE APPS SCRIPT CODE
// SpreadSheet ID: 1-XA5ecvIW-5xHjA8i82nnc4ETZAWTaJ77UChAtTAQdA

var SHEET_ID = "1-XA5ecvIW-5xHjA8i82nnc4ETZAWTaJ77UChAtTAQdA";

function doGet(e) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var action = e.parameter.action;

  // 1. Search Payment Status
  if (action === "checkPayment" || e.parameter.phone) {
    var sheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    var phone = e.parameter.phone;
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString() == phone) {
        var result = {
          status: "success",
          name: data[i][1],
          accId: data[i][2],
          total: data[i][3],
          paid: data[i][4],
          due: data[i][5]
        };
        return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({status: "not_found"})).setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Get Reviews
  if (action === "getReviews") {
    var reviewSheet = ss.getSheetByName("Reviews");
    if (!reviewSheet) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    
    var data = reviewSheet.getDataRange().getValues();
    var reviews = [];
    for (var i = 1; i < data.length; i++) {
      reviews.push({
        name: data[i][0],
        rating: data[i][1],
        comment: data[i][2],
        imageUrl: data[i][3],
        date: data[i][4]
      });
    }
    return ContentService.createTextOutput(JSON.stringify(reviews)).setMimeType(ContentService.MimeType.JSON);
  }
}

// 3. Add Review with Screenshot Upload to Drive
function doPost(e) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var reviewSheet = ss.getSheetByName("Reviews");
  
  if (!reviewSheet) {
    reviewSheet = ss.insertSheet("Reviews");
    reviewSheet.appendRow(["Name", "Rating", "Comment", "Image URL", "Date"]);
  }

  var data = JSON.parse(e.postData.contents);
  var imageUrl = "";

  if (data.image) {
    var folder = DriveApp.getRootFolder();
    var contentType = data.image.substring(5, data.image.indexOf(';'));
    var bytes = Utilities.base64Decode(data.image.substr(data.image.indexOf('base64,') + 7));
    var blob = Utilities.newBlob(bytes, contentType, "Review_" + new Date().getTime());
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    imageUrl = "https://lh3.googleusercontent.com/d/" + file.getId();
  }

  var today = new Date().toLocaleDateString();
  reviewSheet.appendRow([data.name, data.rating, data.comment, imageUrl, today]);
  
  return ContentService.createTextOutput(JSON.stringify({status: "success"})).setMimeType(ContentService.MimeType.JSON);
}
