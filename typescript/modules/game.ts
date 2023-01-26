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
  public moves = 0;
  public custom = true;

  constructor({boardsize, customBoard = []}: {boardsize: number, customBoard: PieceStruct[]}) {
    if (customBoard.length) {
      this.board = customBoard;
      this.custom = true;
    } else {
      this.board = boardsize === 10 ? tenXten() : classic();
    }
    
    this.boardsize = boardsize;
    createBoard(this.boardsize);
  }

  public showPieces(possibleLocations: Location[] = []) {
    showPiecesFN(this.board, this.boardsize, possibleLocations);
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

    let movableLocations = fnToRun(me, this.board, this.boardsize);
    if (this.custom && me.piece === Piece.King) {
      movableLocations = ml.king(me, this.board, this.boardsize, true, true);
    }

    if (virtual) {
      const lastBoard = JSON.stringify(this.board);

      movableLocations = movableLocations
        .filter(location => {
          this.board = JSON.parse(lastBoard);
          this.board = this.board.map(v => {
            const newThing = new PieceStruct(v.side, v.piece, v.location);
            newThing.haveMoved = v.haveMoved;
            newThing.twoTimesRightBefore = v.twoTimesRightBefore;
            return newThing;
          });
          
          this.moveTo(me.location, location, {show: false, notation: new Notation});
          const mysideChecked = this.ifMySideChecked(this.turn);
          return !mysideChecked;
        });
  
      this.board = JSON.parse(lastBoard);
      this.board = this.board.map(v => {
        const newThing = new PieceStruct(v.side, v.piece, v.location);
        newThing.haveMoved = v.haveMoved;
        newThing.twoTimesRightBefore = v.twoTimesRightBefore;
        return newThing;
      });
    }

    // 캐슬링 실패!
    if (me.piece === Piece.King && me.haveMoved === false && !this.custom) {
      /* 킹 사이드 */ {
        const kingVert = me.vert;
        let kingHori = me.hori;
        let kingSide = [];
        for (kingHori = me.hori + 1; kingHori <= this.boardsize - 1; kingHori ++) {
          const meKingCheck = this.ifMySideChecked(
            this.turn,
            new PieceStruct(
              this.turn,
              me.piece,
              {
                vert: kingVert,
                hori: kingHori
              }
            )
          );
          kingSide.push(meKingCheck);
        }
        if (kingSide.some(v => v === true) || this.ifMySideChecked(this.turn)) {
          const castlingLoc = movableLocations.indexOf({vert: me.vert, hori: me.hori + 2});
          if (castlingLoc !== -1) {
            movableLocations = movableLocations.filter(v => byString(v) !== byString({
              vert: me.vert,
              hori: me.hori + 2
            }));
          }
        }
      }
      
      /* 퀸 사이드 */ {
        const kingVert = me.vert;
        let kingHori = me.hori;
        let queenSide = [];
        for (kingHori = me.hori - 1; kingHori <= 2; kingHori --) {
          const meKingCheck = this.ifMySideChecked(
            this.turn,
            new PieceStruct(
              this.turn,
              me.piece,
              {
                vert: kingVert,
                hori: kingHori
              }
            )
          );
          queenSide.push(meKingCheck);
        }
        if (queenSide.some(v => v === true) || this.ifMySideChecked(this.turn)) {
          const castlingLoc = movableLocations.indexOf({vert: me.vert, hori: me.hori - 2});
          if (castlingLoc !== -1) {
            movableLocations = movableLocations.filter(v => byString(v) !== byString({
              vert: me.vert,
              hori: me.hori - 2
            }));
          }
        }
      }
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
    shower.style.color = "yellow";
    shower.style.display = "flex";
    if (this.turn === Side.Black) {
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

  public ifMySideChecked(turn: Side, alter: PieceStruct = new PieceStruct(Side.null, Piece.null, {vert: -1, hori: -1}), show = false) {
    let myKing = this.board.filter(v => v.piece === Piece.King && v.side === turn)[0];
    if (alter.side !== Side.null) {
      myKing = alter;
    }

    // Rook & Queen & NighQueen
    const r = ml.rook(myKing, this.board, this.boardsize, false).filter(v => {
      const me = this.getPieceWhoseLocationIs(v);
      return [Piece.Queen, Piece.Rook, Piece.NighQueen].some(v => me.piece === v);
    });
    if (r.length && ml.rook(myKing, this.board, this.boardsize, false).length) {
      return true;
    }

    // Bishop & Queen & NighQueen
    const b = ml.bishop(myKing, this.board, this.boardsize, false).filter(v => {
      const me = this.getPieceWhoseLocationIs(v);
      return [Piece.Bishop, Piece.Queen, Piece.NighQueen].some(v => me.piece === v);
    });
    if (b.length && ml.bishop(myKing, this.board, this.boardsize, false).length) {
      return true;
    }

    // Night & NighQueen
    const n = ml.night(myKing, this.board, this.boardsize, false).filter(v => {
      const me = this.getPieceWhoseLocationIs(v);
      return [Piece.Night, Piece.NighQueen].some(v => me.piece === v);
    });
    if (n.length && ml.night(myKing, this.board, this.boardsize, false).length) {
      return true;
    }

    // Pone
    let movableLocations: Location[] = [];
    if (turn === Side.White) {
      movableLocations = [
        {vert: myKing.vert - 1, hori: myKing.hori + 1},
        {vert: myKing.vert - 1, hori: myKing.hori - 1}
      ];
    }
    if (turn === Side.Black) {
      movableLocations = [
        {vert: myKing.vert + 1, hori: myKing.hori + 1},
        {vert: myKing.vert + 1, hori: myKing.hori - 1}
      ];
    }
    movableLocations = movableLocations
      .filter(loc => Object.values(loc).every(v => v >= 1 && v <= this.boardsize))
      .filter(loc => {
        const presentPiece = this.getPieceWhoseLocationIs(loc);
        if (presentPiece.piece === Piece.null) return false;
        return presentPiece.side !== turn;
      });

    const originP = [...movableLocations];
    
    movableLocations = movableLocations.filter(v => {
      const me = this.getPieceWhoseLocationIs(v);
      return me.piece === Piece.Pawn;
    });
    const p = movableLocations;
    if (p.length && originP.length) {
      return true;
    }

    // King
    const k = ml.king(myKing, this.board, this.boardsize, false).filter(v => {
      const me = this.getPieceWhoseLocationIs(v);
      return [Piece.King].some(v => me.piece === v);
    });
    if (k.length && ml.king(myKing, this.board, this.boardsize, false).length) {
      return true;
    }

    return false;
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
    let makeZero = false;

    let ate = false;
    let castling = "";
    let promote = false;
    let nowPiece = presentPiece.piece;

    /* 기본적인 움직임(먹기) */
    if (removeIDX !== -1 && this.board[removeIDX].side !== this.turn) {
      ate = true;
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

      if (show)
        makeZero = true;
    }

    /* 앙파상 */
    if (removeIDX === -1 && presentPiece.piece === Piece.Pawn && willMoveLocation.hori - presentPiece.hori) {
      ate = true;
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
      if (show)
        makeZero = true;
    }

    /* 캐슬링 */
    let caslingName = "킹";
    if (presentPiece.piece === Piece.King && presentPiece.haveMoved === false) {
      if (willMoveLocation.hori - presentPiece.hori === 2) {
        castling = "0-0";
        this.board[this.getIndexWhoseLocationIs({ vert:presentPiece.vert, hori: this.boardsize })].location = {
          vert: presentPiece.vert,
          hori: presentPiece.hori + 1
        };
      }
      if (willMoveLocation.hori - presentPiece.hori === -2) {
        caslingName = "퀸"
        castling = "0-0-0";
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

    /* 움직이기! */
    presentPiece.location = willMoveLocation;
    if (show) {
      if (makeZero) {
        this.moves = 0;
      } else {
        this.moves += 1;
      }
    }

    /* 프로모션 */
    if (willMoveLocation.vert === (presentPiece.side ? this.boardsize : 1) && presentPiece.piece === Piece.Pawn && show) {
      promote = true;
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

    /* 기보에 저장 */
    if (show) {
      notation.add(nowPiece, presentPiece.location, ate, promote, this.ifMySideChecked(this.turn ? Side.White : Side.Black), castling);
    }

    return;
  }

  public getPieceWhoseLocationIs(location: Location) {
    let index: number = -1;
    this.board.forEach((piece, i) => {
      if (byString(piece.location) === byString(location)) {
        index = i;
        return;
      }
    });
    if (index === -1) {
      return new PieceStruct(Side.null, Piece.null, {vert: 0, hori: 0});
    } else {
      return this.board[index];
    }
  }

  public impossibilityOfCheckMate() {
    const white = this.board.filter(v => v.side === Side.White);
    const black = this.board.filter(v => v.side === Side.Black);

    // 둘 다 킹만 살아있다
    if (white.length === 1 && black.length === 1) {
      return true;
    }

    // 한쪽은 킹만, 다른 쪽은 킹, 같은 색 비숍이 남을 때
    if (
      white.length === 1
      && black.filter(v => v.piece === Piece.Bishop).length === black.length - 1
      && black
      .filter(v => v.piece === Piece.Bishop)
      .map(v => (v.vert + v.hori) % 2)
      .every((v, _, arr) => v === arr[0])
    ) {
      return true;
    }
    if (
      black.length === 1
      && white.filter(v => v.piece === Piece.Bishop).length === white.length - 1
      && white
      .filter(v => v.piece === Piece.Bishop)
      .map(v => (v.vert + v.hori) % 2)
      .every((v, _, arr) => v === arr[0])
    ) {
      return true;
    }

    // 한쪽은 킹만, 다른 쪽은 킹, 나이트 1개 남을 때
    if (white.length === 1 && black.length === 2 && black.filter(v => v.piece === Piece.Night).length === 1) {
      return true;
    }
    if (black.length === 1 && white.length === 2 && white.filter(v => v.piece === Piece.Night).length === 1) {
      return true;
    }

    // 양쪽 모두 킹 + 비숍 (비숍 색 같음)
    if (
      white.filter(v => v.piece === Piece.Bishop).length === white.length - 1
      && black.filter(v => v.piece === Piece.Bishop).length === black.length - 1
      && white
        .filter(v => v.piece === Piece.Bishop)
        .map(v => (v.vert + v.hori) % 2)
        .every((v, _, arr) => v === arr[0])
      && black
        .filter(v => v.piece === Piece.Bishop)
        .map(v => (v.vert + v.hori) % 2)
        .every((v, _, arr) => v === arr[0])
    ) {
      const wBishop1 = white.filter(v => v.piece === Piece.Bishop)[0];
      const wBishopLoc = (wBishop1.vert + wBishop1.hori) % 2;

      const bBishop1 = black.filter(v => v.piece === Piece.Bishop)[0];
      const bBishopLoc = (bBishop1.vert + bBishop1.hori) % 2;

      if (wBishopLoc === bBishopLoc) {
        return true;
      }
    }
    return false;
  }

  public trifoldRep(notation: Notation) {
    const n = notation.notation;
    const shifted = n.shift();

    let repeat = false;
    for (let turm = 2; turm < n.length; turm += 2) {
      const tiedN = Game.tieArray(n, turm);
      if (
        tiedN.length >= 2
        && tiedN[0] === tiedN[1]
        && shifted
        && Game.reverseStr(tiedN[0]).indexOf(Game.reverseStr(shifted!)) === 0
      ) {
        repeat = true;
        break;
      }
    }

    if (shifted !== undefined) {
      n.unshift(shifted);
    }

    return repeat;
  }

  static tieArray(arr: Array<string>, size: number) {
    let tiedArray = [];
    for (let i = 0; i < arr.length; i += size) {
      tiedArray.push(arr.slice(i, i + size).join(""));
    }
    return tiedArray;
  }

  static reverseStr(str: string) {
    return str.split('').reverse().join();
  }
}