ระบบนิเทศออนไลน์ โรงเรียนบ้านสากอ - Mobile Web App / PWA

วิธีใช้งานเร็วที่สุด
1) อัปโหลดโฟลเดอร์นี้ขึ้น GitHub Pages, Netlify หรือโฮสต์ใดก็ได้
2) เปิด index.html ผ่านมือถือ จะเป็นเว็บแอป responsive
3) กด Add to Home Screen เพื่อใช้งานเหมือนแอป

การเชื่อม Google Sheets
- ระบบอ่านข้อมูลจาก Google Sheets ID: 1-kDCASxS6zj9NdTlhhy0-eZ-yVjnO5TgnapHYRP0rPw
- ชื่อชีต: ชีต1
- หากอ่านไม่ได้ ให้ตั้งค่า Share เป็น Anyone with the link can view

การบันทึกข้อมูลลง Google Sheets
1) เปิด Google Sheets > Extensions > Apps Script
2) วางโค้ดจากไฟล์ apps-script.gs
3) Deploy > New deployment > Web app
4) Execute as: Me
5) Who has access: Anyone
6) คัดลอก Web App URL
7) เปิด app.js แล้ววาง URL ที่บรรทัด APPS_SCRIPT_URL = '';

คอลัมน์ที่แนะนำใน Google Sheets
Timestamp | วันที่นิเทศ | ชื่อผู้นิเทศ | ชื่อครูผู้รับการนิเทศ | วิชา | ชั้น | คะแนน | การจัดการเรียนรู้ | การใช้สื่อ | ผู้เรียนมีส่วนร่วม | การวัดผล | ความคิดเห็น | ข้อเสนอแนะ
