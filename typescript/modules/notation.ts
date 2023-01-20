import { Piece, Location } from "./types4game";

export class Notation {
  notation: Array<string> = [];
  
  add(piece: Piece, location: Location, catched: boolean, promotion: boolean, check: boolean, casling: string) {
    const pieceStr = "KQBNRXP"[piece];
    const catchedStr = catched ? "x" : "";
    const vertStr = "abcdefghij"[location.vert];
    const horiStr = "abcdefghij"[location.hori];
    const promotionStr = promotion ? "=" : "";
    const checkStr = check ? "+": "";
    const caslingStr = casling;

    if (caslingStr !== "") {
      this.notation.unshift(caslingStr);
    } else {
      this.notation.unshift(pieceStr + catchedStr + vertStr + horiStr + promotionStr + checkStr);
    }
  }
}