import { blackSide, whiteSide } from "./dom";
import { getPieceWhoseLocationIs } from "./movableLocations";
import { PieceStruct } from "./pieceStruct";
import { Piece, Side, Location } from "./types4game";
import { waitUntil } from "./waitUntil";

export async function setCustomizableChess() {
  let chosen: Piece;
  let counter: number[];
  let customBoard: PieceStruct[] = [];
  
  function listner1(ele: string, turn: Side) {
    return () => {
      chosen = "kqrnbxp".indexOf(ele) as Piece;
      changeColorOf(chosen, turn);
    };
  }

  function listner2(ele: HTMLElement, turn: Side, loc: Location) {
    return () => {
      if (counter[chosen] > 0 && getPieceWhoseLocationIs(loc.vert, loc.hori, customBoard).piece === Piece.null) {
        ele.textContent = ["킹", "퀸", "룩", "말", "비숍", "", "폰"][chosen];
        customBoard.push(new PieceStruct(turn, chosen, loc));
        counter[chosen] += -1;
        ele.style.color = turn ? "black" : "lightgray";
        Array.from("kqrnbxp").forEach((s, i) => {
          if (s === "x") return;
          if (turn) {
            q(`#blackSide .${s}`).textContent = ["킹", "퀸", "룩", "말", "비숍", "", "폰"][i] + "x" + counter[i];
          } else {
            q(`#whiteSide .${s}`).textContent = ["킹", "퀸", "룩", "말", "비숍", "", "폰"][i] + "x" + counter[i];
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

  for (let s of "kqrnbp") {
    q(`#whiteSide .${s}`).addEventListener("click", listner1(s, Side.White));
  }

  for (let vert = 5; vert <= 8; vert++) {
    for (let hori = 1; hori <= 8; hori++) {
      qid(`${vert}${hori}`).addEventListener("click", listner2(qid(`${vert}${hori}`), Side.White, {vert, hori}));
    }
  }
    

  // 초기화
  await waitUntil(() => counter.every(v => v === 0));
  for (let s of "kqrnbp") {
    q(`#whiteSide .${s}`).removeEventListener("click", listner1(s, Side.White));
  }
  for (let vert = 5; vert <= 8; vert++) {
    for (let hori = 1; hori <= 8; hori++) {
      qid(`${vert}${hori}`).removeEventListener("click", listner2(qid(`${vert}${hori}`), Side.White, {vert, hori}));
    }
  }


  // black turn
  chosen = Piece.Pawn;
  counter = [1, 1, 2, 2, 2, 0, 8]
  blackSide!.style.visibility = "visible";
  whiteSide!.style.visibility = "hidden";
  changeColorOf(chosen, Side.Black);

  for (let s of "kqrnbp") {
    q(`#blackSide .${s}`).addEventListener("click", listner1(s, Side.Black));
  }

  for (let vert = 1; vert <= 4; vert++) {
    for (let hori = 1; hori <= 8; hori++) {
      qid(`${vert}${hori}`).addEventListener("click", listner2(qid(`${vert}${hori}`), Side.Black, {vert, hori}));
    }
  }
    

  // 초기화
  await waitUntil(() => counter.every(v => v === 0));
  for (let s of "kqrnbp") {
    q(`#blackSide .${s}`).removeEventListener("click", listner1(s, Side.Black));
  }
  for (let vert = 1; vert <= 4; vert++) {
    for (let hori = 1; hori <= 8; hori++) {
      qid(`${vert}${hori}`).removeEventListener("click", listner2(qid(`${vert}${hori}`), Side.Black, {vert, hori}));
    }
  }

  return customBoard;
}

function q(s: string) {
  return document.querySelector<HTMLElement>(s)!;
}

function qid(s: string) {
  return document.getElementById(s)!;
}

function changeColorOf(chosen: Piece, turn: Side) {
  for (let s of "kqrnbp") {
    q(`#${turn ? "black" : "white"}Side .${s}`).style.backgroundColor = "gray";
  }
  q(`#${turn ? "black" : "white"}Side .${"kqrnbxp"[chosen]}`).style.setProperty("background-color", turn ?"white" : "black", "important");
}
