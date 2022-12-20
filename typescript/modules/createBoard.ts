export function createBoard(boardSize: number) {
  const table = document.querySelector("table")!;

  for (let trs = 1; trs <= boardSize; trs++) {
    const tr = document.createElement("tr");
    table.append(tr);
    for (let tds = 1; tds <= boardSize; tds++) {
      const td = document.createElement("td");
      td.setAttribute("id", trs.toString() + tds.toString());
      td.classList.add((trs + tds) % 2 ? "blackBoard" : "whiteBoard");
      tr.append(td);
    }
  }
}
