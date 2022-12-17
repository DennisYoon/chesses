export function createBoard() {
  const table = document.querySelector("table")!;

  for (let trs = 1; trs <= 8; trs++) {
    const tr = document.createElement("tr");
    table.append(tr);
    for (let tds = 1; tds <= 8; tds++) {
      const td = document.createElement("td");
      td.setAttribute("id", trs.toString() + tds.toString());
      td.classList.add((trs + tds) % 2 ? "blackBoard" : "whiteBoard");
      tr.append(td);
    }
  }
}
