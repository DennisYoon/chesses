enum Pieces {
  King,
  Queen,
  Bishop,
  Night,
  Rook,
  Pawn
}

enum Sides {
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
  turn: Sides;
  initLocation: Location;
  finalLocation: Location;
}

export { Pieces, Sides, Location, byString, Situation };