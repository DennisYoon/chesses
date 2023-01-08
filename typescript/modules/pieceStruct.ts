import { Side, Piece, Location } from "./types4game";

type nullAble<T> = T | null;

export class PieceStruct {
  haveMoved: nullAble<boolean> = null;
  twoTimesRightBefore: nullAble<boolean> = null;

  constructor(
    public readonly side: Side,
    public piece: Piece,
    public location: Location
  ) {
    if (this.piece === Piece.Pawn) {
      this.haveMoved = false;
      this.twoTimesRightBefore = false;
    }

    if ([Piece.King, Piece.Rook].some(v => v === this.piece)) {
      this.haveMoved = false;
    }
  }

  get vert() {
    return this.location.vert;
  }

  get hori() {
    return this.location.hori;
  }
}