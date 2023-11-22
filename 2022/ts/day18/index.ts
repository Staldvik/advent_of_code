const ex = await Deno.readTextFile(new URL("./ex.txt", import.meta.url));
const input = await Deno.readTextFile(new URL("./input.txt", import.meta.url));

const task1 = (input: string) => {
  const cubes = input
    .split("\n")
    .map((row) => row.split(",").map((s) => parseInt(s)));

  let sum = 0;
  cubes.forEach((cube) => {
    let sides = 6;
    ["up", "down", "left", "right", "front", "back"].forEach((side) => {
      if (side === "up") {
        if (
          cubes.some(
            (c) =>
              c !== cube &&
              c[1] === cube[1] + 1 &&
              c[0] === cube[0] &&
              c[2] === cube[2]
          )
        )
          sides--;
      }
      if (side === "down") {
        if (
          cubes.some(
            (c) =>
              c !== cube &&
              c[1] === cube[1] - 1 &&
              c[0] === cube[0] &&
              c[2] === cube[2]
          )
        )
          sides--;
      }
      if (side === "left") {
        if (
          cubes.some(
            (c) =>
              c !== cube &&
              c[0] === cube[0] - 1 &&
              c[1] === cube[1] &&
              c[2] === cube[2]
          )
        )
          sides--;
      }
      if (side === "right") {
        if (
          cubes.some(
            (c) =>
              c !== cube &&
              c[0] === cube[0] + 1 &&
              c[1] === cube[1] &&
              c[2] === cube[2]
          )
        )
          sides--;
      }
      if (side === "front") {
        if (
          cubes.some(
            (c) =>
              c !== cube &&
              c[2] === cube[2] + 1 &&
              c[0] === cube[0] &&
              c[1] === cube[1]
          )
        )
          sides--;
      }
      if (side === "back") {
        if (
          cubes.some(
            (c) =>
              c !== cube &&
              c[2] === cube[2] - 1 &&
              c[1] === cube[1] &&
              c[0] === cube[0]
          )
        )
          sides--;
      }
    });
    sum += sides;
  });

  return sum;
};

const task2 = (input: string) => {};

console.log("Task1(ex): ", task1(ex));
console.log("Task1(input): ", task1(input));

// console.log("Task2(ex): ", task2(ex));
// console.log("Task2(input): ", task2(input));
