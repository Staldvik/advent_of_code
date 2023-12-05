import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

const getSpaceSeparatedNumbers = (nums: string) =>
  nums.split(" ").filter(Boolean).map(Number);

const part1 = (input: string) => {
  const lines = input.split("\n");

  let sum = 0;
  for (const line of lines) {
    const [winners = [], given = []] = line
      .split(":")[1]!
      .split("|")
      .map(getSpaceSeparatedNumbers);

    const matches = given.filter((num) => winners.includes(num));

    if (matches.length) {
      sum += 2 ** (matches.length - 1);
    }
  }

  return sum;
};

const parseId = (card: string) => {
  let [cardString] = card.split(":");
  cardString = cardString!.replace("Card", "").trim();
  return parseInt(cardString);
};

const part2 = (input: string) => {
  const lines = input.split("\n");

  let sum = 0;
  const cardCopies: Record<number, number> = {};
  for (const card of lines) {
    const id = parseId(card);
    const copies = cardCopies[id] || 1;

    const [winners = [], given = []] = card
      .split(":")[1]!
      .split("|")
      .map(getSpaceSeparatedNumbers);

    const matches = given.filter((num) => winners.includes(num));

    matches.forEach((match, i) => {
      cardCopies[id + i + 1] = (cardCopies[id + i + 1] || 1) + 1 * copies;
    });

    sum += copies;
  }

  return sum;
};

testSolution("13", part1, testFile);
testSolution("30", part2, testFile);

console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile));
