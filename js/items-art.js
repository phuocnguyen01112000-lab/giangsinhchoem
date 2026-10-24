/* ===== items-art.js — vật phẩm pixel art vẽ bằng code (20x20, tự viền) ===== */
(function(root){
const N=20,K='#3d2b3d',W='#ffffff',PK='#ffb3c7',BL_='#ff8fa8',RD='#ff5a6e',YL='#ffd84a',OR='#ffa94d',
  BR='#c98b5a',DB='#6b3f2a',BL='#6ec6ff',DBL='#3f8fd9',GR='#7bd88f',PU='#b48cff',GY='#c9ccd6',CR='#fff3dc',LB='#bfe9ff';
const HP=['.XX..XX.','XXXXXXXX','XXXXXXXX','.XXXXXX.','..XXXX..','...XX...'];
function inside(p,x,y){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];
  if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c}

function build(fn){
  const b=Array.from({length:N},()=>Array(N).fill(null));
  const P=(x,y,c)=>{if(x>=0&&y>=0&&x<N&&y<N)b[y][x]=c};
  const R=(x,y,w,h,c)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)P(x+i,y+j,c)};
  const shape=(t,c)=>{for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(t(x+.5,y+.5))P(x,y,c)};
  const C=(cx,cy,r,c)=>shape((x,y)=>(x-cx)**2+(y-cy)**2<=r*r,c);
  const E=(cx,cy,rx,ry,c)=>shape((x,y)=>((x-cx)/rx)**2+((y-cy)/ry)**2<=1,c);
  const poly=(pts,c)=>shape((x,y)=>inside(pts,x,y),c);
  const tri=(x,y,h,flip,c)=>{for(let j=0;j<h;j++){const w=j+1;R(flip?x-w+1:x,y+j,w,1,c)}};
  const face=(cx,y,d=3,mouth=true)=>{P(cx-d,y,K);P(cx-d,y+1,K);P(cx+d-1,y,K);P(cx+d-1,y+1,K);
    P(cx-d-2,y+2,BL_);P(cx+d+1,y+2,BL_);if(mouth){P(cx-1,y+2,K);P(cx,y+2,K)}};
  const heart=(x,y,c,sc=1)=>{for(let r=0;r<6;r++)for(let q=0;q<8;q++)if(HP[r][q]==='X')
    R(x+q*sc,y+r*sc,sc,sc,typeof c==='function'?c(r*sc):c)};
  fn({P,R,C,E,poly,tri,face,heart});
  const o=b.map(r=>r.slice());
  for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(!b[y][x]){
    if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>(b[y+dy]||[])[x+dx]))o[y][x]=K}
  return o;
}

