import { Sides, Location, Pieces } from "./types4Board";
import { Piece } from "./setBoard";

const anyLocArr: Location[] = [{vert: 1, hori: 1}];

export class ML {
  public static movableLocation(piece: Pieces, side: Sides, board: Piece[]) {
    switch (piece) {
      case Pieces.King: return ML.king(side, board);
      case Pieces.Queen: return ML.queen(side, board);
      case Pieces.Bishop: return ML.bishop(side, board);
      case Pieces.Night: return ML.night(side, board);
      case Pieces.Rook: return ML.rook(side, board);
      case Pieces.Pawn:
        if (side === Sides.White) {
          return ML.whitePawn(side, board);
        } else {
          return ML.blackPawn(side, board);
        }
    }
  }

  private static king(side: Sides, board: Piece[]) {
    return anyLocArr;
  }

  private static queen(side: Sides, board: Piece[]) {
    return anyLocArr;
  }

  private static bishop(side: Sides, board: Piece[]) {
    return anyLocArr;
  }

  private static night(side: Sides, board: Piece[]) {
    return anyLocArr;
  }

  private static rook(side: Sides, board: Piece[]) {
    return anyLocArr;
  }

  private static whitePawn(side: Sides, board: Piece[]) {
    return anyLocArr;
  }

  private static blackPawn(side: Sides, board: Piece[]) {
    return anyLocArr;
  }
} // movable location