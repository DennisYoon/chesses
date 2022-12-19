import { Pieces, Sides, Location, byString } from "./types4Board";
import { Board } from "./setBoard";

export function showBoard(board: Board, possibleLocations: Location[] = []) {
  const PieceNames = [Pieces.King, Pieces.Queen, Pieces.Bishop, Pieces.Night, Pieces.Rook, Pieces.Pawn];
  const PieceNamesK = ["왕", "여왕", "비숍", "말", "룩", "폰"];

  for (let Piece of board.board) {
    const ele = document.getElementById(byString(Piece.location))!;
    ele.classList.remove("whitePiece", "blackPiece");
    ele.classList.add(Piece.side === Sides.White ? "whitePiece" : "blackPiece");
    ele.textContent = PieceNamesK[PieceNames.indexOf(Piece.Piece)];
  }

  for (let i = 11; i <= 81; i += 10) {
    const ele = document.getElementById(i.toString())!;
    ele.innerHTML ||= "&nbsp;";
  }

  for (let possibleLocation of possibleLocations) {
    const ele = document.getElementById(byString(possibleLocation))!;
    ele.classList.remove("whiteBoard", "blackBoard");
    ele.classList.add("movableLocation");
  }
}