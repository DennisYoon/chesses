import { Pieces, Sides, Location, byString } from "./types4Board";

export class Board {
  board = [
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

  constructor() {
    for (let hori = 1; hori <= 8; hori++) {
      this.board.push(p("w", "p", 7, hori));
      this.board.push(p("b", "p", 2, hori));
    }
  }

  getMovableLocationsOf(piece: Piece) {
    const possibleLocations: Location[] = [];
    /* ~~~ */
    return possibleLocations;
  }

  private static sameLocationOf(loc1: Location, loc2: Location) {
    if (loc1.vert === loc2.vert && loc1.hori === loc2.hori) {
      return true;
    }
    return false;
  }

  activateAllListener() {
    for (let Piece of this.board) {
      Piece.activateListener();
    }

    const allLocations: Location[] = [];
    for (let vert = 1; vert <= 8; vert++) {
      for (let hori = 1; hori <= 8; hori++) {
        allLocations.push({vert, hori});
      }
    }

    for (let oneLocation of allLocations) {
      /* ~~ */
    }
  }
}

class Piece {
  readonly side: Sides;
  Piece: Pieces;
  location: Location;

  constructor(side: Sides, Piece: Pieces, location: Location) {
    this.side = side;
    this.Piece = Piece;
    this.location = location;
  }

  get vertLocation() {
    return this.location.vert;
  }

  get horiLocation() {
    return this.location.hori;
  }

  activateListener() {
    document.getElementById(byString(this.location))?.addEventListener("click", () => {
      console.log("Piece pressed", byString(this.location));
    });
  }
}

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