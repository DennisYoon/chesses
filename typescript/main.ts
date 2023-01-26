import { Game } from "./modules/game";
import { Side, Mode } from "./modules/types4game";
import { applyFullscreen } from "./modules/fullscreen";
import { customs, gameInfos, promotionGrid, special } from "./modules/dom";
import { urlAccess } from "./modules/urlAccess";
import { eatenPieces } from "./modules/eatenPieces";
import { Timer } from "./modules/timer";
import { Notation } from "./modules/notation";
import { shower } from "./modules/dom";
import { setCustomizableChess } from "./modules/customizableChessSetting";
import { createBoard } from "./modules/createBoard";
import { board } from "./modules/dom";
import { PieceStruct } from "./modules/pieceStruct";
import { classic } from "./modules/boards";

/* Game Variables */
let BOARDSIZE = 8;
let MODE: Mode;
let checkedOnce = false;
let timeOver = false;

/* 게임 전 */
applyFullscreen();

urlAccess(window.location.href).then(async mode => {
  let customBoard: PieceStruct[] = [];

  if (mode === Mode.tenXten) {
    BOARDSIZE = 10;
    promotionGrid!.style.gridTemplateColumns = `repeat(5, 1fr)`;
  } else {
    special!.remove();
  }

  if (mode === Mode.customizable) {
    for (let gameInfo of gameInfos) {
      gameInfo.style.display = "none";
    }

    createBoard(8);
    customBoard = classic();
    customBoard = await setCustomizableChess();
    board!.innerHTML = "";

    for (let gameInfo of gameInfos) {
      gameInfo.style.display = "block";
    }
  }
  for (let custom of customs) {
    custom.style.display = "none";
  }

  MODE = mode as Mode;
  playGame(customBoard);
});

function getParam(param: string) {
  return new URL(window.location.href).searchParams.get(param);
}

/* 게임! */
async function playGame(customBoard: PieceStruct[] = []) {
  const g = new Game({
    boardsize: BOARDSIZE,
    customBoard
  });
  g.mode = MODE;

  let t : Timer = new Timer({second: 0, plus: 0});
  if (getParam("basicTime") && getParam("addTime")) {
    t = new Timer({
      second: parseInt(getParam("basicTime")!),
      plus: parseInt(getParam("addTime")!)
    });
  } else {
    window.location.href = "./index.html?mode=404";
  }
    
  const n = new Notation();
  const s = new Sound();

  g.showPieces([]);
  t.start(g.turn);

  t.startCountDown();

  const timeOut = setInterval(() => {
    if (t.white <= 0) {
      t.clear();

      shower.innerHTML = "시간 초과에 의한<br>흑돌의 승!!";
      shower.style.color = "red";
      shower.style.display = "flex";
      if (g.turn === Side.White)
        shower.style.transform = "translate(-50%, -50%) rotate(180deg)";
      
      timeOver = true;
      clearInterval(timeOut);
    }
    if (t.black <= 0) {
      t.clear();

      shower.innerHTML = "시간 초과에 의한<br>백돌의 승!!";
      shower.style.color = "red";
      shower.style.display = "flex";
      if (g.turn === Side.White)
        shower.style.transform = "translate(-50%, -50%) rotate(180deg)";

      timeOver = true;
      clearInterval(timeOut);
    }
  }, 200);

  if ([
    g.ifMySideChecked(Side.White),
    g.ifMySideChecked(Side.Black),
    g.board
      .filter(v => v.side === g.turn)
      .map(v => g.movableLocationsOf(g.getIndexWhoseLocationIs(v.location), true).length)
      .every(v => v === 0),
  ].some(v => v)) {
    t.clear();
    shower.innerHTML = "시작부터 체크 or<br>체크메이트 or<br>스테일메이트";
    shower.style.color = "purple";
    shower.style.display = "flex";
    return;
  }

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
        t.clear();

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
          shower.style.color = "black";
          shower.style.display = "flex";
        }
        //게임 종료
        break;
      }

      // 50수 판별
      if (g.moves >= 50) {
        t.clear();

        s.fiftyMoves.play();
        shower.innerHTML = "50수 룰에<br>의한 무승부!!";
        shower.style.color = "black";
        shower.style.display = "flex";
        break;
      }

      // 체크메이트 불가 판별
      if (g.impossibilityOfCheckMate()) {
        t.clear();

        s.impossibilityOfCheckmate.play();
        shower.innerHTML = "체크메이트 불가에<br>의한 무승부!!";
        shower.style.color = "black";
        shower.style.display = "flex";
        break;
      }
    }

    // 3회 동형 판별
    if (g.trifoldRep(n)) {
      t.clear();

      s.trifoldRepitition.play();
      shower.innerHTML = "3회 동형 반복에<br>의한 무승부!!"
      shower.style.color = "black";
      shower.style.display = "flex";
      break;
    }

    g.showPieces();
    eatenPieces(g.eatens);
  }

  // 게임 종료 후
  g.showPieces();
}