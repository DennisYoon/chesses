import { Side, Piece, Location, byString } from "./types4game";
import { ML } from "./movableLocations";

export class PieceStruct {
  readonly side: Side;
  piece: Piece;
  location: Location;

  constructor(side: Side, piece: Piece, location: Location) {
    this.side = side;
    this.piece = piece;
    this.location = location;
  }

  get vert() {
    return this.location.vert;
  }

  get hori() {
    return this.location.hori;
  }

  activateListener(board: PieceStruct[], callback: Function) {
    document.getElementById(byString(this.location))?.addEventListener("click", () => {
      const movableLocations = ML.movableLocation(this.piece, this.side, board);
      console.log(byString(this.location) + "'s movable locations :", movableLocations);
      callback(this.location);
    });
  }
}