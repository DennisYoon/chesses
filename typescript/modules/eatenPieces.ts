import { Eaten } from "./types4game";
import { whiteEaten, blackEaten } from "./dom";

export function eatenPieces(eatens: Eaten) {
  whiteEaten!.textContent = `먹은거: ${ eatens.white.length ? eatens.white.join(", ") : "없음" }`;
  blackEaten!.textContent = `먹은거: ${ eatens.black.length ? eatens.black.join(", ") : "없음" }`;
}