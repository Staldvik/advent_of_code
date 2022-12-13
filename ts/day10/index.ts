const text = await Deno.readTextFile(new URL("./input.txt", import.meta.url));
const lines = text.split("\n");

const task1 = () => {
  const importantCycles = [20, 60, 100, 140, 180, 220];
  let cycle = 0;
  let x = 1;
  let sum = 0;
  for (const line of lines) {
    let instructionCycles = 0;
    const [instruction, value] = line.split(" ");
    const valueNum = parseInt(value);

    while (true) {
      cycle++;
      instructionCycles++;
      if (importantCycles.includes(cycle)) {
        const signalStrength = cycle * x;
        sum += signalStrength;
      }
      if (instruction === "noop" && instructionCycles === 1) {
        break;
      }
      if (instruction === "addx" && instructionCycles === 2) {
        x += valueNum;
        break;
      }
    }
  }
  return sum;
};

const task2 = () => {
  let cycle = 0;
  let x = 1;
  let spritePosition = [0, 1, 2];
  const screen: string[][] = [[], [], [], [], [], []];
  for (const line of lines) {
    let instructionCycles = 0;
    const [instruction, value] = line.split(" ");
    const valueNum = parseInt(value);

    while (true) {
      const y = Math.floor(cycle / 40);
      const linePos = cycle % 40;
      const currentLine = screen[y];
      spritePosition = [x - 1, x, x + 1];
      currentLine.push(spritePosition.includes(linePos) ? "#" : ".");

      cycle++;
      instructionCycles++;

      if (instruction === "noop" && instructionCycles === 1) {
        break;
      }
      if (instruction === "addx" && instructionCycles === 2) {
        x += valueNum;
        break;
      }
    }
  }

  // print screen
  for (const line of screen) {
    console.log(line.join(""));
  }
  return "See above";
};

console.log("Task1: ", task1());
console.log("Task2: ", task2());
