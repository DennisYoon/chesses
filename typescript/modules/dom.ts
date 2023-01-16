const body = document.querySelector("body");
const o = document.querySelector("#o");
const x = document.querySelector("#x");

const whiteSide = document.querySelector("#whiteSide");
const blackSide = document.querySelector("#blackSide");

const blackEaten = document.querySelector("#whiteSide .eaten");
const whiteEaten = document.querySelector("#blackSide .eaten");

const shower = document.querySelector<HTMLElement>("#shower")!;

const wTimer = document.querySelector<HTMLElement>("#whiteSide .timer")!;
const bTimer = document.querySelector<HTMLElement>("#blackSide .timer")!;

const promotionGrid = document.querySelector<HTMLElement>("#promotionGrid");
const special = document.querySelector("#special");

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
  special
};