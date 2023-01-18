import { Game } from "./modules/game";
import { Side, Mode } from "./modules/types4game";
import { applyFullscreen } from "./modules/fullscreen";
import { promotionGrid, special } from "./modules/dom";
import { urlAccess } from "./modules/urlAccess";
import { eatenPieces } from "./modules/eatenPieces";
import { Timer } from "./modules/timer";
import { Notation } from "./modules/notation";
import { shower } from "./modules/dom";

/* Game Variables */
let BOARDSIZE = 8;
let MODE: Mode;
let checkedOnce = false;
let timeOver = false;

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

  const timeOut = setInterval(() => {
    if (t.white <= 0) {
      // 타이머 종료
      clearInterval(t.wTimer);
      clearInterval(t.bTimer);

      shower.innerHTML = "시간 초과에 의한<br>흑돌의 승!!";
      shower.style.color = "red";
      shower.style.display = "flex";
      if (g.turn === Side.White)
        shower.style.transform = "translate(-50%, -50%) rotate(180deg)";
      
      timeOver = true;
      clearInterval(timeOut);
    }
    if (t.black <= 0) {
      // 타이머 종료
      clearInterval(t.wTimer);
      clearInterval(t.bTimer);

      shower.innerHTML = "시간 초과에 의한<br>백돌의 승!!";
      shower.style.color = "red";
      shower.style.display = "flex";
      if (g.turn === Side.White)
        shower.style.transform = "translate(-50%, -50%) rotate(180deg)";

      timeOver = true;
      clearInterval(timeOut);
    }
  }, 200);

  while (true) {
    // 체크 보여주기
    if (!checkedOnce) {
      const checkTo = g.ifMySideChecked(g.turn);
      if (checkTo) {
        g.showCheckMSG();
        s.check.play();
        checkedOnce = true;
      }
    }
    
    g.showPresentTurn();

    const { chosenLocation, choosingAction } = await g.willMoveListener(g.turn);
    if (timeOver) break;
    if (choosingAction) {
      g.showWillMoveLocatoin(chosenLocation);
    } else {
      await g.moveTo(g.presentLocation, chosenLocation, { show: true, notation: n });
      s.pieceSet.play();
      g.init();
      g.changeTurn(t);
      g.twoTimesRightBeforeFalse();
      checkedOnce = false;

      // checkmate & stalemate 판별
      if (
        g.board
          .filter(v => v.side === g.turn)
          .map(v => g.movableLocationsOf(g.getIndexWhoseLocationIs(v.location), true).length)
          .every(v => v === 0)
      ) {
        // 타이머 종료
        clearInterval(t.wTimer);
        clearInterval(t.bTimer);

        // 먹은거 추가
        eatenPieces(g.eatens);

        if (g.ifMySideChecked(g.turn)) {
          //체크 메이트
          s.checkmate.play();
          if (g.turn) {
            shower.innerHTML = "체크 메이트!!<br>백돌 승!";
          } else {
            shower.innerHTML = "체크 메이트!!<br>흑돌 승!";
          }
          shower.style.color = "red";
          shower.style.display = "flex";
          if (g.turn === Side.White) {
            shower.style.transform = "translate(-50%, -50%) rotate(180deg)";
          }
        } else {
          // 스테일 메이트
          s.stalemate.play();
          shower.innerHTML = "스테일 메이트에<br>의한 무승부!!";
          shower.style.display = "flex";
        }
        //게임 종료
        break;
      }

      // 50수 판별
      if (g.moves >= 50) {
        // 타이머 종료
        clearInterval(t.wTimer);
        clearInterval(t.bTimer);

        s.fiftyMoves.play();
        shower.innerHTML = "50수 룰에<br>의한 무승부!!";
        shower.style.display = "flex";
        break;
      }

      // 체크메이트 불가 판별
      if (g.impossibilityOfCheckMate()) {
        // 타이머 종료
        clearInterval(t.wTimer);
        clearInterval(t.bTimer);

        s.impossibilityOfCheckmate.play();
        shower.innerHTML = "체크메이트 불가에<br>의한 무승부!!";
        shower.style.display = "flex";
        break;
      }

      // 3회 동행 판별
      
    

      
    }

    g.showPieces();
    eatenPieces(g.eatens);
  }

  // 게임 종료 후
  g.showPieces();
}

function twoDimenArr(arr: any[], chuck: number) {
  return arr.map((_, i) => {
    return i % chuck ? [] : arr.slice(i, i + chuck);
  }); // thank you chatGPT
}
