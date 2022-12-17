import { Wares, Sides, Location } from "./types4Board";

export class Board {
  board = [
    new Ware(Sides.White, Wares.King, { vert: 8, hori: 5 }),
    new Ware(Sides.White, Wares.Queen, { vert: 8, hori: 4 }),
    new Ware(Sides.White, Wares.Bishop, { vert: 8, hori: 3 }),
    new Ware(Sides.White, Wares.Bishop, { vert: 8, hori: 6 }),
    new Ware(Sides.White, Wares.Night, { vert: 8, hori: 2 }),
    new Ware(Sides.White, Wares.Night, { vert: 8, hori: 7 }),
    new Ware(Sides.White, Wares.Rook, { vert: 8, hori: 1 }),
    new Ware(Sides.White, Wares.Rook, { vert: 8, hori: 8 }),
    new Ware(Sides.White, Wares.Pone, { vert: 7, hori: 1 }),
    new Ware(Sides.White, Wares.Pone, { vert: 7, hori: 2 }),
    new Ware(Sides.White, Wares.Pone, { vert: 7, hori: 3 }),
    new Ware(Sides.White, Wares.Pone, { vert: 7, hori: 4 }),
    new Ware(Sides.White, Wares.Pone, { vert: 7, hori: 5 }),
    new Ware(Sides.White, Wares.Pone, { vert: 7, hori: 6 }),
    new Ware(Sides.White, Wares.Pone, { vert: 7, hori: 7 }),
    new Ware(Sides.White, Wares.Pone, { vert: 7, hori: 8 }),
    
    new Ware(Sides.Black, Wares.King, { vert: 1, hori: 5 }),
    new Ware(Sides.Black, Wares.Queen, { vert: 1, hori: 4 }),
    new Ware(Sides.Black, Wares.Bishop, { vert: 1, hori: 3 }),
    new Ware(Sides.Black, Wares.Bishop, { vert: 1, hori: 6 }),
    new Ware(Sides.Black, Wares.Night, { vert: 1, hori: 2 }),
    new Ware(Sides.Black, Wares.Night, { vert: 1, hori: 7 }),
    new Ware(Sides.Black, Wares.Rook, { vert: 1, hori: 1 }),
    new Ware(Sides.Black, Wares.Rook, { vert: 1, hori: 8 }),
    new Ware(Sides.Black, Wares.Pone, { vert: 2, hori: 1 }),
    new Ware(Sides.Black, Wares.Pone, { vert: 2, hori: 2 }),
    new Ware(Sides.Black, Wares.Pone, { vert: 2, hori: 3 }),
    new Ware(Sides.Black, Wares.Pone, { vert: 2, hori: 4 }),
    new Ware(Sides.Black, Wares.Pone, { vert: 2, hori: 5 }),
    new Ware(Sides.Black, Wares.Pone, { vert: 2, hori: 6 }),
    new Ware(Sides.Black, Wares.Pone, { vert: 2, hori: 7 }),
    new Ware(Sides.Black, Wares.Pone, { vert: 2, hori: 8 }),

  ];


}

class Ware {
  side: Sides;
  ware: Wares;
  location: Location;

  constructor(side: Sides, ware: Wares, location: Location) {
    this.side = side;
    this.ware = ware;
    this.location = location;
  }
}