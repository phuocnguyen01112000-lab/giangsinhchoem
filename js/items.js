// 3 máy x 12 vật phẩm = 36. Ảnh: assets/<id>.png (chưa có ảnh thì dùng emoji).
// Cờ cuối: 's' = vật phẩm đặc biệt (trái tim cầu vồng), 'f' = khung polaroid (tự dán ảnh vào assets/my-photo.png).
const MACHINES=[
 {name:'Máy 1 · Yêu Thương',title:'YÊU THƯƠNG',c:'#ff7eb6',d:'#d9467f',bg:['#ffe9f3','#ffdcec','#ffcfe5','#ffc2dd']},
 {name:'Máy 2 · Kỷ Niệm',   title:'KỶ NIỆM',   c:'#4fb8e8',d:'#2a86b8',bg:['#e3f7ff','#cdeffc','#b9e9f9','#a4e0f5']},
 {name:'Máy 3 · Kho Báu',   title:'KHO BÁU',   c:'#9b7bff',d:'#6a4bd1',bg:['#eee9ff','#e0d9ff','#d3caff','#c6bbff']}
];
const RAW=[
 [['chick','Gà Con','🐥','"chíp chíp, gà con muốn gửi lời chúc đến cho Ngọc Maii, mong rằng ngày nào của Maii cũng luôn thật vui vẻ"'],
  ['bear','Gấu Bông','🧸','"Gấu bông xin phép thay người đang không thể ở cạnh cậu ôm cậu thật nhìu lần và sẽ ở đây để cậu biết sẽ luôn có người đang nghĩ về cậu đấy"'],
  ['bunny','Thỏ Tai Hồng','🐰','"Thỏ tai hồng thật đáng yêu nhưng thế nào thì cũng chẳng thể so được với vẻ đáng yêu của Ngọc Maii. Vì thế nên cậu hãy tự tin lên nhé, không chi tớ mà còn rất nhìu người xung quanh luôn thấy cậu thật xinh đẹp và đáng yêu đó""Thỏ tai hồng thật đáng yêu nhưng thế nào thì cũng chẳng thể so được với vẻ đáng yêu của Ngọc Maii. Vì thế nên cậu hãy tự tin lên nhé, không chi tớ mà còn rất nhìu người xung quanh luôn thấy cậu thật xinh đẹp và đáng yêu đó"'],
  ['pillow','Gối Bông Trái Tim','💗','"Chúc mừng bạn đã trúng một trái tim đầy tình yêu mà người ấy muốn dành đến cho Ngọc Maii đó, mong rằng Maii luôn hạnh phúc ạ""Chúc mừng bạn đã trúng một trái tim đầy tình yêu mà người ấy muốn dành đến cho Ngọc Maii đó, mong rằng Maii luôn hạnh phúc ạ"'],
  ['strawberry','Dâu Tây','🍓','" quả dâu nhỏ này dành cho cô gái ngọt ngào nhất trên đời của tớ, chính là Ngọc Maii đó" quả cam nhỏ này dành cho cô gái ngọt ngào nhất trên đời của tớ, chính là Ngọc Maii đó"'],
  ['whale','Thú Bông Cá Voi','🐳','"Người ta bảo cá voi tượng trưng cho tình yêu dài lâu ó, tớ mong rằng tớ cũng sẽ được bên cạnh Maii lâu thật lâu ạ"'],
  ['cat','Thú Bông Mèo','🐱','"Meo meo, mèo cam thấy nhớ Maii nhìu"'],
  ['butterfly','Bướm','🦋','"Chú bươm bướm lấp lánh đến mấy thì cũng không thể lấp lánh như chính Maii trong mắt của tớ"'],
  ['star','Ngôi Sao','⭐','"Ngôi sao này sẽ là lời cầu chúc cho Maiii thật nhiều điều may mắn nhé"'],
  ['choco','Hộp Sô Cô La Trái Tim','🍫','"Hộp socola cho sự ngọt ngào và đáng yêu của em nè"'],
  ['hugbear','Gấu Bông Ôm Tim','🐻','"Chiếc gấu bông này mang theo mụt tình yêu siêu to đến cho em đó"'],
  ['rainbow1','Trái Tim Cầu Vồng','🌈','items này là items đặc biệt nhó','s']],
 [['polaroid','Ảnh Polaroid','🖼️','"Dù cho mãi về sau, đây chắc  chắn là ngày tuyệt nhất trong đời anh đó, ngày mà anh gặp em, ngày mình được bên nhau ạ"  ','f'],
  ['boba','Ly Trà Sữa','🧋','"Tớ đã cùng Maii bước đến thật nhiều quán trà sữa, cũng đã thử thật nhiều loại trà sữa cùng nhau. Tớ mong rằng mình sẽ còn cùng nhau uống them nhiều món khác nữa, và được khám phá thật nhìu quán nước cùng nhau "'],
  ['movie','Vé Xem Phim','🎟️','"Tớ muốn cùng Maii đi xem một bộ phim, không chi một, mà là thật nhiều những bộ phim cùng nhau nữa, bên cạnh Maii thì phim nào cũng đáng xem ha"'],
  ['flower','Bông Hoa','🌸','"Một bông hoa nhỏ, dành cho một bông hoa xinh đẹp nhất"'],
  ['tape','Băng Nhạc','📼','"P.S I love you"'],
  ['camera','Máy Ảnh','📷','"Thật tệ vì khả năng chụp ảnh của tớ thật kém, nhưng dẫu vậy tớ vẫn muốn được cùng em lưu lại thật nhiều kỉ niệm của đôi ta"'],
  ['oldletter','Lá Thư Cũ','💌','"Muốn viết cho Maii thêm nhiều, thật nhiều lá thư nữa đó, vì tớ nhớ em, nhớ em rất nhiều luôn"'],
  ['bracelet','Vòng Tay','📿','"Tớ vẫn vô cùng áy náy vì chiếc vòng tay đã đứt kia, vẫn mong có thể mua cho em một chiếc vòng tay mới"'],
  ['musicbox','Hộp Nhạc','🎶','"Liệu Maii còn nhớ bài hát mà tớ thích không nhỉ, mà miễn là bài hát mà em thích Nghe thì chắc chắn tớ cũng thích Nghe mà thôi"'],
  ['kitty','Tượng Hello Kitty','🎀','"Hello kitty cute mún bảo rằng hôm nay Maii cũm xinh lắm nhé"'],
  ['necklace','Dây Chuyền Trái Tim','💝','"Tớ hi vọng Maii vẫn thích chiếc vòng cổ mà tớ đã tặng, hihi, dù tớ hong thể bên cạnh, nhưng tớ thật sự vui khi Maii vẫn luôn giữ chiếc vòng cổ đó bên mình"'],
  ['rainbow2','Trái Tim Cầu Vồng (2)','🌈','Này là items đặc biệt thứ hai em nhó','s']],
 [['moon','Mặt Trăng','🌙','"Mặt trăng luôn dõi theo những nổ lực của em và mong được nhìn em đặt được điều em muốn hơn bất kì ai"'],
  ['diamond','Kim Cương Xanh','💎','"Có thê đá quý là thứ mà nhiều người coi là giá trị nhất, thế thì với tớ, em chắc chắn là viên đá quý đẹp và duy nhất của tớ mà hoi"'],
  ['house','Mô Hình Nhà Nhỏ','🏠','"Liệu sau này mình sẽ ở trong ngôi nhà như nào nhỉ, chỉ cần cùng em, đấy chắc chắn sẽ là tổ ấm tuyệt vời của hai ta. Nhưng mà tớ cũm sẽ hong để em chịu thiệt đou, nên sẽ phải là một ngôi nhà thật đẹp đó"'],
  ['train','Vé Tàu','🚆','"Tụi mình vẫn chưa đi metro cùng nhau nè, tớ cũng chưa đi bao giờ lun, vẫn là mong đợi đến khi được cùng em hẹn hò trên metro nhỉ ""Tụi mình vẫn chưa đi metro cùng nhau nè, tớ cũng chưa đi bao giờ lun, vẫn là mong đợi đến khi được cùng em hẹn hò trên metro nhỉ"'],
  ['cake','Bánh Kem','🎂','"Chiếc bánh kem thật xinh dành cho cô gái của tớ nhé"'],
  ['key','Chìa Khóa','🔑','"Chiếc chìa khóa này sẽ dẫn tới một kho báu siêu toa đóa"'],
  ['map','Bản Đồ Kho Báu','🗺️','"Trong lúc tìm kiếm kho báu, tớ đã tìm thấy em, kho báu to lớn nhất của tớ"'],
  ['ring','Nhẫn Bạc','💍','"Đến giờ tớ vẫn tiếc đôi nhẫn của chúng mình nhỉ, hong phải vì tiền mà là vì đó là món đồ đôi của tụi mình mà"'],
  ['sweater','Áo Ấm','🧥','"Mong rằng em luôn chú ý giữ ấm cơ thể trong mùa giáng sinh siêu lạnh này nhé"'],
  ['candy','Kẹo','🍬','"Chiếc kẹo ngọt ngào như em vậy, nhớ ăn đầy đủ đừng để đói nhé"'],
  ['lovebook','Quyển Sổ Tình Yêu','📔','"Quyển sổ chứa đựng chuyện tình của đôi mình nè, một quyển sổ chứa đựng thật nhiều những hạnh phúc ạ"'],
  ['rainbow3','Trái Tim Cầu Vồng (3)','🌈','"items đặc biệc cuối cùng, giờ đây cậu đã có thể bước vào căn phòng bí mật của mê cungg','s']],
  ];
const ITEMS=RAW.flatMap((m,k)=>m.map(([id,name,emoji,note,f])=>({id,name,emoji,note,m:k,img:'assets/'+id+'.png',sp:f==='s',frame:f==='f'})));
const byId=id=>ITEMS.find(i=>i.id===id);
const giftOv=id=>GV[Math.max(0,ITEMS.findIndex(i=>i.id===id))%GV.length];
const icon=it=>it.frame
  ?`<div class="pol"><img src="assets/my-photo.png" alt="" onerror="if(!this.dataset.t){this.dataset.t=1;this.src='assets/my-photo.jpg'}else{this.outerHTML='<span class=ph>DÁN ẢNH</span>'}"></div>`
  :pixelIcon(it);