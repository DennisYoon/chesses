import { Side, Location, byString, Piece, Mode, Eaten } from "./types4game";
import { createBoard } from "./createBoard";
import { showPiecesFN } from "./showPieces";
import { waitUntil } from "./waitUntil";
import { ml } from "./movableLocations";
import { PieceStruct } from "./pieceStruct";
import { classic, tenXten } from "./boards";
import { initBoard } from "./showPieces";
import { eatenPieces } from "./eatenPieces";
import { whiteSide, blackSide, shower } from "./dom";
import { Notation } from "./notation";
import { promotion } from "./promotion";
import { Timer } from "./timer";
import { showBoardTable } from "./_boardTable";

export class Game {
  public board: PieceStruct[] = [];

  public boardsize = 8;
  public mode = Mode.null;
  public movableLocations: Location[] = [];
  public presentLocation: Location = { vert: -1, hori: -1 };
  public turn = Side.White;
  public eatens: Eaten = { white: [], black: [] };
  public showdelay = 2000;

  constructor(public bs: number) {
    this.board = bs === 10 ? tenXten() : classic();
    this.boardsize = bs;
    createBoard(bs);
  }

  public showPieces(possibleLocations: Location[] = []) {
    showPiecesFN(this.board, this.bs, possibleLocations);
  }

  public async willMoveListener(side: Side) {
    let willMoveLocation = { vert: -1, hori: -1 };
    let choosingAction = false;

    function listener1(location: Location) {
      return () => {
        willMoveLocation = location;
      }
    }

    function listener2(location: Location) {
      return () => {
        willMoveLocation = location;
        choosingAction = true;
      }
    }

    this.board.forEach(piece => {
      if (piece.side === side) {
        const me = document.getElementById(byString(piece.location))!;
        me?.classList.add(
          ["choosableWhite", "choosableBlack"]
          [
            Array.from(me.id)
              .map(v => parseInt(v))
              .reduce((a, b) => a + b, 0) % 2
          ]
        );
        me?.addEventListener("click", listener2(piece.location));
      }
    });

    for (let movableLocation of this.movableLocations) {
      const me = document.getElementById(byString(movableLocation));
      me?.classList.add(
        ["choosableWhite", "choosableBlack"]
        [
          Array.from(me.id)
            .map(v => parseInt(v))
            .reduce((a, b) => a + b, 0) % 2
        ]
      );
      me?.addEventListener("click", listener1(movableLocation));
    }
    
    await waitUntil(() => willMoveLocation.hori !== -1);

    this.board.forEach(piece => {
      const me = document.getElementById(byString(piece.location));
      me?.classList.remove("choosableBlack", "choosableWhite");
      me?.removeEventListener("click", listener2(piece.location));
    });

    for (let movableLocation of this.movableLocations) {
      const me = document.getElementById(byString(movableLocation));
      me?.classList.remove("choosableBlack", "choosableWhite");
      me?.removeEventListener("click", listener1(movableLocation));
    }

    return { chosenLocation: willMoveLocation, choosingAction };
  }

  public init() {
    initBoard(this.boardsize);
    this.movableLocations = [];
    this.presentLocation = { vert: -1, hori: -1 };
  }

  public showScreen() {
    this.showPieces();
    eatenPieces(this.eatens);
  }

  public showPresentTurn() {
    switch (this.turn) {
      case Side.White:
        whiteSide?.classList.remove("opacityDown");
        blackSide?.classList.add("opacityDown");
        break;
      case Side.Black:
        blackSide?.classList.remove("opacityDown");
        whiteSide?.classList.add("opacityDown");
        break;
    }
  }

