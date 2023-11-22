class Knot {
  x = 0;
  y = 0;
  constructor(public name: string, public head: Knot | null = null) {}
  moveDirection(direction: string) {
    if (direction === "U") this.y += 1;
    if (direction === "D") this.y -= 1;
    if (direction === "L") this.x -= 1;
    if (direction === "R") this.x += 1;
  }
  follow(knot: Knot) {
    const dx = knot.x - this.x;
    const dy = knot.y - this.y;
    const xDiff = Math.abs(dx);
    const yDiff = Math.abs(dy);

    if (xDiff > 1 || yDiff > 1) {
      if (dx > 0) this.x += 1;
      if (dx < 0) this.x -= 1;
      if (dy > 0) this.y += 1;
      if (dy < 0) this.y -= 1;
    }
  }
}

const text = await Deno.readTextFile(new URL("./input.txt", import.meta.url));
const lines = text.split("\n");

const task1 = () => {
  const visited: string[] = [];
  const head = new Knot("head");
  const tail = new Knot("tail", head);
  for (const line of lines) {
    const [direction, steps] = line.split(" ");
    const stepsNum = parseInt(steps);

    for (let i = 0; i < stepsNum; i++) {
      head.moveDirection(direction);
      tail.follow(head);
      const tailCoords = `(${tail.x}, ${tail.y})`;
      if (!visited.includes(tailCoords)) visited.push(tailCoords);
    }
  }
  return visited.length;
};

const task2 = () => {
  const visited: string[] = [];
  const head = new Knot("head");
  let previousKnot = head;
  const knots = Array.from(Array(9), (_, i) => {
    const knot = new Knot(`knot #${i + 1}`, previousKnot);
    previousKnot = knot;
    return knot;
  });

  for (const line of lines) {
    const [direction, steps] = line.split(" ");
    const stepsNum = parseInt(steps);

    for (let i = 0; i < stepsNum; i++) {
      head.moveDirection(direction);
      knots.forEach((knot) => knot.follow(knot.head!));
      const tail = knots.at(-1)!;
      const tailCoords = `(${tail.x}, ${tail.y})`;
      if (!visited.includes(tailCoords)) visited.push(tailCoords);
    }
  }
  return visited.length;
};

console.log("Task1: ", task1());
console.log("Task2: ", task2());
