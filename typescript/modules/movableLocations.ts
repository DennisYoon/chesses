import { Side, Piece, Location, byString } from "./types4game";
import { PieceStruct } from "./pieceStruct";

const foo: Location[] = [];

function getPieceWhoseLocationIs(locationX: number, locationY: number, board: PieceStruct[]) {
  const location: Location = {vert: locationX, hori: locationY};

  let index: number = -1;
  board.forEach((piece, i) => {
    if (byString(piece.location) === byString(location)) {
      index = i;
      return;
    }
  });
  if (index === -1) {
    return new PieceStruct(Side.null, Piece.null, {vert: 0, hori: 0});
  } else {
    return board[index];
  }
}

function king(piece: PieceStruct, board: PieceStruct[], bs: number) {
  return foo;
}

function queen(piece: PieceStruct, board: PieceStruct[], bs: number) {
  return foo;
}

function bishop(piece: PieceStruct, board: PieceStruct[], bs: number) {
  return foo;
}

function night(piece: PieceStruct, board: PieceStruct[], bs: number) {
  let movableLocations: Location[] = [
    { vert: piece.vert + 2, hori: piece.hori + 1 },
    { vert: piece.vert + 2, hori: piece.hori - 1 },
    { vert: piece.vert - 2, hori: piece.hori + 1 },
    { vert: piece.vert - 2, hori: piece.hori - 1 },

    { vert: piece.vert + 1, hori: piece.hori + 2 },
    { vert: piece.vert - 1, hori: piece.hori + 2 },
    { vert: piece.vert + 1, hori: piece.hori - 2 },
    { vert: piece.vert - 1, hori: piece.hori - 2 }
  ]
  .filter(loc => Object.values(loc).every(v => v >= 1 && v <= bs))
  .filter(loc => {
    const presentPiece = getPieceWhoseLocationIs(loc.vert, loc.hori, board);
    return presentPiece.side !== piece.side;
  });

  return movableLocations;
}

function rook(piece: PieceStruct, board: PieceStruct[], bs: number) {
  const movableLocations: Location[] = [];

  function repeatedThings(vert: number, hori: number): boolean {
    const presentPiece = getPieceWhoseLocationIs(vert, hori, board);
    if (presentPiece.side !== Side.null && presentPiece.piece !== Piece.null) {
      if (presentPiece.side !== piece.side) {  
        movableLocations.push({vert, hori});
        return true;
      } else {
        return true;
      }
    } else {
      movableLocations.push({vert, hori});
      return false;
    }
    
  }

  for (let vert = piece.vert + 1; vert <= bs; vert++) {
    if (repeatedThings(vert, piece.hori)) break;
  };

  for (let vert = piece.vert - 1; vert >= 1; vert--) {
    if (repeatedThings(vert, piece.hori)) break;
  }

  for (let hori = piece.hori + 1; hori <= bs; hori++) {
    if (repeatedThings(piece.vert, hori)) break;
  }

  for (let hori = piece.hori - 1; hori >= 1; hori--) {
    if (repeatedThings(piece.vert, hori)) break;
  }

  return movableLocations;
}

function wPawn(piece: PieceStruct, board: PieceStruct[], bs: number) {
  return foo;
}

function bPawn(piece: PieceStruct, board: PieceStruct[], bs: number) {
  foo;
}

export const ml = { king, queen, bishop, night, rook, wPawn, bPawn };