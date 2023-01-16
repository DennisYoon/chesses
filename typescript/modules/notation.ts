type VertHori = [number, number];

interface Moving {
  from: VertHori;
  to: VertHori;
}

export class Notation {
  notation: Array<Moving> = [];
  
  add({from, to}: Moving) {
    this.notation.push({ from, to });
  }

  undo() {
    this.notation.pop();
  }

  exportFile() {
    
  }
}