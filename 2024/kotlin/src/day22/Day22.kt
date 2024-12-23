package day22

import parseInput
import println


fun main() {
    val part1Expected = 1L
    val part2Expected = 1

    fun part1(input: List<String>): Long {
        val buyerMap = input.withIndex().associate { (index, it) -> Pair(index, it.toLong()) }.toMutableMap()

        for (i in 1..2000) {
            for ((buyer, secretNumber) in buyerMap) {
                val step1 = (secretNumber * 64).xor(secretNumber).mod(16777216)
                val step2 = (step1 / 32).xor(step1).mod(16777216)
                val step3 = (step2 * 2048).xor(step2).mod(16777216).toLong()
                buyerMap[buyer] = step3
            }
        }

        return buyerMap.values.sum()
    }

    fun part2(input: List<String>): Int {
        return 1
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("test")
    val part1Result = part1(testInput)
    check(part1Result == 37327623L) { "expected $part1Expected, got $part1Result" }

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    part1(input).println("part1")

    val part2Result = part2(testInput)
    check(part2Result == part2Expected) { "expected $part2Expected, got $part2Result" }

    part2(input).println("part2")
}
