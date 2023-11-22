import fs from "fs";

class Coord {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

class RopeKnot {
  constructor(coord, name, head = null) {
    this.coord = coord;
    this.head = head;
    this.name = name;
  }
  moveDirection(direction) {
    if (direction === "U") this.coord.y += 1;
    if (direction === "D") this.coord.y -= 1;
    if (direction === "L") this.coord.x -= 1;
    if (direction === "R") this.coord.x += 1;
  }
  moveToCoord(coord) {
    this.coord = new Coord(coord.x, coord.y);
  }
  follow(knot) {
    const dx = knot.coord.x - this.coord.x;
    const dy = knot.coord.y - this.coord.y;
    const xDiff = Math.abs(dx);
    const yDiff = Math.abs(dy);

    if (xDiff > 1 || yDiff > 1) {
      if (dx > 0) this.coord.x += 1;
      if (dx < 0) this.coord.x -= 1;
      if (dy > 0) this.coord.y += 1;
      if (dy < 0) this.coord.y -= 1;
    }
  }
  isTouching(otherEnd) {
    const xDiff = Math.abs(this.coord.x - otherEnd.coord.x);
    const yDiff = Math.abs(this.coord.y - otherEnd.coord.y);
    const samePlace = xDiff === 0 && yDiff === 0;
    return (xDiff <= 1 && yDiff <= 1) || samePlace;
  }
  isDiagonal(otherEnd) {
    const xDiff = Math.abs(this.coord.x - otherEnd.coord.x);
    const yDiff = Math.abs(this.coord.y - otherEnd.coord.y);
    return xDiff >= 1 && yDiff >= 1;
  }
}

const text = fs.readFileSync(new URL("./input.txt", import.meta.url), "utf8");
const lines = text.split("\n");

const task1 = () => {
  const visited = [];
  const head = new RopeKnot(new Coord(0, 0), "head");
  const tail = new RopeKnot(new Coord(0, 0), "tail", head);
  for (const line of lines) {
    const [direction, steps] = line.split(" ");
    const stepsNum = parseInt(steps);

    for (let i = 0; i < stepsNum; i++) {
      const lastHeadPosition = new Coord(head.coord.x, head.coord.y);
      head.moveDirection(direction);
      if (!tail.isTouching(head)) {
        if (tail.isDiagonal(head)) {
          tail.moveToCoord(lastHeadPosition);
        } else {
          tail.moveDirection(direction);
        }
      }
      const tailCoords = tail.coord.toString();
      if (!visited.includes(tailCoords)) visited.push(tailCoords);
    }
  }
  return visited.length;
};

const task2 = () => {
  const visited = [];
  const head = new RopeKnot(new Coord(0, 0), "head");
  let previousKnot = head;
  const knots = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
    const knot = new RopeKnot(new Coord(0, 0), `knot #${n}`, previousKnot);
    previousKnot = knot;
    return knot;
  });

  for (const line of lines) {
    const [direction, steps] = line.split(" ");
    const stepsNum = parseInt(steps);

    for (let i = 0; i < stepsNum; i++) {
      head.moveDirection(direction);
      knots.forEach((knot) => knot.follow(knot.head));
      const tailCoords = knots.at(-1).coord.toString();
      if (!visited.includes(tailCoords)) visited.push(tailCoords);
    }
  }
  return visited.length;
};

console.log("Task1: ", task1());
console.log("Task2: ", task2());