const A={
'ga con':({P,R,C,face})=>{const Y='#ffd84a';R(9,2,2,2,Y);C(10,10.5,7,Y);R(2,10,2,3,'#ffc43a');R(16,10,2,3,'#ffc43a');
  R(7,17,2,1,OR);R(11,17,2,1,OR);face(10,8,3,false);R(9,10,2,1,OR);P(6,6,'#fff6b0');P(7,5,'#fff6b0')},
'gau bong':({P,R,C,E,face})=>{const B='#c98b5a';C(10,15.5,3.6,B);C(5,4.5,2.6,B);C(15,4.5,2.6,B);C(10,9,6.2,B);
  P(4,4,PK);P(5,4,PK);P(14,4,PK);P(15,4,PK);E(10,11.5,2.8,2.3,'#f3d9b1');R(9,10,2,1,K);
  P(7,7,K);P(7,8,K);P(12,7,K);P(12,8,K);P(5,10,BL_);P(14,10,BL_);P(9,12,K);P(10,12,K);
  R(7,14,2,2,RD);R(11,14,2,2,RD);R(9,14,2,2,'#c93a4e')},
'tho tai hong':({P,R,C,E,face})=>{E(6,5.5,2.2,4.5,W);E(14,5.5,2.2,4.5,W);E(6,6,1,3,PK);E(14,6,1,3,PK);
  C(10,12,6.2,W);face(10,11,3);R(9,12,2,1,PK);P(8,15,GY);P(11,15,GY)},
'dau tay':({P,R,E,face})=>{E(10,11.5,6.5,7,RD);R(5,4,10,2,GR);R(8,2,4,2,GR);R(9,1,2,1,'#4fae63');
  [[6,8],[10,8],[14,8],[8,15],[12,15],[10,17]].forEach(([x,y])=>P(x,y,YL));face(10,10,3);P(7,6,'#ff9aa8');P(7,7,'#ff9aa8')},
'ca voi':({P,R,E,poly})=>{E(9,12,7.5,5.5,BL);R(15,8,3,2,BL);R(17,6,2,3,BL);E(8,14.2,5,2.3,'#d9f1ff');
  P(4,10,K);P(4,11,K);P(6,13,BL_);P(5,12,BL_);P(3,13,K);P(4,13,K);
  P(5,5,LB);P(5,4,LB);P(5,3,LB);P(4,2,LB);P(6,2,LB);P(3,3,LB);P(7,3,LB)},
'meo':({P,R,E,tri,face})=>{const O='#ffb85c';tri(3,3,4,false,O);tri(16,3,4,true,O);E(10,12,7.5,6,O);
  P(4,5,PK);P(15,5,PK);R(9,6,2,2,'#e8913a');R(6,7,1,2,'#e8913a');R(13,7,1,2,'#e8913a');face(10,11,3);R(9,12,2,1,PK);
  R(0,12,2,1,GY);R(18,12,2,1,GY)},
'buom':({P,R,C,E})=>{E(5,8,4,5,PU);E(15,8,4,5,PU);E(6,14,3,3.5,'#d8bfff');E(14,14,3,3.5,'#d8bfff');
  C(5,8,1.5,PK);C(15,8,1.5,PK);P(5,15,PK);P(14,15,PK);R(9,6,2,10,DB);C(10,6,1.6,DB);
  P(8,4,K);P(7,3,K);P(11,4,K);P(12,3,K);P(7,5,K);P(12,5,K)},
'ngoi sao':({P,R,poly,face})=>{const p=[];for(let i=0;i<10;i++){const a=(-90+i*36)*Math.PI/180,r=i%2?4:8.8;p.push([10+r*Math.cos(a),10.8+r*Math.sin(a)])}
  poly(p,YL);face(10,9,3);P(8,5,'#fff6b0');P(9,4,'#fff6b0')},
'so co la':({P,R,face})=>{R(2,2,16,11,DB);for(const y of[3,8])for(const x of[3,8,13]){R(x,y,4,4,'#9a623d');P(x,y,'#b8794d')}
  R(2,13,16,5,PK);R(2,13,16,1,W);face(10,14,3)},
'polaroid':({P,R,heart})=>{R(8,0,4,2,'#ffe28a');R(3,2,14,17,W);R(5,4,10,10,'#ffe0ea');heart(6,6,RD);P(6,5,W);P(7,5,W);R(6,16,6,1,GY);R(6,17,3,1,GY)},
'tra sua':({P,R})=>{for(let y=6;y<=17;y++){const w=2*Math.round(6-(y-6)*.17);R(10-w/2,y,w,1,'#f1d3a8')}
  R(3,4,14,2,W);R(12,0,2,4,PK);const t='#5a3a2a';[[8,15],[10,15],[12,15],[7,16],[9,16],[11,16]].forEach(([x,y])=>P(x,y,t));
  P(7,10,K);P(7,11,K);P(12,10,K);P(12,11,K);P(5,12,BL_);P(14,12,BL_);P(9,12,K);P(10,12,K);R(5,7,1,2,W)},
've phim':({P,R,face})=>{R(1,4,18,12,'#ffcf5a');P(1,9,null);P(1,10,null);P(18,9,null);P(18,10,null);
  for(let y=5;y<15;y+=2)P(13,y,W);face(7,8,2);P(16,8,W);P(16,9,W);P(16,10,W);P(15,9,W);P(17,9,W);R(4,13,6,1,'#e6a82e')},
'may anh':({P,R,C})=>{R(2,6,16,11,PK);R(6,3,5,3,'#ff8fa8');R(13,4,3,2,YL);R(2,8,16,1,W);
  C(10,12,4.6,W);C(10,12,3.6,DBL);C(10,12,2,'#9fe0ff');P(9,11,W);P(4,14,BL_);P(5,14,BL_);P(15,14,BL_);P(16,14,BL_);P(4,10,RD)},
'thu cu':({P,R,heart})=>{R(2,5,16,12,'#f6e2b3');for(let i=0;i<8;i++){P(2+i,5+i,'#c9a566');P(17-i,5+i,'#c9a566')}
  heart(6,10,RD);P(4,15,'#d8bd84');P(15,15,'#d8bd84');P(14,6,'#e8d09a')},
'hop nhac':({P,R,face})=>{R(2,9,16,9,BR);R(1,6,18,4,'#a8683f');R(9,9,2,2,YL);R(11,4,2,2,PK);R(13,1,1,5,PK);R(14,1,2,1,PK);
  face(10,12,3);R(18,12,2,1,GY);R(19,11,1,3,GY)},
'meo no':({P,R,E,tri,face})=>{tri(3,3,4,false,W);tri(16,3,4,true,W);E(10,12,7.5,6,W);P(4,5,PK);P(15,5,PK);
  face(10,11,3);R(9,12,2,1,YL);R(0,12,2,1,GY);R(18,12,2,1,GY);R(12,3,3,3,RD);R(16,3,3,3,RD);R(15,4,1,1,'#c93a4e')},
'mat trang':({P,C})=>{C(10,10,8,YL);C(14.5,8,6.6,null);P(3,9,K);P(3,10,K);P(6,9,K);P(6,10,K);P(2,11,BL_);P(7,11,BL_);P(4,12,K);P(5,12,K);
  P(16,14,YL);P(16,15,YL);P(16,16,YL);P(15,15,YL);P(17,15,YL);P(17,3,YL)},
'kim cuong':({P,R,poly,face})=>{poly([[10,18],[2,8],[5,3],[15,3],[18,8]],'#4fb8ff');poly([[6,4],[14,4],[12.5,8],[7.5,8]],'#bde9ff');
  poly([[10,18],[18,8],[11,8]],'#2f86d9');R(2,8,16,1,'#2f86d9');P(6,5,W);P(7,5,W);face(10,11,2)},
'nha nho':({P,R,C,poly})=>{R(14,3,2,4,'#a8683f');poly([[10,2],[1,10],[19,10]],RD);R(4,10,12,8,CR);R(8,13,4,5,BR);P(11,15,YL);
  R(5,12,2,2,'#9fe0ff');R(13,12,2,2,'#9fe0ff');C(10,7.5,1.5,'#9fe0ff')},
've tau':({P,R})=>{R(1,4,18,12,'#bfe3ff');R(1,4,18,3,DBL);R(3,5,6,1,W);P(1,9,null);P(1,10,null);P(18,9,null);P(18,10,null);
  for(let y=8;y<15;y+=2)P(14,y,DBL);R(3,9,9,4,RD);R(9,7,3,2,RD);[4,6,8].forEach(x=>P(x,10,'#9fe0ff'));P(4,13,K);P(6,13,K);P(10,13,K);
  P(16,10,DBL);P(16,9,DBL);P(16,11,DBL);P(15,10,DBL);P(17,10,DBL);P(10,5,W);P(11,5,W)},
'banh kem':({P,R,face})=>{R(2,12,16,6,'#ffb3c7');R(5,7,10,5,'#fff0f5');R(2,12,16,1,W);[4,8,12,15].forEach(x=>P(x,13,W));
  R(9,3,2,4,'#7ad7ff');P(9,1,OR);P(10,1,OR);P(9,2,YL);P(10,2,YL);P(7,9,RD);P(12,9,DBL);P(10,10,RD);face(10,14,3)},
'chia khoa':({P,R,C,face})=>{R(11,7,8,3,YL);R(15,10,2,3,YL);R(18,10,2,2,YL);C(6,8,5.6,YL);face(6,7,2);P(3,4,W);P(4,3,W)},
'ban do':({P,R,C})=>{R(2,3,16,14,'#f6e2b3');R(7,3,1,14,'#e0c88a');R(12,3,1,14,'#e0c88a');R(3,4,3,2,GR);R(14,12,3,3,GR);C(9.5,6.5,1.6,BL);
  [[4,13],[5,12],[7,12],[9,13],[10,14],[12,13],[14,11],[15,9]].forEach(([x,y])=>P(x,y,RD));
  [[14,6],[16,6],[15,7],[14,8],[16,8]].forEach(([x,y])=>P(x,y,RD))},
'nhan bac':({P,E,poly})=>{E(10,13,6,5.5,GY);E(10,13,3.6,3.1,null);poly([[10,1.5],[13.5,4.5],[10,8],[6.5,4.5]],'#ff8fb8');P(9,3,W);P(9,4,W);P(5,12,W);P(5,13,W)},
'ao am':({P,R,face})=>{R(5,5,10,13,'#f4a3b5');R(1,6,4,8,'#f4a3b5');R(15,6,4,8,'#f4a3b5');R(1,13,4,2,W);R(15,13,4,2,W);
  R(5,16,10,2,W);R(7,4,6,2,W);R(5,12,10,1,W);R(5,14,10,1,W);face(10,8,3)},
'keo':({P,R,C,poly,face})=>{poly([[1,5],[6,10],[1,15]],'#ffd2e0');poly([[19,5],[14,10],[19,15]],'#ffd2e0');C(10,10,5.2,RD);
  P(8,6,W);P(9,6,W);P(7,7,W);face(10,9,2)},
'so tinh yeu':({P,R,heart,face})=>{R(3,2,13,16,'#ff7a90');R(3,2,3,16,'#d9475f');R(16,3,2,14,CR);[5,8,11,14].forEach(y=>P(4,y,W));
  heart(7,5,W);face(10,12,3);R(15,2,1,16,YL)},
'trai tim cau vong':({P,R,heart,face})=>{const c=['#ff5a6e','#ff9a3c','#ffd84a','#7bd88f','#6ec6ff','#b48cff'];
  heart(2,3,r=>c[Math.min(5,r>>1)],2);face(10,8,3);P(4,5,W);P(5,5,W);P(4,6,W);R(17,1,1,3,YL);R(16,2,3,1,YL)},
'goi bong':({P,R,heart,face})=>{R(2,3,16,14,'#ffc2d6');R(2,3,16,1,'#ff9fbd');R(2,16,16,1,'#ff9fbd');R(2,3,1,14,'#ff9fbd');R(17,3,1,14,'#ff9fbd');
  [[1,2],[18,2],[1,17],[18,17]].forEach(([x,y])=>P(x,y,YL));heart(6,5,RD);P(7,6,W);face(10,12,3)},
'gau om tim':({P,R,C,E})=>{const B='#c98b5a';C(5,3.5,2.1,B);C(15,3.5,2.1,B);C(10,14.5,4.2,B);C(10,7.5,5,B);P(5,3,PK);P(15,3,PK);
  E(10,9,2.3,1.7,'#f3d9b1');R(9,8,2,1,K);P(7,6,K);P(7,7,K);P(12,6,K);P(12,7,K);P(5,9,BL_);P(14,9,BL_);
  R(4,12,3,2,B);R(13,12,3,2,B);
  const H=['.XX..XX.','XXXXXXXX','XXXXXXXX','.XXXXXX.','..XXXX..','...XX...'];H.forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch==='X')P(6+i,11+j,RD)}));P(7,12,'#ff9aa8')},
