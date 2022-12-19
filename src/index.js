function createBoard(){var t=document.querySelector("table");for(let e=1;e<=8;e++){var r=document.createElement("tr");t.append(r);for(let t=1;t<=8;t++){var a=document.createElement("td");a.setAttribute("id",e.toString()+t.toString()),a.classList.add((e+t)%2?"blackBoard":"whiteBoard"),r.append(a)}}}
class Board{constructor(){this.board=[p("w","k",8,5),p("w","q",8,4),p("w","b",8,3),p("w","b",8,6),p("w","n",8,2),p("w","n",8,7),p("w","r",8,1),p("w","r",8,8),p("b","k",1,5),p("b","q",1,4),p("b","b",1,3),p("b","b",1,6),p("b","n",1,2),p("b","n",1,7),p("b","r",1,1),p("b","r",1,8)];for(let e=1;e<=8;e++)this.board.push(p("w","p",7,e)),this.board.push(p("b","p",2,e))}getMovableLocationsOf(e){return[]}static sameLocationOf(e,t){return e.vert===t.vert&&e.hori===t.hori}activateAllListener(){for(var e of this.board)e.activateListener();var t,i=[];for(let t=1;t<=8;t++)for(let e=1;e<=8;e++)i.push({vert:t,hori:e});for(t of i);}}class Piece{constructor(e,t,i){this.side=e,this.Piece=t,this.location=i}get vertLocation(){return this.location.vert}get horiLocation(){return this.location.hori}activateListener(){var e;null!=(e=document.getElementById(byString(this.location)))&&e.addEventListener("click",()=>{console.log("Piece pressed",byString(this.location))})}}function p(e,t,i,r){let s,o;switch(e){case"w":s=Sides.White;break;case"b":s=Sides.Black}switch(t){case"k":o=Pieces.King;break;case"q":o=Pieces.Queen;break;case"b":o=Pieces.Bishop;break;case"n":o=Pieces.Night;break;case"r":o=Pieces.Rook;break;case"p":o=Pieces.Pawn}return new Piece(s,o,{vert:i,hori:r})}
function showBoard(e,i=[]){var t,o,c=[Pieces.King,Pieces.Queen,Pieces.Bishop,Pieces.Night,Pieces.Rook,Pieces.Pawn],n=["왕","여왕","비숍","말","룩","폰"];for(t of e.board){var s=document.getElementById(byString(t.location));s.classList.remove("whitePiece","blackPiece"),s.classList.add(t.side===Sides.White?"whitePiece":"blackPiece"),s.textContent=n[c.indexOf(t.Piece)]}for(let e=11;e<=81;e+=10){var a=document.getElementById(e.toString());a.innerHTML||(a.innerHTML="&nbsp;")}for(o of i){var r=document.getElementById(byString(o));r.classList.remove("whiteBoard","blackBoard"),r.classList.add("movableLocation")}}
var Pieces,Sides;function byString(i){return Object.values(i).join("")}!function(i){i[i.King=0]="King",i[i.Queen=1]="Queen",i[i.Bishop=2]="Bishop",i[i.Night=3]="Night",i[i.Rook=4]="Rook",i[i.Pawn=5]="Pawn"}(Pieces=Pieces||{}),function(i){i[i.Black=0]="Black",i[i.White=1]="White"}(Sides=Sides||{});
class Game{constructor(){this.turn=Sides.White,this.situation=[],this.b=new Board,createBoard(),showBoard(this.b),this.b.activateAllListener()}changeTurn(){this.turn=this.turn===Sides.White?Sides.Black:Sides.White,showBoard(this.b)}addSituation(t){this.situation.push(t)}}const g=new Game;