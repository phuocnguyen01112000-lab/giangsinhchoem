// Dữ liệu dùng chung cho mọi trang (localStorage)
const Store={
  key:'clawSave3',
  def(){return {coins:10,items:{},stock:{},paid:false,cur:0}},
  load(){try{return Object.assign(this.def(),JSON.parse(localStorage.getItem(this.key)))}catch(e){return this.def()}},
  save(s){try{localStorage.setItem(this.key,JSON.stringify(s))}catch(e){}},
  update(fn){const s=this.load();fn(s);this.save(s);return s},
  addCoins(n){return this.update(s=>{s.coins+=n}).coins}
};
