const cv=document.getElementById('c'),ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
const CW=460,CH=560,MX=50,OX=20,OY=70,W=320,H=380,FLOOR=335,TOP=50,CHUTE=60,PW=38;
const COST=2, MISS=0.4, SLIP=0.15, SPEED=1.6;     // 2 xu/lượt · 40% trượt · 15% tuột · tốc độ càng
const $=id=>document.getElementById(id),msg=t=>$('msg').textContent=t;
const rnd=(a,b)=>a+Math.random()*(b-a);
const BTN={coin:{x:62,y:505,r:26},r:{x:190,y:505,r:26},d:{x:290,y:505,r:26}};   // toạ độ trong máy
const ARW={l:{x:29,y:280},r:{x:431,y:280}};                                      // toạ độ trên canvas
let mi=0,prizes=[],claw={x:CHUTE/2,tip:TOP,open:1},state='locked',timer=0,held=null,right=false,pressed=null,tick=0;
// state: locked (chờ bỏ xu) → idle (điều khiển được) → drop → grab → rise → back → release → locked | done

const isDone=k=>{const o=Store.load().items;return ITEMS.filter(i=>i.m===k).every(i=>o[i.id])};
const unlocked=k=>k===0||isDone(k-1);

function hud(){
  const s=Store.load();$('coins').textContent=s.coins;$('owned').textContent=Object.keys(s.items).length+'/'+ITEMS.length;
  const n=ITEMS.filter(i=>i.m===mi&&s.items[i.id]).length;
  $('prog').textContent=MACHINES[mi].name+' · '+n+'/12   '+MACHINES.map((m,k)=>k===mi?'■':'□').join(' ');
}
function saveStock(){Store.update(s=>{s.stock[mi]=prizes.map(p=>({id:p.id,x:p.x,y:p.y}))})}
function spawn(k){                              // 12 hộp quà xếp kim tự tháp 5-4-3
  const ids=ITEMS.filter(i=>i.m===k).map(i=>i.id).sort(()=>Math.random()-.5);prizes=[];
  const row=(n,cx0,y)=>{for(let i=0;i<n;i++)prizes.push({id:ids.pop(),x:cx0+i*44-PW/2,y,fall:false})};
  row(5,CHUTE+30,FLOOR-PW);row(4,CHUTE+52,FLOOR-PW*2+4);row(3,CHUTE+74,FLOOR-PW*3+8);
  saveStock();
}
function loadMachine(k){
  mi=k;Store.update(s=>{s.cur=k});const s=Store.load();
  if(s.stock[k])prizes=s.stock[k].filter(p=>byId(p.id)).map(p=>({id:p.id,x:p.x,y:p.y,fall:false}));else spawn(k);
  claw={x:CHUTE/2,tip:TOP,open:1};held=null;
  if(!prizes.length&&!isDone(k))spawn(k);
  state=prizes.length?(s.paid?'idle':'locked'):'done';hud();
  msg(state==='done'?'Máy này đã hoàn thành 🎉':state==='locked'?'Nhấn nút 🪙 để bỏ xu và bắt đầu chơi!':'Bạn đã bỏ xu rồi, chơi nào!');
}
function goMachine(k){
  if(k<0||k>=MACHINES.length)return;
  if(state!=='locked'&&state!=='done'){msg('Chơi xong lượt này đã nhé!');return}
  if(!unlocked(k)){msg('🔒 Gắp đủ 12 món ở máy này để mở khóa máy kế tiếp!');return}
  closeModal();loadMachine(k);
}

