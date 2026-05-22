const SHEET_ID = '1-kDCASxS6zj9NdTlhhy0-eZ-yVjnO5TgnapHYRP0rPw';
const SHEET_NAME = 'ชีต1';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${1-kDCASxS6zj9NdTlhhy0-eZ-yVjnO5TgnapHYRP0rPw}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(Nited69)}`;
// วาง Web App URL จาก Apps Script ที่ deploy แล้ว เพื่อให้บันทึกข้อมูลได้จริง
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxWmN4XMrM71P3gLuZBA0m5vLGeEw3__Qwv6sb6ncq83DJe9duP6yAfPQ7tsjSlZ05Z/exec'; 
let records = [];
let trendChart, subjectChart;
const sampleData = [
  {date:'2568-05-12',supervisor:'ผู้อำนวยการ',teacher:'น.ส.ดุษมาน แก้วคำ',subject:'วิทยาศาสตร์',grade:'ม.2',score:4.5,comment:'จัดกิจกรรมได้ดี',suggestion:'เพิ่มคำถามปลายเปิด'},
  {date:'2568-05-15',supervisor:'หัวหน้าวิชาการ',teacher:'นายธนกร ศรีสมบัติ',subject:'คณิตศาสตร์',grade:'ป.6',score:4.4,comment:'นักเรียนมีส่วนร่วม',suggestion:'เสริมสื่อรูปธรรม'},
  {date:'2568-05-18',supervisor:'ผู้อำนวยการ',teacher:'น.ส.นิภาพร ใจดี',subject:'ภาษาไทย',grade:'ป.3',score:4.2,comment:'บริหารชั้นเรียนดี',suggestion:'เพิ่มกิจกรรมกลุ่ม'}
];
function $(id){return document.getElementById(id)}
function todayThai(){return new Date().toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric'})}
$('todayText').textContent = todayThai();

document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.tab,.screen').forEach(el=>el.classList.remove('active'));
  btn.classList.add('active'); $(btn.dataset.screen).classList.add('active');
}));
$('refreshBtn').addEventListener('click', loadData);
$('searchInput').addEventListener('input', renderReport);
$('pdfBtn').addEventListener('click',()=>html2pdf().from(document.querySelector('#report')).save('รายงานนิเทศออนไลน์.pdf'));

function parseCSV(text){
  const rows = text.trim().split(/\r?\n/).map(line=>{
    const out=[]; let cur=''; let q=false;
    for(let i=0;i<line.length;i++){const c=line[i]; if(c==='"'&&line[i+1]==='"'){cur+='"';i++;} else if(c==='"'){q=!q;} else if(c===','&&!q){out.push(cur);cur='';} else cur+=c;} out.push(cur); return out;
  });
  if(rows.length<2) return [];
  const headers = rows.shift().map(h=>h.trim());
  return rows.filter(r=>r.some(Boolean)).map(r=>{
    const obj={}; headers.forEach((h,i)=>obj[h]=r[i]||'');
    return normalize(obj);
  });
}
function pick(obj, keys){for(const k of keys){const f=Object.keys(obj).find(x=>x.includes(k)); if(f&&obj[f]) return obj[f];} return ''}
function normalize(o){
  const learning = Number(pick(o,['การจัดการเรียนรู้','learning']))||0;
  const media = Number(pick(o,['สื่อ','media']))||0;
  const participation = Number(pick(o,['มีส่วนร่วม','participation']))||0;
  const assessment = Number(pick(o,['วัด','assessment']))||0;
  const scores=[learning,media,participation,assessment].filter(Boolean);
  const score = Number(pick(o,['คะแนน','score'])) || (scores.length? scores.reduce((a,b)=>a+b,0)/scores.length:0);
  return {
    date: pick(o,['วันที่','date','Timestamp']) || '', supervisor: pick(o,['ผู้นิเทศ','supervisor']) || '',
    teacher: pick(o,['ผู้รับ','ครู','teacher']) || '', subject: pick(o,['วิชา','subject']) || '', grade: pick(o,['ชั้น','grade']) || '',
    score: Number(score)||0, comment: pick(o,['ความคิดเห็น','comment']) || '', suggestion: pick(o,['ข้อเสนอแนะ','suggestion']) || ''
  };
}
async function loadData(){
  try{ const res=await fetch(CSV_URL,{cache:'no-store'}); if(!res.ok) throw new Error('ไม่สามารถอ่านชีตได้'); records=parseCSV(await res.text()); if(!records.length) records=sampleData; }
  catch(e){ records=sampleData; console.warn(e); }
  renderAll();
}
function renderAll(){ renderStats(); renderCharts(); renderReport(); }
function renderStats(){
  $('totalCount').textContent=records.length;
  const avg=records.reduce((a,b)=>a+(b.score||0),0)/(records.length||1); $('avgScore').textContent=avg.toFixed(2);
  $('teacherCount').textContent=new Set(records.map(r=>r.teacher).filter(Boolean)).size;
  const subj=countBy(records,'subject'); const top=Object.entries(subj).sort((a,b)=>b[1]-a[1])[0]||['-',0]; $('topSubject').textContent=top[0]; $('topSubjectCount').textContent=top[1]+' ครั้ง';
}
function countBy(arr,key){return arr.reduce((a,r)=>{const v=r[key]||'-'; a[v]=(a[v]||0)+1; return a;},{})}
function avgBy(arr,key){const m={}; arr.forEach(r=>{const v=r[key]||'-'; if(!m[v])m[v]=[]; if(r.score)m[v].push(r.score)}); return Object.fromEntries(Object.entries(m).map(([k,v])=>[k, v.reduce((a,b)=>a+b,0)/(v.length||1)]));}
function renderCharts(){
  const byDate=avgBy(records,'date'); const labels=Object.keys(byDate).slice(-6); const data=labels.map(l=>byDate[l].toFixed(2));
  if(trendChart) trendChart.destroy(); trendChart=new Chart($('trendChart'),{type:'line',data:{labels,datasets:[{label:'คะแนนเฉลี่ย',data,tension:.35,fill:false}]},options:{plugins:{legend:{display:false}},scales:{y:{min:0,max:5}}}});
  const bySub=avgBy(records,'subject'); const sl=Object.keys(bySub).slice(0,6); const sd=sl.map(l=>bySub[l].toFixed(2));
  if(subjectChart) subjectChart.destroy(); subjectChart=new Chart($('subjectChart'),{type:'bar',data:{labels:sl,datasets:[{label:'คะแนนเฉลี่ย',data:sd}]},options:{plugins:{legend:{display:false}},scales:{y:{min:0,max:5}}}});
}
function renderReport(){
  const q=($('searchInput').value||'').toLowerCase();
  const list=records.filter(r=>JSON.stringify(r).toLowerCase().includes(q));
  $('reportList').innerHTML=list.map(r=>`<article class="report-item"><h4>${r.teacher||'ไม่ระบุชื่อครู'} <span class="badge">${(r.score||0).toFixed(2)}</span></h4><p>${r.subject||'-'} | ${r.grade||'-'} | ${r.date||'-'}</p><p><b>ผู้นิเทศ:</b> ${r.supervisor||'-'}</p><p><b>ความคิดเห็น:</b> ${r.comment||'-'}</p><p><b>ข้อเสนอแนะ:</b> ${r.suggestion||'-'}</p></article>`).join('') || '<p class="status">ไม่พบข้อมูล</p>';
}
$('supervisionForm').addEventListener('submit', async (e)=>{
  e.preventDefault(); const fd=new FormData(e.target);
  const raw=Object.fromEntries(fd.entries());
  raw.score = ['learning','media','participation','assessment'].map(k=>Number(raw[k])).reduce((a,b)=>a+b,0)/4;
  if(!APPS_SCRIPT_URL){ $('formStatus').textContent='กรุณาใส่ APPS_SCRIPT_URL ในไฟล์ app.js ก่อน จึงจะบันทึกลง Google Sheets ได้'; return; }
  try{ await fetch(APPS_SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(raw)}); $('formStatus').textContent='บันทึกสำเร็จ'; e.target.reset(); await loadData(); }
  catch(err){ $('formStatus').textContent='บันทึกไม่สำเร็จ'; }
});
if('serviceWorker' in navigator){ navigator.serviceWorker.register('service-worker.js'); }
loadData();
