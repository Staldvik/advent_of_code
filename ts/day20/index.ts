const ex = await Deno.readTextFile(new URL("./ex.txt", import.meta.url));
const input = await Deno.readTextFile(new URL("./input.txt", import.meta.url));

const task1 = (input: string) => {
  const nums = input.split("\n").map((n) => parseInt(n));

  const moved: number[] = [];

  let i = 0;
  while (moved.length !== nums.length) {
    const currentNum = nums[i];
    const direction = currentNum > 0 ? "forward" : "back";
    const steps = Math.abs(currentNum);
    let newIndex: number;
    if (direction === "forward" && i + steps > nums.length) {
      newIndex = nums.length - (i + (steps % nums.length));
    } else if (direction === "back" && i - steps < 0) {
    }
    nums.splice(i + steps);
    i++;
  }
};

const task2 = (input: string) => {};

console.log("Task1(ex): ", task1(ex));
console.log("Task1(input): ", task1(input));

console.log("Task2(ex): ", task2(ex));
console.log("Task2(input): ", task2(input));