'bong hoa':({P,C,face})=>{const p=PK;[[10,5],[15,9],[13,15],[7,15],[5,9]].forEach(([x,y])=>C(x,y,3.1,p));C(10,10,3.4,YL);face(10,9,2);P(9,4,W);P(10,4,W)},
'bang nhac':({P,R,C})=>{R(1,4,18,13,'#c9a6ff');R(3,6,14,7,CR);C(6.5,9.5,2.4,'#5a4a6a');C(13.5,9.5,2.4,'#5a4a6a');P(6,9,W);P(7,9,W);P(13,9,W);P(14,9,W);
  R(9,10,2,1,'#5a4a6a');P(9,7,RD);P(10,7,RD);R(5,13,10,4,'#a583e6');[7,9,10,12].forEach(x=>P(x,15,K));P(3,14,BL_);P(16,14,BL_)},
'vong tay':({P,C})=>{const cs=[PK,YL,BL,PU];for(let i=0;i<12;i++){const a=i*Math.PI/6,x=10+6.6*Math.cos(a),y=10+6.6*Math.sin(a);C(x,y,1.55,cs[i%4]);P(Math.round(x-1),Math.round(y-1),W)}},
'day chuyen':({P,heart})=>{for(let i=0;i<=8;i++){const c=i%2?W:GY,y=2+Math.round(i*1.1);P(3+i,y,c);P(17-i,y,c)}heart(6,10,'#ff7a90');P(7,11,W);P(8,11,W)}
};
const ALIAS={'chick':'ga con','bear':'gau bong','bunny':'tho tai hong','pillow':'goi bong','strawberry':'dau tay','whale':'ca voi','cat':'meo','butterfly':'buom','star':'ngoi sao','choco':'so co la','hugbear':'gau om tim','rainbow1':'trai tim cau vong','rainbow2':'trai tim cau vong','rainbow3':'trai tim cau vong','polaroid':'polaroid','boba':'tra sua','movie':'ve phim','flower':'bong hoa','tape':'bang nhac','camera':'may anh','oldletter':'thu cu','bracelet':'vong tay','musicbox':'hop nhac','kitty':'meo no','necklace':'day chuyen','moon':'mat trang','diamond':'kim cuong','house':'nha nho','train':'ve tau','cake':'banh kem','key':'chia khoa','map':'ban do','ring':'nhan bac','sweater':'ao am','candy':'keo','lovebook':'so tinh yeu','hello kitty':'meo no'};

