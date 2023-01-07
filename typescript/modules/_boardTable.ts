import { PieceStruct } from "./pieceStruct";

export function showBoardTable(board: PieceStruct[], bs: number) {
  let table: string[][] = [];

  for (let i = 0; i < bs; i++) {
    table.push([]);
    for (let j = 0; j < bs; j++) {
      table[i].push("논");
    }
  }

  for (let piece of board) {
    table[piece.vert - 1][piece.hori - 1] = ["왕", "여왕", "비숍", "말", "룩", "폰"][piece.piece];
  }
  
  for (let line of table) {
    console.log(line);
  }
}