/* ---------- Vẽ kiểu pixel ---------- */
function R(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)}
function pbox(x,y,w,h,fill){R(x+4,y,w-8,h,'#1a1c2c');R(x,y+4,w,h-8,'#1a1c2c');R(x+4,y+4,w-8,h-8,fill)}   // hộp góc khuyết, viền đen
function txt(t,x,y,size,col){ctx.font='bold '+size+'px "Courier New",monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=col;ctx.fillText(t,x,y)}
function drawPrize(p){ctx.drawImage(PX.spr(SPR.gift,3,giftOv(p.id)),Math.round(p.x)+1,Math.round(p.y)+2)}
function drawClaw(){
  const x=claw.x,t=claw.tip,sp=6+7*claw.open;
  R(x-2,22,4,t-42,'#1a1c2c');
  R(x-10,t-20,20,10,'#1a1c2c');R(x-8,t-18,16,6,'#e8eefc');
  R(x-sp-4,t-12,8,14,'#1a1c2c');R(x-sp-2,t-12,4,12,'#e8eefc');R(x+sp-4,t-12,8,14,'#1a1c2c');R(x+sp-2,t-12,4,12,'#e8eefc');
  R(x-sp+4,t-4,6,6,'#1a1c2c');R(x+sp-10,t-4,6,6,'#1a1c2c');
}
function pbtn(b,col,on,en,kind){
  ctx.save();ctx.globalAlpha=en?1:.4;const x0=b.x-24,y0=b.y-24,o=on?4:0;
  pbox(x0,y0+4,48,48,'#1a1c2c');pbox(x0,y0+o,48,48,on?'#fff':col);
  const cx=b.x,cy=b.y+o;
  if(kind==='coin')ctx.drawImage(PX.spr(SPR.coin,2),cx-8,cy-8);
  else{ctx.fillStyle=on?col:'#fff';
    if(kind==='r')for(let i=0;i<7;i++){const k=Math.min(i,6-i);ctx.fillRect(cx-8,cy-14+i*4,(k+1)*4,4)}
    else for(let j=0;j<6;j++){const w=(6-j)*5;ctx.fillRect(cx-Math.floor(w/2),cy-12+j*4,w,4)}}
  ctx.restore();
}
function arrow(dir,a,on,en,locked){            // mũi tên nhọn pixel ở hai bên máy
  ctx.save();ctx.globalAlpha=en?1:.35;const o=on?4:0;
  const shape=(ox,oy,col)=>{ctx.fillStyle=col;for(let i=0;i<10;i++){const k=Math.min(i,9-i),w=(k+1)*6,x0=dir<0?a.x+14-w:a.x-14;ctx.fillRect(x0+ox,a.y-20+i*4+oy,w,4)}};
  const edge=[[-4,0],[4,0],[0,-4],[0,4]];
  edge.forEach(([x,y])=>shape(x,y+o+4,'#1a1c2c'));edge.forEach(([x,y])=>shape(x,y+o,'#1a1c2c'));
  shape(0,o,on?'#fff':'#ffd23f');shape(0,o+16,on?'#fff':'#ffd23f');
  if(locked){R(a.x-7,a.y+34,14,10,'#1a1c2c');R(a.x-5,a.y+36,10,6,'#ffd23f');R(a.x-5,a.y+26,2,9,'#1a1c2c');R(a.x+3,a.y+26,2,9,'#1a1c2c');R(a.x-5,a.y+26,10,2,'#1a1c2c')}
  ctx.restore();
}
function draw(){
  const T=MACHINES[mi];ctx.clearRect(0,0,CW,CH);
  ctx.save();ctx.translate(MX,0);
  pbox(6,6,348,548,T.c);R(14,14,6,520,'rgba(255,255,255,.35)');                 // thân máy
  pbox(50,14,260,40,'#fff');txt(T.title,182,36,20,T.d);txt(T.title,180,34,20,'#1a1c2c');
  ctx.drawImage(PX.spr(SPR.heart,2),22,24);ctx.drawImage(PX.spr(SPR.heart,2),322,24);
  pbox(14,64,332,392,'#fff');                                                    // khung kính
  ctx.save();ctx.beginPath();ctx.rect(OX,OY,W,H);ctx.clip();ctx.translate(OX,OY);
  T.bg.forEach((c,i)=>R(0,i*95,W,95,c));
  for(let i=0;i<14;i++)R((i*83)%300+8,(i*47)%250+20,4,4,'rgba(255,255,255,.8)');   // chấm sáng
  R(0,0,W,22,T.c);R(0,22,W,4,T.d);                                               // ray
  R(0,FLOOR,W,H-FLOOR,T.c);R(0,FLOOR,W,4,T.d);for(let i=0;i<W;i+=16)if((i>>4)&1)R(i,FLOOR+4,16,8,'rgba(0,0,0,.15)');
  R(0,FLOOR-56,CHUTE,H,'rgba(0,0,0,.16)');R(CHUTE-4,FLOOR-56,4,H,T.d);txt('OUT',CHUTE/2-2,FLOOR+22,11,'#fff');
  prizes.slice().sort((a,b)=>a.y-b.y).forEach(drawPrize);
  drawClaw();if(held)drawPrize(held);
  R(14,34,6,28,'rgba(255,255,255,.5)');R(14,68,6,6,'rgba(255,255,255,.5)');        // ánh kính
  ctx.restore();
  pbox(14,466,332,80,T.d);                                                       // bảng điều khiển
  const play=state==='idle';
  pbtn(BTN.coin,'#ffc83d',pressed==='coin',state==='locked','coin');
  pbtn(BTN.r,T.c,pressed==='r',play,'r');pbtn(BTN.d,T.c,pressed==='d',play,'d');
  ['BỎ XU','SANG PHẢI','GẮP'].forEach((t,i)=>txt(t,[62,190,290][i],541,10,'#fff'));
  ctx.restore();
  arrow(-1,ARW.l,pressed==='al',mi>0,false);
  arrow(1,ARW.r,pressed==='ar',mi<MACHINES.length-1,mi<MACHINES.length-1&&!unlocked(mi+1));
}

/* ---------- Logic ---------- */
function update(){
  if(state==='idle'){if(right)claw.x=Math.min(W-24,claw.x+SPEED)}
  else if(state==='drop'){
    claw.tip+=3;
    const hit=prizes.filter(p=>!p.fall&&Math.abs(claw.x-(p.x+PW/2))<20&&claw.tip>=p.y+8).sort((a,b)=>a.y-b.y)[0];
    if(hit||claw.tip>=FLOOR-4){held=hit||null;state='grab';timer=0}
  }
  else if(state==='grab'){
    timer++;claw.open=Math.max(0,1-timer/20);
    if(timer>=24){
      if(held){
        const r=Math.random();
        if(r<MISS){held=null;msg('Trượt rồi! 😢')}
        else{prizes=prizes.filter(p=>p!==held);held.slip=r<MISS+SLIP?rnd(TOP+60,FLOOR-90):null;msg('Gắp được hộp quà rồi, đang kéo lên...')}
      }else msg('Không gắp trúng gì cả 😅');
      state='rise';
    }
  }
  else if(state==='rise'){
    claw.tip-=2.5;
    if(held){held.x=claw.x-PW/2;held.y=claw.tip-12;
      if(held.slip!=null&&claw.tip<held.slip){held.fall=true;prizes.push(held);held=null;msg('Ôi, tuột mất rồi! 😭')}}
    if(claw.tip<=TOP){claw.tip=TOP;state='back'}
  }
  else if(state==='back'){
    claw.x-=2;if(held)held.x=claw.x-PW/2;
    if(claw.x<=CHUTE/2){claw.x=CHUTE/2;state='release'}
  }
  else if(state==='release'){
    claw.open=Math.min(1,claw.open+0.08);
    if(held&&claw.open>=1){held.y+=4;if(held.y>H){const id=held.id;held=null;win(id)}}
    if(!held&&claw.open>=1){
      Store.update(s=>{s.paid=false});state=prizes.length?'locked':'done';
      if(state==='locked')msg('Bỏ xu để chơi tiếp nhé 🪙');
    }
  }
  let landed=false;
  prizes.forEach(p=>{
    if(!p.fall)return;
    p.y+=5;let lim=FLOOR-PW;
    prizes.forEach(q=>{if(q!==p&&!q.fall&&Math.abs(q.x-p.x)<PW*.7&&q.y+10>p.y-PW)lim=Math.min(lim,q.y-PW+8)});
    if(p.y>=lim){p.y=lim;p.fall=false;landed=true}
  });
  if(landed)saveStock();
}

/* ---------- Bỏ xu / Thả gắp ---------- */
function insertCoin(){
  if(state==='done'){msg('Máy này hết đồ rồi, hãy sang máy khác!');return}
  if(state!=='locked')return;
  if(Store.load().coins<COST){msg('Không đủ xu! Vào 🎯 Nhiệm vụ để kiếm thêm nhé.');return}
  Store.update(s=>{s.coins-=COST;s.paid=true});hud();
  state='idle';msg('Đã bỏ 2 xu! Giữ ▶ để di chuyển, rồi bấm ▼ để gắp.');
}
function startDrop(){
  if(state==='locked'){msg('Hãy bỏ xu trước đã 🪙');return}
  if(state!=='idle')return;
  if(claw.x<CHUTE+24){msg('Đưa càng sang phải trước đã!');return}
  state='drop';msg('Đang gắp...');
}

/* ---------- Mở hộp quà / Bộ sưu tập ---------- */
function openModal(h){$('mbox').innerHTML=h;$('modal').classList.add('show')}
function closeModal(){$('modal').classList.remove('show')}
function win(id){
  Store.update(s=>{s.items[id]=1});saveStock();hud();
  openModal(`<h2>🎁 Gắp được hộp quà rồi!</h2><img class="gift" src="${PX.spr(SPR.gift,10,giftOv(id)).toDataURL()}" alt="">
    <p>Bên trong là gì nhỉ?</p><button class="btn-main" onclick="reveal('${id}')">Mở quà!</button>`);
}
function reveal(id){
  const it=byId(id),fin=isDone(mi);
  const extra=fin?(mi<2?`<p>🎉 Bạn đã hoàn thành ${MACHINES[mi].name}!<br>Máy ${mi+2} đã được mở khóa.</p>`:'<p>🏆 Bạn đã sưu tầm đủ 36 vật phẩm!</p>'):'';
  openModal(`<div class="big${it.sp?' sp':''}">${icon(it)}</div><h2>${it.sp?'✨ ':''}${it.name}</h2><p class="note">💌 ${it.note}</p>
    <p>${it.sp?'🌈 Vật phẩm đặc biệt!':'✨ Vật phẩm mới!'}</p>${extra}
    <button class="btn-main" onclick="${fin&&mi<2?`goMachine(${mi+1})`:'closeModal()'}">${fin&&mi<2?'Sang Máy '+(mi+2)+' →':'Tuyệt vời!'}</button>`);
}
function showCollection(){
  const s=Store.load();
  openModal('<h2>🧺 Bộ sưu tập</h2>'+MACHINES.map((m,k)=>`<h4>${m.name}</h4><div class="grid g4">`+ITEMS.filter(i=>i.m===k).map(it=>
    s.items[it.id]?`<div class="slot${it.sp?' sp':''}" onclick="showItem('${it.id}')">${icon(it)}<small>${it.name}</small></div>`
                  :`<div class="slot lock"><span class="emo">❔</span><small>???</small></div>`).join('')+'</div>').join('')
    +'<br><button class="btn-main" onclick="closeModal()">Đóng</button>');
}
function showItem(id){
  const it=byId(id);
  openModal(`<div class="big${it.sp?' sp':''}">${icon(it)}</div><h2>${it.name}</h2><p class="note">💌 ${it.note}</p>
    <button class="btn-main" onclick="showCollection()">← Quay lại</button>`);
}

/* ---------- Điều khiển ---------- */
const cpos=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*CW/r.width,y:(e.clientY-r.top)*CH/r.height}};
const near=(b,p)=>Math.hypot(p.x-b.x,p.y-b.y)<=b.r+8;
const inArrow=(a,p)=>Math.abs(p.x-a.x)<26&&Math.abs(p.y-a.y)<34;
cv.addEventListener('pointerdown',e=>{
  const p=cpos(e),q={x:p.x-MX,y:p.y};
  if(inArrow(ARW.l,p)){e.preventDefault();pressed='al';goMachine(mi-1)}
  else if(inArrow(ARW.r,p)){e.preventDefault();pressed='ar';goMachine(mi+1)}
  else if(near(BTN.coin,q)){e.preventDefault();pressed='coin';insertCoin()}
  else if(near(BTN.r,q)){e.preventDefault();cv.setPointerCapture(e.pointerId);pressed='r';right=true;if(state==='locked')msg('Hãy bỏ xu trước đã 🪙')}
  else if(near(BTN.d,q)){e.preventDefault();pressed='d';startDrop()}});
['pointerup','pointercancel'].forEach(ev=>cv.addEventListener(ev,()=>{right=false;pressed=null}));
addEventListener('keydown',e=>{
  if(e.code==='KeyC')insertCoin();
  if(e.code==='ArrowRight'||e.code==='KeyD'){right=true;pressed='r'}
  if(e.code==='Space'||e.code==='ArrowDown'||e.code==='KeyS'){e.preventDefault();startDrop()}});
addEventListener('keyup',e=>{if(e.code==='ArrowRight'||e.code==='KeyD'){right=false;pressed=null}});
addEventListener('focus',hud);

loadMachine(Store.load().cur||0);
let last=performance.now(),acc=0;
(function loop(n){acc+=Math.min(100,n-last);last=n;while(acc>=16.67){update();acc-=16.67}draw();requestAnimationFrame(loop)})(last);
