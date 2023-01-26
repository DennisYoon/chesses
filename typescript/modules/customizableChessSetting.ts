import { blackSide, whiteSide } from "./dom";
import { getPieceWhoseLocationIs } from "./movableLocations";
import { PieceStruct } from "./pieceStruct";
import { showPiecesFN } from "./showPieces";
import { Piece, Side, Location } from "./types4game";
import { waitUntil } from "./waitUntil";

export async function setCustomizableChess() {
  let chosen: Piece;
  let counter: number[];
  let customBoard: PieceStruct[] = [];
  
  function listner1(ele: string, turn: Side) {
    return () => {
      chosen = "kqbnrxp".indexOf(ele) as Piece;
      changeColorOf(chosen, turn);
    };
  }

  function listner2(turn: Side, loc: Location) {
    return () => {
      if (counter[chosen] > 0 && getPieceWhoseLocationIs(loc.vert, loc.hori, customBoard).piece === Piece.null) {
        customBoard.push(new PieceStruct(turn, chosen, loc));
        showPiecesFN(customBoard, 8, []);
        counter[chosen] += -1;
        Array.from("kqbnrxp").forEach((s, i) => {
          if (s === "x") return;
          if (turn) {
            q(`#blackSide .${s}`).textContent = ["킹", "퀸", "비숍", "말", "룩", "", "폰"][i] + "x" + counter[i];
          } else {
            q(`#whiteSide .${s}`).textContent = ["킹", "퀸", "비숍", "말", "룩", "", "폰"][i] + "x" + counter[i];
          }
        });
      }
    }
  }

  // white turn
  chosen = Piece.Pawn;
  counter = [1, 1, 2, 2, 2, 0, 8]
  blackSide!.style.visibility = "hidden";
  whiteSide!.style.visibility = "visible";
  changeColorOf(chosen, Side.White);

  for (let s of "kqbnrp") {
    q(`#whiteSide .${s}`).addEventListener("click", listner1(s, Side.White));
  }

  for (let vert = 5; vert <= 8; vert++) {
    for (let hori = 1; hori <= 8; hori++) {
      qid(`${vert}${hori}`).addEventListener("click", listner2(Side.White, {vert, hori}));
    }
  }
    

  // 초기화
  await waitUntil(() => counter.every(v => v === 0));
  for (let s of "kqbnrp") {
    const me = q(`#whiteSide .${s}`);
    me.replaceWith(me.cloneNode(true));
  }
  for (let vert = 5; vert <= 8; vert++) {
    for (let hori = 1; hori <= 8; hori++) {
      const me = qid(`${vert}${hori}`);
      me.replaceWith(me.cloneNode(true));
    }
  }


  // black turn
  chosen = Piece.Pawn;
  counter = [1, 1, 2, 2, 2, 0, 8];
  blackSide!.style.visibility = "visible";
  whiteSide!.style.visibility = "hidden";
  changeColorOf(chosen, Side.Black);

  for (let s of "kqbnrp") {
    q(`#blackSide .${s}`).addEventListener("click", listner1(s, Side.Black));
  }

  for (let vert = 1; vert <= 4; vert++) {
    for (let hori = 1; hori <= 8; hori++) {
      qid(`${vert}${hori}`).addEventListener("click", listner2(Side.Black, {vert, hori}));
    }
  }
    

  // 초기화
  await waitUntil(() => counter.every(v => v === 0));
  for (let s of "kqbnrp") {
    const me = q(`#blackSide .${s}`);
    me.replaceWith(me.cloneNode(true));
  }
  for (let vert = 1; vert <= 4; vert++) {
    for (let hori = 1; hori <= 8; hori++) {
      const me = qid(`${vert}${hori}`);
      me.replaceWith(me.cloneNode(true));
    }
  }

  whiteSide!.style.visibility = "visible";

  return customBoard;
}

function q(s: string) {
  return document.querySelector<HTMLElement>(s)!;
}

function qid(s: string) {
  return document.getElementById(s)!;
}

function changeColorOf(chosen: Piece, turn: Side) {
  for (let s of "kqbnrp") {
    q(`#${turn ? "black" : "white"}Side .${s}`).style.backgroundColor = "gray";
  }
  q(`#${turn ? "black" : "white"}Side .${"kqbnrxp"[chosen]}`).style.setProperty("background-color", turn ?"white" : "black", "important");
}
