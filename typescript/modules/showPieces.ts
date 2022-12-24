import { Location, byString } from "./types4game";
import { PieceStruct } from "./pieceStruct";

export function showPiecesFN(pieces: PieceStruct[], boardSize: number, possibleLocations: Location[] = []) {
  for (let piece of pieces) {
    const ele = document.getElementById(byString(piece.location))!;
    ele.classList.remove("whitePiece", "blackPiece");
    ele.classList.add(["whitePiece", "blackPiece"][piece.side]);
    ele.textContent = ["왕", "여왕", "비숍", "말", "룩", "폰"][piece.piece];
  }

  for (let i = 11; i <= boardSize * 10 + 1; i += 10) {
    const ele = document.getElementById(i.toString())!;
    ele.innerHTML ||= "&nbsp;";
  }

  for (let possibleLocation of possibleLocations) {
    const ele = document.getElementById(byString(possibleLocation));
    ele?.classList.remove("whiteBoard", "blackBoard");
    ele?.classList.add(
      ["chosenWhite", "chosenBlack"]
          [
            Array.from(ele.id)
              .map(v => parseInt(v))
              .reduce((a, b) => a + b, 0) % 2
          ]
    );
  }
}