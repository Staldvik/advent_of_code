import fs from "fs";

const text = fs.readFileSync(new URL("./input.txt", import.meta.url), "utf8");

const task1 = () => {};

const task2 = () => {};

console.log("Task1: ", task1());
console.log("Task2: ", task2());
