import { getInputFile, getTestFile, testSolution } from "../utils";

const testFile = getTestFile(__dirname);
const inputFile = getInputFile(__dirname);

/** Higher index is higher value */
const cardValues = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
].reverse();

const cardValues2 = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
].reverse();

const getHandRank = (hand: string, acceptJoker = false) => {
  const cards = hand.split(" ")[0].split("");
  const cardMap: Record<string, number> = {};
  cards.forEach((card) => {
    cardMap[card] = (cardMap[card] || 0) + 1;
  });
  const cardCounts = Object.values(cardMap);

  // Five of a kind
  if (cardCounts.some((count) => count === 5)) return 7;
  // Four of a kind
  if (cardCounts.some((count) => count === 4)) return 6;

  // Full house
  if (
    (cardCounts[0] === 2 && cardCounts[1] === 3) ||
    (cardCounts[0] === 3 && cardCounts[1] === 2)
  ) {
    return 5;
  }

  // Three of a kind
  if (cardCounts.some((count) => count === 3)) return 4;

  // Two pairs
  const amountOfPairs = cardCounts.reduce(
    (pairs, count) => (count === 2 ? pairs + 1 : pairs),
    0
  );
  if (amountOfPairs === 2) return 3;
  if (amountOfPairs === 1) return 2;
  if (Object.keys(cardMap).length === 5) return 1;

  throw new Error(`Had a hard time ranking hand: ${hand}`);
};

const part1 = (input: string) => {
  const lines = input.split("\n");

  const ranked = lines.toSorted((line1, line2) => {
    const hand1 = line1.split(" ").at(0)!;
    const hand2 = line2.split(" ").at(0)!;
    const diff = getHandRank(hand1) - getHandRank(hand2);
    if (diff !== 0) return diff;
    for (let i = 0; i < 5; i++) {
      const c1 = hand1[i];
      const c2 = hand2[i];
      if (c1 === c2) continue;
      if (cardValues.indexOf(c2) > cardValues.indexOf(c1)) return -1;
      return 1;
    }

    throw new Error(`Got two hands here that's equal! ${line1} ${line2}`);
  });

  const total = ranked.reduce((acc, hand, i) => {
    const bet = Number(hand.split(" ")[1]);
    return acc + bet * (i + 1);
  }, 0);

  return total;
};

const highestRankMap = new Map<string, number>();
const getHighestRank = (hand: string) => {
  if (!hand.includes("J")) return getHandRank(hand);
  const cacheHit = highestRankMap.get(hand);
  if (cacheHit) return cacheHit;
  const jIndices = hand.split("").flatMap((card, i) => (card === "J" ? i : []));

  let highestRank = 0;

  const testReplacement = (hand: string, i: number) => {
    if (i === jIndices.length) {
      const handRank = getHandRank(hand);
      highestRank = Math.max(handRank, highestRank);
      return;
    }

    for (const substitution of cardValues2) {
      const newHand = hand.split("").with(jIndices[i], substitution).join("");
      testReplacement(newHand, i + 1);
    }
  };

  testReplacement(hand, 0);

  highestRankMap.set(hand, highestRank);
  return highestRank;
};

const part2 = (input: string) => {
  const lines = input.split("\n");

  const ranked = lines.toSorted((line1, line2) => {
    const hand1 = line1.split(" ").at(0)!;
    const hand2 = line2.split(" ").at(0)!;
    const diff = getHighestRank(hand1) - getHighestRank(hand2);
    if (diff !== 0) return diff;
    for (let i = 0; i < 5; i++) {
      const c1 = hand1[i];
      const c2 = hand2[i];
      if (c1 === c2) continue;
      if (cardValues2.indexOf(c2) > cardValues2.indexOf(c1)) return -1;
      return 1;
    }

    throw new Error(`Got two hands here that's equal! ${line1} ${line2}`);
  });

  const total = ranked.reduce((acc, hand, i) => {
    const bet = Number(hand.split(" ")[1]);
    return acc + bet * (i + 1);
  }, 0);

  return total;
};

testSolution("6440", part1, testFile);
testSolution("5905", part2, testFile);

console.log("Part 1:", part1(inputFile));
console.log("Part 2:", part2(inputFile));
