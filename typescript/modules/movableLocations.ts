import { Side, Piece, Location, byString } from "./types4game";
import { PieceStruct } from "./pieceStruct";

export function getPieceWhoseLocationIs(locationX: number, locationY: number, board: PieceStruct[]) {
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

function king(piece: PieceStruct, board: PieceStruct[], bs: number, cc = true) {
  let movableLocations: Location[] = [
    { vert: piece.vert + 1, hori: piece.hori + 1 },
    { vert: piece.vert + 1, hori: piece.hori - 1 },
    { vert: piece.vert - 1, hori: piece.hori + 1 },
    { vert: piece.vert - 1, hori: piece.hori - 1 },

    { vert: piece.vert + 1, hori: piece.hori },
    { vert: piece.vert - 1, hori: piece.hori },
    { vert: piece.vert, hori: piece.hori + 1 },
    { vert: piece.vert, hori: piece.hori - 1 }
  ]
  .filter(loc => Object.values(loc).every(v => v >= 1 && v <= bs))
  .filter(loc => {
    const presentPiece = getPieceWhoseLocationIs(loc.vert, loc.hori, board);
    if (presentPiece.side === Side.null && !cc) return false;
    return presentPiece.side !== piece.side;
  });

  if (piece.haveMoved === false) {
    if (
      Array(bs / 2 - 2).fill(0).map((_, i) => i + 1).every(v => getPieceWhoseLocationIs(piece.vert, piece.hori + v, board).piece === -1)
      &&
      getPieceWhoseLocationIs(piece.vert, bs, board).haveMoved === false
    ) {
      movableLocations.push({
        vert: piece.vert,
        hori: piece.hori + 2
      });
    }
  
    if (
      Array(bs / 2 - 1).fill(0).map((_, i) => i + 1).every(v => getPieceWhoseLocationIs(piece.vert, piece.hori - v, board).piece === -1)
      &&
      getPieceWhoseLocationIs(piece.vert, 1, board).haveMoved === false
      ) {
      movableLocations.push({
        vert: piece.vert,
        hori: piece.hori - 2
      });
    }
  }
  
  return movableLocations;
}

function queen(piece: PieceStruct, board: PieceStruct[], bs: number, cc = true) {
  const movableLocations = [
    ...bishop(piece, board, bs, cc),
    ...rook(piece, board, bs, cc)
  ];

  return movableLocations;
}

function bishop(piece: PieceStruct, board: PieceStruct[], bs: number, cc = true) {
  let movableLocations: Location[] = [];

  function repeatedThings(vert: number, hori: number): boolean {
    if ([vert, hori].some(v => v <= 0 || v > bs)) {
      return true;
    }
    const presentPiece = getPieceWhoseLocationIs(vert, hori, board);
    if (presentPiece.piece !== Piece.null) {
      if (presentPiece.side === piece.side) {
        return true;
      } else {
        movableLocations.push({vert, hori});
        return true;
      }
    } else {
      if (cc)
        movableLocations.push({vert, hori});
    }
    return false;
  }

  for (let [vert, hori] = [piece.vert, piece.hori];;) {
    vert++; hori++;
    if (repeatedThings(vert, hori)) break;

  }

  for (let [vert, hori] = [piece.vert, piece.hori];;) {
    vert++; hori--;
    if (repeatedThings(vert, hori)) break;
  }

  for (let [vert, hori] = [piece.vert, piece.hori];;) {
    vert--; hori++;
    if (repeatedThings(vert, hori)) break;
  }

  for (let [vert, hori] = [piece.vert, piece.hori];;) {
    vert--; hori--;
    if (repeatedThings(vert, hori)) break;
  }

  movableLocations = movableLocations.filter(loc => {
    const presentPiece = getPieceWhoseLocationIs(loc.vert, loc.hori, board);
    return presentPiece.side !== piece.side;
  });

  return movableLocations;
}

function night(piece: PieceStruct, board: PieceStruct[], bs: number, cc = true) {
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
    if (presentPiece.side === Side.null && !cc) return false;
    return presentPiece.side !== piece.side;
  });

  return movableLocations;
}

