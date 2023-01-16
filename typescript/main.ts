import { Game } from "./modules/game";
import { Side, Mode } from "./modules/types4game";
import { applyFullscreen } from "./modules/fullscreen";
import { promotionGrid, special } from "./modules/dom";
import { urlAccess } from "./modules/urlAccess";
import { eatenPieces } from "./modules/eatenPieces";
import { Timer } from "./modules/timer";
import { Notation } from "./modules/notation";

/* Game Variables */
let BOARDSIZE = 8;
let MODE: Mode;

/* 게임 전 */
urlAccess(window.location.href).then(mode => {
  if (mode as Mode === Mode.tenXten) {
    BOARDSIZE = 10;
    promotionGrid!.style.gridTemplateColumns = `repeat(5, 1fr)`;
  } else {
    special!.remove();
  }
  MODE = mode as Mode;
  playGame();
  applyFullscreen();
});


/* 게임! */
async function playGame() {
  const g = new Game(BOARDSIZE);
  const t = new Timer({
    second: 1200,
    plus: 5
  });
  const n = new Notation();
  const s = new Sound();

  g.showPieces([]);
  t.start(g.turn);

  t.startCountDown();
  while (true) {
    g.showPresentTurn();

    const { chosenLocation, choosingAction } = await g.willMoveListener(g.turn);
    if (choosingAction) {
      g.showWillMoveLocatoin(chosenLocation);
    } else {
      await g.moveTo(g.presentLocation, chosenLocation, { show: true, notation: n });
      const checkTo = g.checkcheck();
      if (checkTo !== Side.null) {
        g.showCheckMSG();
      }
      s.pieceSet.play();
      g.init();
      g.changeTurn(t);
      g.twoTimesRightBeforeFalse();
    }

    g.showPieces();
    eatenPieces(g.eatens);
  }
}