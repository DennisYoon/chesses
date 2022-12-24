import { Side, Piece, Location } from "./types4game";

export class PieceStruct {
  constructor(
    public readonly side: Side,
    public piece: Piece,
    public location: Location
  ) {}

  get vert() {
    return this.location.vert;
  }

  get hori() {
    return this.location.hori;
  }
}