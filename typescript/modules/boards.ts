import { PieceStruct } from "./pieceStruct";
import { p /* Piece */ } from "./pieceWizard";

export function classic() {
  let board: PieceStruct[] = [
    p("w", "k", 8, 5),
    p("w", "q", 8, 4),
    p("w", "b", 8, 3),
    p("w", "b", 8, 6),
    p("w", "n", 8, 2),
    p("w", "n", 8, 7),
    p("w", "r", 8, 1),
    p("w", "r", 8, 8),
    
    p("b", "k", 1, 5),
    p("b", "q", 1, 4),
    p("b", "b", 1, 3),
    p("b", "b", 1, 6),
    p("b", "n", 1, 2),
    p("b", "n", 1, 7),
    p("b", "r", 1, 1),
    p("b", "r", 1, 8)
  ];
  
  for (let hori = 1; hori <= 8; hori++) {
    board.push(p("w", "p", 7, hori));
    board.push(p("b", "p", 2, hori));
  }

  return board;
}

export function tenXten() {
  let board: PieceStruct[] = [
    p("w", "k", 10, 6),
    p("w", "q", 10, 4),
    p("w", "q", 10, 7),
    p("w", "b", 10, 3),
    p("w", "b", 10, 8),
    p("w", "n", 10, 2),
    p("w", "n", 10, 9),
    p("w", "r", 10, 1),
    p("w", "r", 10, 10),
    p("w", "x", 10, 5),
    
    p("b", "k", 1, 6),
    p("b", "q", 1, 4),
    p("b", "q", 1, 7),
    p("b", "b", 1, 3),
    p("b", "b", 1, 8),
    p("b", "n", 1, 2),
    p("b", "n", 1, 9),
    p("b", "r", 1, 1),
    p("b", "r", 1, 10),
    p("b", "x", 1, 5)
  ];
  
  for (let hori = 1; hori <= 10; hori++) {
    board.push(p("w", "p", 9, hori));
    board.push(p("b", "p", 2, hori));
  }

  return board;
}