import { Side, Piece } from "./types4game";
import { PieceStruct } from "./pieceStruct";

// 윤형이가 p(어쩌고) 너무 더럽다고 해서 함수 만듦
type shortSide = "w" | "b";
type shortPiece = "k" | "q" | "b" | "n" | "r" | "x" | "p";

function p(shortSide: shortSide, shortPiece: shortPiece, vert: number, hori: number) {
  return new PieceStruct(
    parseInt(Object.keys(Side)[Array.from("wb").indexOf(shortSide)]),
    parseInt(Object.keys(Piece)[Array.from("kqbnrxp").indexOf(shortPiece)]),
    {vert, hori}
  );
}

export { p };