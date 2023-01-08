import { Game } from "./modules/game";
import { Side, Location, byString, Piece, Eaten, Mode } from "./modules/types4game";
import { applyFullscreen } from "./modules/fullscreen";
import { initBoard } from "./modules/showPieces";
import { PieceStruct } from "./modules/pieceStruct";
import { whiteSide, blackSide } from "./modules/dom";
import { urlAccess } from "./modules/urlAccess";
import { eatenPieces } from "./modules/eatenPieces";
import { promotion } from "./modules/promotion";
import { showBoardTable } from "./modules/_boardTable";

/* Game Variables */
let BOARDSIZE = 8;
let TURN = Side.White;
let SHOWDELAY = 2000;
let mls: Location[] = [];
let presentLocation: Location = { vert: -1, hori: -1 };
let eatens: Eaten = {
  white: [],
  black: []
};
let MODE: Mode;

/* 게임 전 */
urlAccess(window.location.href).then(mode => {
  if (mode as Mode === Mode.tenXten) {
    BOARDSIZE = 10;
  }
  MODE = mode as Mode;
  playGame();
  applyFullscreen();
});


/* 게임! */
async function playGame() {
  const g = new Game(BOARDSIZE);
  g.showPieces([]);

  /* 현재 차례 알려주는 거 */
  while (true) {
    // showBoardTable(g.board, BOARDSIZE);

    switch (TURN as Side) {
      case Side.White:
        whiteSide?.classList.remove("opacityDown");
        blackSide?.classList.add("opacityDown");
        break;
      case Side.Black:
        blackSide?.classList.remove("opacityDown");
        whiteSide?.classList.add("opacityDown");
        break;
    }

    /* 기물 선택 & 움직임 */
    const { chosenLoc, choosingAction } = await g.willMoveListener(TURN, mls);

    if (choosingAction) {
      const chosenIdx = getIndexWhoseLocationIs(chosenLoc, g.board);
      const chosenEle = g.board[chosenIdx];
  
      mls = g.movableLocationsOf(chosenIdx);

      initBoard(BOARDSIZE);

      if (presentLocation === chosenEle.location) {
        g.showPieces();
        presentLocation = { vert: -1, hori: -1 };
      } else {
        g.showPieces(mls);
        presentLocation = chosenEle.location;
      }
    } else {
      let removeIDX = getIndexWhoseLocationIs(chosenLoc, g.board);
      const presentPiece = g.board[getIndexWhoseLocationIs(presentLocation, g.board)];

      /* 기본적인 움직임(먹기) */
      if (removeIDX !== -1 && g.board[removeIDX].side !== TURN) {
        eatens[TURN ? "white": "black"].push([
          "왕",
          "여왕",
          "비숍",
          "말",
          "룩",
          TURN ? "백마탄 여왕님" : "흑마탄 여왕님",
          "폰",
        ][g.board[removeIDX].piece]);

        g.board = [
          ...g.board.slice(0, removeIDX),
          ...g.board.slice(removeIDX + 1, g.board.length)
        ];
      }

      /* 앙파상 */
      if (removeIDX === -1 && presentPiece.piece === Piece.Pawn && chosenLoc.hori - presentPiece.hori) {
        removeIDX = getIndexWhoseLocationIs({
          vert: chosenLoc.vert - (presentPiece.side * 2 - 1),
          hori: chosenLoc.hori
        }, g.board);

        g.board = [
          ...g.board.slice(0, removeIDX),
          ...g.board.slice(removeIDX + 1, g.board.length)
        ];
        eatens[TURN ? "white": "black"].push("폰");

        /* 앙파상 사실 보여주기 */
        const shower = document.querySelector<HTMLElement>("#shower")!;
        shower.innerHTML = "앙파상!";
        shower.style.display = "flex";
        if (TURN === Side.Black) {
          shower.style.transform = "translate(-50%, -50%) rotate(180deg)";
        }

        setTimeout(() => {
          shower.style.display = "none";
          shower.style.transform = "translate(-50%, -50%) rotate(0deg)";
        }, SHOWDELAY);
      }

      /* Pawn 움직인 적 있는가 (for 2칸 전진) & 전에 2칸 전진했는가 (for 앙파상) */
      if (presentPiece.piece === Piece.Pawn) {
        if (!presentPiece.haveMoved && Math.abs(presentPiece.location.vert - chosenLoc.vert) === 2) {
          presentPiece.twoTimesRightBefore = true;
        }
        presentPiece.haveMoved = true;
      }

      /* 캐슬링 */
      let caslingName = "킹";
      if (presentPiece.piece === Piece.King && presentPiece.haveMoved === false) {
        if (chosenLoc.hori - presentPiece.hori === 2) {
          g.board[getIndexWhoseLocationIs({ vert:presentPiece.vert, hori: BOARDSIZE }, g.board)].location = {
            vert: presentPiece.vert,
            hori: presentPiece.hori + 1
          };
        }
        if (chosenLoc.hori - presentPiece.hori === -2) {
          caslingName = "퀸"
          g.board[getIndexWhoseLocationIs({ vert:presentPiece.vert, hori: 1 }, g.board)].location = {
            vert: presentPiece.vert,
            hori: presentPiece.hori - 1
          };
        }

        if (Math.abs(chosenLoc.hori - presentPiece.hori) === 2) {
          /* 캐슬링 사실 보여주기 */
          const shower = document.querySelector<HTMLElement>("#shower")!;
          shower.innerHTML = `${caslingName}사이드<br>캐슬링!`;
          shower.style.display = "flex";
          if (TURN === Side.Black) {
            shower.style.transform = "translate(-50%, -50%) rotate(180deg)";
          }

          setTimeout(() => {
            shower.style.display = "none";
            shower.style.transform = "translate(-50%, -50%) rotate(0deg)";
          }, SHOWDELAY);
        }
      }
        
      if ([Piece.King, Piece.Rook].some(v => presentPiece.piece === v)) {
        presentPiece.haveMoved = true;
      }

      /* 움직이기! */
      presentPiece.location = chosenLoc;

      /* 프로모션 */
      if (presentPiece.location.vert === (presentPiece.side ? BOARDSIZE : 1) && presentPiece.piece === Piece.Pawn) {
        const pieceToPromote = await promotion(MODE);
        let pieceToPromotePiece = Piece.null;
        switch(pieceToPromote) {
          case "퀸":
            pieceToPromotePiece = Piece.Queen;
            break;
          case "비숍":
            pieceToPromotePiece = Piece.Bishop;
            break;
          case "나이트":
            pieceToPromotePiece = Piece.Night;
            break;
          case "룩":
            pieceToPromotePiece = Piece.Rook;
            break;
          case "나이트퀸":
            pieceToPromotePiece = Piece.NighQueen;
            break;
        }

        presentPiece.piece = pieceToPromotePiece;
      }

      /* 초기화 */
      initBoard(BOARDSIZE);
      mls = [];
      presentLocation = { vert: -1, hori: -1 };

      g.showPieces();
      eatenPieces(eatens);

      TURN = TURN as Side === Side.White ? Side.Black : Side.White;

      for (let piece of g.board) {
        if (piece.side === TURN && piece.piece === Piece.Pawn) {
          piece.twoTimesRightBefore = false;
        }
      }
    }
  }
}

function getIndexWhoseLocationIs(location: Location, board: PieceStruct[]) {
  let index: number = -1;
  board.forEach((piece, i) => {
    if (byString(piece.location) === byString(location)) {
      index = i;
      return;
    }
  });
  return index;
}