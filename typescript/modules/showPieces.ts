import { Location, byString, Piece, Side } from "./types4game";
import { PieceStruct } from "./pieceStruct";

export function showPiecesFN(pieces: PieceStruct[], boardSize: number, possibleLocations: Location[] = []) {
  for (let piece of pieces) {
    const ele = document
      .getElementById(byString(piece.location))
      ?.querySelector<HTMLElement>(".text")!;

    ele.classList.remove("whitePiece", "blackPiece");
    ele.classList.remove("whiteNighQueen", "blackNighQueen");
    ele.style.backgroundSize = "0 0";

    ele.classList.add(["whitePiece", "blackPiece"][piece.side]);
    if (piece.piece === Piece.NighQueen) {
      if (piece.side === Side.White) {
        ele.classList.add("whiteNighQueen");
      } else {
        ele.classList.add("blackNighQueen");
      }
      ele.style.backgroundSize = "100% 100%";
    } else {
      if (piece.piece === Piece.Pawn) {
        ele.style.backgroundPosition = `100% ${piece.side * 100}%`
      } else {
        ele.style.backgroundPosition = `${piece.piece * 20}% ${piece.side * 100}%`;
      }
      ele.style.backgroundSize = "600% 200%";
    }
  }

  for (let i = 11; i <= boardSize * 10 + 1; i += 10) {
    const ele = document
      .getElementById(i.toString())
      ?.querySelector(".text")!;
    ele.innerHTML ||= "&nbsp;";
  }

  for (let possibleLocation of possibleLocations) {
    const ele = document
      .getElementById(byString(possibleLocation))
      ?.querySelector(".touch");
    ele?.classList.remove("hideEle", "showEle");
    ele?.classList.add("showEle");
  }
}

export function initBoard(boardSize: number) {
  for (let vert = 1; vert <= boardSize; vert++) {
    for (let hori = 1; hori <= boardSize; hori++) {
      const eleTouch = document
        .getElementById(byString({vert, hori}))
        ?.querySelector(".touch");
      eleTouch?.classList.remove("hideEle", "showEle");
      eleTouch?.classList.add("hideEle");

      const eleText = document
        .getElementById(byString({vert, hori}))
        ?.querySelector<HTMLElement>(".text")!;
      eleText.style.backgroundSize = "0 0";
    }
  }
}