export function createBoard(bs: number) {
  const table = document.querySelector("table")!;
  const sequence = Array(bs).fill(1).map((v: number, i: number) => v + i);

  sequence.forEach(trs => {
    const tr = document.createElement("tr");
    table.append(tr);
    sequence.forEach(tds => {
      const td = document.createElement("td");
      td.setAttribute("id", trs.toString() + tds.toString());
      td.classList.add((trs + tds) % 2 ? "blackBoard" : "whiteBoard");
      tr.append(td);
    })
  })
}
