// Tiện ích vẽ pixel-art: mỗi sprite chỉ khai báo NỬA TRÁI, tự lật đối xứng thành đủ hình.
const PAL={k:'#1a1c2c',w:'#ffffff',o:'#f4a259',p:'#ff6fa5',g:'#5cd65c',G:'#2e8b3e',y:'#ffd23f',Y:'#e69500',r:'#ff3b5c',b:'#8b5a2b',B:'#5c3a1a',s:'#b0b8c8',c:'#4fd6ff'};
const PX={
  _c:{},
  spr(half,s=2,ov){                       // ov: bảng màu ghi đè (vd {L:'#fff',D:'#000'})
    const key=half.join('|')+s+(ov?JSON.stringify(ov):'');if(this._c[key])return this._c[key];
    const pal=ov?Object.assign({},PAL,ov):PAL;
    const rows=half.map(r=>r+[...r].reverse().join('')),cv=document.createElement('canvas');
    cv.width=rows[0].length*s;cv.height=rows.length*s;const g=cv.getContext('2d');
    rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!=='.'){g.fillStyle=pal[ch];g.fillRect(x*s,y*s,s,s)}}));
    return this._c[key]=cv;
  },
  raw(rows,s=2,ov){                        // sprite KHÔNG đối xứng (vẽ nguyên hình)
    const key='raw'+rows.join('|')+s+(ov?JSON.stringify(ov):'');if(this._c[key])return this._c[key];
    const pal=ov?Object.assign({},PAL,ov):PAL,cv=document.createElement('canvas');
    cv.width=rows[0].length*s;cv.height=rows.length*s;const g=cv.getContext('2d');
    rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch!=='.'){g.fillStyle=pal[ch];g.fillRect(x*s,y*s,s,s)}}));
    return this._c[key]=cv;
  },
  emojiURL(e,n=16){const cv=document.createElement('canvas');cv.width=cv.height=n;const g=cv.getContext('2d');
    g.font=(n-3)+'px serif';g.textAlign='center';g.textBaseline='middle';g.fillText(e,n/2,n/2+1);return cv.toDataURL()}
};
const SPR={
  cat:['kk....','kok...','kookkk','kooooo','kooeoo','koooop','kooooo','.koooo','.koooo','.kooow','.kkooo','..kkkk'].map(r=>r.replace('e','k')),
  slime:['......','......','......','...kkk','..kggg','.kgggg','.kgwkg','kggggg','kggggg','kggggg','kggggg','kkkkkk'],
  coin:['..kk','.kyy','kyYy','kyYy','kyYy','kyYy','.kyy','..kk'],
  heart:['.rr.','rrrr','rrrr','.rrr','..rr','...r'],
  bomb:['....yy','.....s','..kkkk','.kkkkk','kkkkkk','kkwwkk','kkkkkk','kkkkkk','kkkkkk','.kkkkk','..kkkk','......'],
  basket:['BBBBBBBB','bBbBbBbB','bbbbbbbb','BbBbBbBb','.bbbbbbb','..bbbbbb'],
  wand:['......y.','.....yyy','......y.','.....b..','....b...','...b....','..b.....','.b......'],
  orb:['..cc..','.cwwc.','cwwwwc','cwwwwc','.cwwc.','..cc..'],
  fire:['..oo..','.oyyo.','oyyyyo','oyyyyo','.oyyo.','..oo..'],
  boss:['kk......','kbk.....','kbbkkkkk','kbbbbbbb','kbbyybbb','kbbbbbbb','kbbbkkkk','kbbboooo','.kbbbbbb','kkbbobbb','kbbboooo','kbbbbbbb','kbbbbbbb','.kbbkkkk','.kbbk...','.kkkk...'],
  // hộp quà: L = nắp, D = thân, R = ruy băng
  gift:['..kk..','.kRRkk','kkkkkk','kLLLLR','kLLLLR','kkkkkk','.kDDDR','.kDDDR','.kDDDR','.kDDDR','.kDDDR','.kkkkk']
};
const GV=[{L:'#ff9ec8',D:'#ff6fa5',R:'#ffffff'},{L:'#9ad8ff',D:'#4fb8e8',R:'#ffffff'},{L:'#d6c2ff',D:'#9b7bff',R:'#ffe14d'},{L:'#ffe28a',D:'#ffc83d',R:'#ff3b5c'},{L:'#b8f0c0',D:'#5cd65c',R:'#ffffff'}];
