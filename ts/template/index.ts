const text = await Deno.readTextFile(new URL("./input.txt", import.meta.url));
const ex = await Deno.readTextFile(new URL("./ex.txt", import.meta.url));

const task1 = (input: string) => {};

const task2 = (input: string) => {};

console.log("Ex: ", task1(ex));
console.log("Task1: ", task1(text));

console.log("Ex: ", task2(ex));
console.log("Task2: ", task2(text));
