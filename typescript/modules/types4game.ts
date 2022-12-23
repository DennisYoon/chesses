enum Piece {
  King,
  Queen,
  Bishop,
  Night,
  Rook,
  Pawn
}

enum Side {
  White,
  Black
}

interface Location {
  vert: number;
  hori: number;
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

export { Piece, Side, Location, byString, Situation, Mode };