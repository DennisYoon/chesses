import { Location, byString } from "./types4game";
import { PieceStruct } from "./pieceStruct";

export function showPiecesFN(pieces: PieceStruct[], boardSize: number, possibleLocations: Location[] = []) {
  for (let piece of pieces) {
    const ele = document
      .getElementById(byString(piece.location))
      ?.querySelector(".text")!;
    ele.classList.remove("whitePiece", "blackPiece");
    ele.classList.add(["whitePiece", "blackPiece"][piece.side]);
    ele.textContent = ["왕", "여왕", "비숍", "말", "룩", "폰"][piece.piece];
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