  public movableLocationsOf(pieceIndex: number, virtual: boolean) {
    const me = this.board[pieceIndex];

    let fnToRun = Object.values(ml)[me.piece];
    if (fnToRun.name.indexOf("Pawn") !== -1) {
      if (me.side === Side.White) {
        fnToRun = ml.wPawn;
      } else {
        fnToRun = ml.bPawn;
      }
    }

    let movableLocations = fnToRun(me, this.board, this.bs);

    if (virtual) {
      const lastBoard = JSON.stringify(this.board);

      movableLocations = fnToRun(me, this.board, this.bs)
        .filter(location => {
          this.board = JSON.parse(lastBoard);
          this.board = this.board.map(v => {
            const newThing = new PieceStruct(v.side, v.piece, v.location);
            newThing.haveMoved = v.haveMoved;
            newThing.twoTimesRightBefore = v.twoTimesRightBefore;
            return newThing;
          });
          
          this.moveTo(me.location, location, {show: false, notation: new Notation});
          console.log(this.checkcheck());
          return this.checkcheck() === this.turn || this.checkcheck() === Side.null;
        });
  
      this.board = JSON.parse(lastBoard);
      this.board = this.board.map(v => {
        const newThing = new PieceStruct(v.side, v.piece, v.location);
        newThing.haveMoved = v.haveMoved;
        newThing.twoTimesRightBefore = v.twoTimesRightBefore;
        return newThing;
      });
    }
    
    return movableLocations ?? [];
  }

  public showWillMoveLocatoin(willMoveLocation: Location) {
    const chosenIdx = this.getIndexWhoseLocationIs(willMoveLocation);
    const chosenEle = this.board[chosenIdx];

    this.movableLocations = this.movableLocationsOf(chosenIdx, true);
    initBoard(this.boardsize);

    if (this.presentLocation === chosenEle.location) {
      this.showPieces();
      this.presentLocation = { vert: -1, hori: -1 };
    } else {
      this.showPieces(this.movableLocations);
      this.presentLocation = chosenEle.location;
    }
  }

  public showCheckMSG() {
    shower.innerHTML = "체!크!";
    shower.style.display = "flex";
    if (this.turn === Side.White) {
      shower.style.transform = "translate(-50%, -50%) rotate(180deg)";
    }

    setTimeout(() => {
      shower.style.display = "none";
      shower.style.transform = "translate(-50%, -50%) rotate(0deg)";
    }, this.showdelay);
  }

  public changeTurn(t: Timer) {
    t.stop(this.turn);
    this.turn = this.turn as Side === Side.White ? Side.Black : Side.White;
    t.start(this.turn);
  }

  public twoTimesRightBeforeFalse() {
    for (let piece of this.board) {
      if (piece.side === this.turn && piece.piece === Piece.Pawn) {
        piece.twoTimesRightBefore = false;
      }
    }
  }

  public getIndexWhoseLocationIs(location: Location) {
    let index: number = -1;
    this.board.forEach((piece, i) => {
      if (byString(piece.location) === byString(location)) {
        index = i;
        return;
      }
    });
    return index;
  }

  public checkcheck() {
    let checkTo = Side.null;
    let turnturn = [this.turn, this.turn ? Side.White : Side.Black];
    for (let turn of turnturn) {
      let mes = [];
      for (let piece of this.board) {
        if (piece.side === turn) {
          mes.push(piece);
        }
      }
  
      let whereICanMove: Location[] = [];

      mes.map(me => {
        return this.movableLocationsOf(this.getIndexWhoseLocationIs(me.location), false);
      }).forEach(v => {
        whereICanMove = [...whereICanMove, ...v];
      });

      
      const oppoKing = this.getKingOfOppo(turn);
      if (whereICanMove.map(v => byString(v)).indexOf(byString(oppoKing.location)) !== -1) {
        checkTo = turn ? Side.Black : Side.White;
      }
    }
    
    return checkTo;
  }

  public getKingOfOppo(mySide: Side) {
    for (let piece of this.board) {
      if (piece.side === (mySide === Side.White ? Side.Black : Side.White) && piece.piece === Piece.King) {
        return piece;
      }
    }
    return new PieceStruct(Side.null, Piece.null, {vert: -1, hori: -1});
  }

