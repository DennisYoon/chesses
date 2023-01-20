const body = document.querySelector("body");
const o = document.querySelector("#o");
const x = document.querySelector("#x");

const whiteSide = document.querySelector<HTMLElement>("#whiteSide");
const blackSide = document.querySelector<HTMLElement>("#blackSide");

const blackEaten = document.querySelector("#whiteSide .eaten");
const whiteEaten = document.querySelector("#blackSide .eaten");

const shower = document.querySelector<HTMLElement>("#shower")!;

const wTimer = document.querySelector<HTMLElement>("#whiteSide .timer")!;
const bTimer = document.querySelector<HTMLElement>("#blackSide .timer")!;

const promotionGrid = document.querySelector<HTMLElement>("#promotionGrid");
const special = document.querySelector("#special");

const board = document.querySelector("#board");

const gameInfos = document.querySelectorAll<HTMLElement>(".gameInfo");
const customs = document.querySelectorAll<HTMLElement>(".custom");

export {
  body,
  o,
  x,
  whiteSide,
  blackSide,
  whiteEaten,
  blackEaten,
  shower,
  wTimer,
  bTimer,
  promotionGrid,
  special,
  board,
  gameInfos,
  customs
};