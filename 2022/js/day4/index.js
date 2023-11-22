import fs from "fs";

const text = fs.readFileSync(new URL("./input.txt", import.meta.url), "utf8");

const task1 = () => {
  let sum = 0;
  text.split("\n").forEach((row, i) => {
    const [elf1, elf2] = row
      .split(",")
      .map((elf) => elf.split("-").map((n) => Number(n)));
    if (elf1[0] >= elf2[0] && elf1[1] <= elf2[1]) {
      sum++;
    } else if (elf2[0] >= elf1[0] && elf2[1] <= elf1[1]) {
      sum++;
    }
  });
  return sum;
};

const task2 = () => {
  let sum = 0;
  text.split("\n").forEach((row, i) => {
    const [elf1, elf2] = row
      .split(",")
      .map((elf) => elf.split("-").map((n) => Number(n)));
    if (elf1[0] >= elf2[0] && elf1[0] <= elf2[1]) {
      sum++;
    } else if (elf1[1] >= elf2[0] && elf1[1] <= elf2[1]) {
      sum++;
    } else if (elf1[0] >= elf2[0] && elf1[1] <= elf2[1]) {
      sum++;
    } else if (elf2[0] >= elf1[0] && elf2[1] <= elf1[1]) {
      sum++;
    }
  });
  return sum;
};

console.log("Task1:", task1());
console.log("Task2:", task2());
