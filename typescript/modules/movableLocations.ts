import { Side, Location, Piece } from "./types4game";
import { PieceStruct } from "./pieceStruct";

const anyLocArr: Location[] = [{vert: 1, hori: 1}];

export class ML {
  public static movableLocation(piece: Piece, side: Side, board: PieceStruct[]) {
    switch (piece) {
      case Piece.King: return ML.king(side, board);
      case Piece.Queen: return ML.queen(side, board);
      case Piece.Bishop: return ML.bishop(side, board);
      case Piece.Night: return ML.night(side, board);
      case Piece.Rook: return ML.rook(side, board);
      case Piece.Pawn:
        if (side === Side.White) {
          return ML.whitePawn(side, board);
        } else {
          return ML.blackPawn(side, board);
        }
    }
  }

  private static king(side: Side, board: PieceStruct[]) {
    return anyLocArr;
  }

  private static queen(side: Side, board: PieceStruct[]) {
    return anyLocArr;
  }

  private static bishop(side: Side, board: PieceStruct[]) {
    return anyLocArr;
  }

  private static night(side: Side, board: PieceStruct[]) {
    return anyLocArr;
  }

  private static rook(side: Side, board: PieceStruct[]) {
    return anyLocArr;
  }

  private static whitePawn(side: Side, board: PieceStruct[]) {
    return anyLocArr;
  }

  private static blackPawn(side: Side, board: PieceStruct[]) {
    return anyLocArr;
  }
} // movable location