enum Wares {
  King,
  Queen,
  Bishop,
  Night,
  Rook,
  Pone
}

enum Sides {
  Black,
  White
}

interface Location {
  vert: number;
  hori: number;
}

export { Wares, Sides, Location };