const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
function keyFor(it){
  const cands=[it.art,it.id,it.name].map(norm).filter(Boolean);
  for(const c of cands){if(A[c])return c;if(ALIAS[c])return ALIAS[c]}
  for(const c of cands){const k=Object.keys(A).concat(Object.keys(ALIAS)).sort((a,b)=>b.length-a.length).find(k=>c.includes(k));if(k)return A[k]?k:ALIAS[k]}
  return it.sp?'trai tim cau vong':null;
}
const FALLBACK=({R,heart})=>heart(6,7,PK,1);
const cache={};
function grid(key){return build(A[key]||FALLBACK)}
function dataURL(key){
  if(cache[key])return cache[key];
  const g=grid(key),cv=document.createElement('canvas');cv.width=cv.height=N;const x=cv.getContext('2d');
  for(let y=0;y<N;y++)for(let i=0;i<N;i++)if(g[y][i]){x.fillStyle=g[y][i];x.fillRect(i,y,1,1)}
  return cache[key]=cv.toDataURL();
}
if(typeof document!=='undefined'){
  const st=document.createElement('style');
  st.textContent='.pxi{image-rendering:pixelated;width:60px;height:60px;vertical-align:middle}.slot .pxi{width:40px;height:40px}.big .pxi{width:120px;height:120px}';
  document.head.appendChild(st);
  /* pixelIcon(it): trả về thẻ <img> chứa sprite pixel (dùng trong icon() của items.js) */
  root.pixelIcon=function(it){
    const k=keyFor(it)||('?'+norm(it.name||it.id));
    if(!A[k]&&!root.__warned?.[k]){(root.__warned=root.__warned||{})[k]=1;console.warn('[items-art] chưa có hình cho:',it.id,it.name)}
    return '<img class="pxi" alt="'+(it.name||'')+'" src="'+dataURL(A[k]?k:'?')+'">';
  };
}
root.ITEM_ART={A,ALIAS,build,keyFor,grid,N};
if(typeof module!=='undefined')module.exports=root.ITEM_ART;
})(typeof window!=='undefined'?window:globalThis);
