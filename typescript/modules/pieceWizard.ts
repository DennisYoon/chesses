import { Sides, Pieces } from "./types4Board";
import { Piece } from "./setBoard";

// 윤형이가 p(어쩌고) 너무 더럽다고 해서 함수 만듦
type shortSide = "b" | "w";
type shortPiece = "k" | "q" | "b" | "n" | "r" | "p";

function p(shortSide: shortSide, shortPiece: shortPiece, vert: number, hori: number) {
  let side: Sides;
  let piece: Pieces;

  switch (shortSide) {
    case "w": side = Sides.White; break;
    case "b": side = Sides.Black; break;
  }

  switch (shortPiece) {
    case "k": piece = Pieces.King; break;
    case "q": piece = Pieces.Queen; break;
    case "b": piece = Pieces.Bishop; break;
    case "n": piece = Pieces.Night; break;
    case "r": piece = Pieces.Rook; break;
    case "p": piece = Pieces.Pawn; break;
  }

  return new Piece(side, piece, {vert, hori});
}

export { p };