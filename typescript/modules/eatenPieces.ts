import { Eaten, Piece } from "./types4game";
import { whiteEaten, blackEaten } from "./dom";

export function eatenPieces(eatens: Eaten) {
  whiteEaten!.textContent = `먹은거: ${
    eatens.white.length
      ? eatens.white
        .sort((a, b) => a - b)
        .map(v => {
          if (v as number === -2) {
            return "백마탄 여왕님"
          } else if (v as number === -1) {
            return "흑마탄 여왕님"
          } else {
            return ["왕", "여왕", "비숍", "말", "룩", "폰"][v]
          }
        })
        .join(", ")
      : "없음"
  }`;

  blackEaten!.textContent = `먹은거: ${
    eatens.black.length
      ? eatens.black
        .sort((a, b) => a - b)
        .map(v => {
          if (v as number === -2) {
            return "백마탄 여왕님"
          } else if (v as number === -1) {
            return "흑마탄 여왕님"
          } else {
            return ["왕", "여왕", "비숍", "말", "룩", "폰"][v]
          }
        })
        .join(", ")
      : "없음"
  }`;
}