function rook(piece: PieceStruct, board: PieceStruct[], bs: number, cc = true) {
  const movableLocations: Location[] = [];

  function repeatedThings(vert: number, hori: number): boolean {
    const presentPiece = getPieceWhoseLocationIs(vert, hori, board);
    if (presentPiece.side !== Side.null) {
      if (presentPiece.side !== piece.side) {  
        movableLocations.push({vert, hori});
        return true;
      } else {
        return true;
      }
    } else {
      if (cc)
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
  const movableLocations: Location[] = [];
  const possibleMove = !piece.haveMoved ? 2 : 1;

  for (let vert = piece.vert - 1; vert >= 1 && vert >= piece.vert - possibleMove; vert--) {
    const presentPiece = getPieceWhoseLocationIs(vert, piece.hori, board);
    if (presentPiece.piece !== Piece.null) {
      break;
    }
    movableLocations.push({vert, hori: piece.hori});
  }

  var presentPiece = getPieceWhoseLocationIs(piece.vert - 1, piece.hori + 1, board);
  if (presentPiece.side !== piece.side && presentPiece.side !== Side.null) {
    movableLocations.push({ vert: piece.vert - 1, hori: piece.hori + 1});
  }

  var presentPiece = getPieceWhoseLocationIs(piece.vert - 1, piece.hori - 1, board);
  if (presentPiece.side !== piece.side && presentPiece.side !== Side.null) {
    movableLocations.push({ vert: piece.vert - 1, hori: piece.hori - 1});
  }

  if (piece.vert === 4 && bs === 8) {
    var presentPiece = getPieceWhoseLocationIs(piece.vert, piece.hori - 1, board);
    if (presentPiece.side !== piece.side && presentPiece.piece === Piece.Pawn && presentPiece.twoTimesRightBefore) {
      movableLocations.push({ vert: piece.vert - 1, hori: piece.hori - 1 });
    }

    var presentPiece = getPieceWhoseLocationIs(piece.vert, piece.hori + 1, board);
    if (presentPiece.side !== piece.side && presentPiece.piece === Piece.Pawn && presentPiece.twoTimesRightBefore) {
      movableLocations.push({ vert: piece.vert - 1, hori: piece.hori + 1 });
    }
  }

  return movableLocations;
}

function bPawn(piece: PieceStruct, board: PieceStruct[], bs: number) {
  const movableLocations: Location[] = [];
  const possibleMove = !piece.haveMoved ? 2 : 1;

  for (let vert = piece.vert + 1; vert <= bs && vert <= piece.vert + possibleMove; vert++) {
    const presentPiece = getPieceWhoseLocationIs(vert, piece.hori, board);
    if (presentPiece.piece !== Piece.null) {
      break;
    }
    movableLocations.push({vert, hori: piece.hori});
  }

  var presentPiece = getPieceWhoseLocationIs(piece.vert + 1, piece.hori + 1, board);
  if (presentPiece.side !== piece.side && presentPiece.side !== Side.null) {
    movableLocations.push({ vert: piece.vert + 1, hori: piece.hori + 1});
  }

  var presentPiece = getPieceWhoseLocationIs(piece.vert + 1, piece.hori - 1, board);
  if (presentPiece.side !== piece.side && presentPiece.side !== Side.null) {
    movableLocations.push({ vert: piece.vert + 1, hori: piece.hori - 1});
  }

  if (piece.vert === 5 && bs === 8) {
    var presentPiece = getPieceWhoseLocationIs(piece.vert, piece.hori - 1, board);
    if (presentPiece.side !== piece.side && presentPiece.piece === Piece.Pawn && presentPiece.twoTimesRightBefore) {
      movableLocations.push({ vert: piece.vert + 1, hori: piece.hori - 1 });
    }

    var presentPiece = getPieceWhoseLocationIs(piece.vert, piece.hori + 1, board);
    if (presentPiece.side !== piece.side && presentPiece.piece === Piece.Pawn && presentPiece.twoTimesRightBefore) {
      movableLocations.push({ vert: piece.vert + 1, hori: piece.hori + 1 });
    }
  }

  return movableLocations;
}

function nighQueen(piece: PieceStruct, board: PieceStruct[], bs: number, cc = true) {
  let movableLocations: Location[] = [
    ...bishop(piece, board, bs, cc),
    ...rook(piece, board, bs, cc),
    ...night(piece, board, bs, cc)
  ];

  movableLocations = movableLocations.filter((ele, idx) => movableLocations.indexOf(ele) === idx);

  return movableLocations;
}

export const ml = { king, queen, bishop, night, rook, nighQueen, wPawn, bPawn };