  public async moveTo(presentLocation: Location, willMoveLocation: Location, {show, notation}: {show:boolean, notation:Notation}) {
    let removeIDX = this.getIndexWhoseLocationIs(willMoveLocation);
    const presentPiece = this.board[this.getIndexWhoseLocationIs(presentLocation)];

    /* 기본적인 움직임(먹기) */
    if (removeIDX !== -1 && this.board[removeIDX].side !== this.turn) {
      if (show) {
        this.eatens[this.turn ? "white" : "black"].push(
          this.board[removeIDX].piece === Piece.NighQueen
            ? (this.board[removeIDX].side === Side.White ? -2 : -1)
            : this.board[removeIDX].piece === Piece.Pawn
              ? 5
              : this.board[removeIDX].piece
          );
      }
      

      this.board = [
        ...this.board.slice(0, removeIDX),
        ...this.board.slice(removeIDX + 1, this.board.length)
      ];
    }

    /* 앙파상 */
    if (removeIDX === -1 && presentPiece.piece === Piece.Pawn && willMoveLocation.hori - presentPiece.hori) {
      removeIDX = this.getIndexWhoseLocationIs({
        vert: willMoveLocation.vert - (presentPiece.side * 2 - 1),
        hori: willMoveLocation.hori
      });

      this.board = [
        ...this.board.slice(0, removeIDX),
        ...this.board.slice(removeIDX + 1, this.board.length)
      ];

      if (show)
        this.eatens[this.turn ? "white": "black"].push();

      /* 앙파상 사실 보여주기 */
      if (show) {
        shower.innerHTML = "앙파상!";
        shower.style.display = "flex";
        if (this.turn === Side.Black) {
          shower.style.transform = "translate(-50%, -50%) rotate(180deg)";
        }
  
        setTimeout(() => {
          shower.style.display = "none";
          shower.style.transform = "translate(-50%, -50%) rotate(0deg)";
        }, this.showdelay);
      }
    }

    /* Pawn 움직인 적 있는가 (for 2칸 전진) & 전에 2칸 전진했는가 (for 앙파상) */
    if (presentPiece.piece === Piece.Pawn) {
      if (!presentPiece.haveMoved && Math.abs(presentPiece.location.vert - willMoveLocation.vert) === 2) {
        presentPiece.twoTimesRightBefore = true;
      }
      presentPiece.haveMoved = true;
    }

    /* 캐슬링 */
    let caslingName = "킹";
    if (presentPiece.piece === Piece.King && presentPiece.haveMoved === false) {
      if (willMoveLocation.hori - presentPiece.hori === 2) {
        this.board[this.getIndexWhoseLocationIs({ vert:presentPiece.vert, hori: this.boardsize })].location = {
          vert: presentPiece.vert,
          hori: presentPiece.hori + 1
        };
      }
      if (willMoveLocation.hori - presentPiece.hori === -2) {
        caslingName = "퀸"
        this.board[this.getIndexWhoseLocationIs({ vert:presentPiece.vert, hori: 1 })].location = {
          vert: presentPiece.vert,
          hori: presentPiece.hori - 1
        };
      }

      if (Math.abs(willMoveLocation.hori - presentPiece.hori) === 2 && show) {
        /* 캐슬링 사실 보여주기 */
        shower.innerHTML = `${caslingName}사이드<br>캐슬링!`;
        shower.style.display = "flex";
        if (this.turn === Side.Black) {
          shower.style.transform = "translate(-50%, -50%) rotate(180deg)";
        }

        setTimeout(() => {
          shower.style.display = "none";
          shower.style.transform = "translate(-50%, -50%) rotate(0deg)";
        }, this.showdelay);
      }
    }

    /* 폰, 룩 움직인 적 있음! */
    if ([Piece.King, Piece.Rook].some(v => presentPiece.piece === v)) {
      presentPiece.haveMoved = true;
    }

    /* 기보에 저장 */
    if (show) {
      notation.add({
        from: [presentPiece.location.vert, presentPiece.location.hori],
        to: [willMoveLocation.vert, willMoveLocation.hori]
      });
    }
    

    /* 움직이기! */
    presentPiece.location = willMoveLocation;

    /* 프로모션 */
    if (willMoveLocation.vert === (presentPiece.side ? this.boardsize : 1) && presentPiece.piece === Piece.Pawn && show) {
      const pieceToPromote = await promotion(this.mode);
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

    return;
  }
}