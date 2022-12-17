import { Board } from "./modules/setBoard";
import { showBoard } from "./modules/showBoard";
import { createBoard } from "./modules/createBoard";

const b = new Board();

createBoard();
showBoard(b);