enum Piece {
  King,
  Queen,
  Bishop,
  Night,
  Rook,
  NighQueen,
  Pawn,
  null = -1
}

enum Side {
  White,
  Black,
  null = -1
}

interface Location {
  vert: number; // 세로
  hori: number; // 가로
}

function byString(loc: Location) {
  return Object.values(loc).join("");
}

interface Situation {
  turn: Side;
  initLocation: Location;
  finalLocation: Location;
}

enum Mode {
  classic,
  customizable,
  tenXten,
  null = -1
}

interface Eaten {
  white: Piece[],
  black: Piece[]
}

export { Piece, Side, Location, byString, Situation, Mode, Eaten };