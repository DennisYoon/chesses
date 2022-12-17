import { Wares, Sides } from "./types4Board";
import { Board } from "./setBoard";

export function showBoard(board: Board) {
  const wareNames = [Wares.King, Wares.Queen, Wares.Bishop, Wares.Night, Wares.Rook, Wares.Pone];
  const wareNamesK = ["왕", "여왕", "비숍", "말", "룩", "폰"];

  for (let ware of board.board) {
    const ele = document.getElementById(Object.values(ware.location).join(""))!;
    ele.classList.remove("whiteWare", "blackWare");
    ele.classList.add(ware.side === Sides.White ? "whiteWare" : "blackWare");
    ele.textContent = wareNamesK[wareNames.indexOf(ware.ware)];
  }

  for (let i = 11; i <= 81; i += 10) {
    const ele = document.getElementById(i.toString())!;
    ele.innerHTML ||= "&nbsp;";
  }
}