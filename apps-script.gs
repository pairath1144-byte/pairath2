const SHEET_ID = '1-kDCASxS6zj9NdTlhhy0-eZ-yVjnO5TgnapHYRP0rPw';
const SHEET_NAME = 'ชีต1';

function doGet() {
  const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const values = sh.getDataRange().getValues();
  const headers = values.shift();
  const data = values.map(row => Object.fromEntries(headers.map((h,i)=>[h,row[i]])));
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Timestamp','วันที่นิเทศ','ชื่อผู้นิเทศ','ชื่อครูผู้รับการนิเทศ','วิชา','ชั้น','คะแนน','การจัดการเรียนรู้','การใช้สื่อ','ผู้เรียนมีส่วนร่วม','การวัดผล','ความคิดเห็น','ข้อเสนอแนะ']);
  }
  sh.appendRow([
    new Date(), data.date, data.supervisor, data.teacher, data.subject, data.grade, data.score,
    data.learning, data.media, data.participation, data.assessment, data.comment, data.suggestion
  ]);
  return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
}
