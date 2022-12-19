enum Pieces {
  King,
  Queen,
  Bishop,
  Night,
  Rook,
  Pawn
}

enum Sides {
  Black,
  White
}

interface Location {
  vert: number;
  hori: number;
}

function byString(loc: Location) {
  return Object.values(loc).join("");
}

export { Pieces, Sides, Location, byString };