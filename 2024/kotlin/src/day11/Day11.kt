package day11

import println
import readInput
import java.util.*


fun main() {
    val part1Expected = 55312
    val part2Expected = 55312

    fun applyRule(stone: Long): List<Long> {
        return when {
            stone == 0L -> listOf(1)
            stone.toString().count() % 2 == 0 -> {
                val stoneString = stone.toString()
                val split = stoneString.chunked(stoneString.count() / 2).map { it.toLong() }
                split
            }

            else -> listOf(stone * 2024L)
        }
    }

    fun part1(input: List<String>): Int {
        var stones = input.first().split(" ").map { it.toLong() }

        for (blinkI in 1..25) {
            stones = stones.flatMap { applyRule(it) }
        }

        return stones.count()
    }

    /**
     * Plan: Do one and one stone. Find how many stones that results in before going to next stone
     * Optimalization could be to check for existing stone results, but that requires recursion and I don't want to unless I have to
     *
     * Fail 1 - Takes too much space, possibly all the copying going on
     *
     * What if I do a LinkedList and just add onto it?
     */

    fun part2(input: List<String>): Int {
        val stones = LinkedList(input.first().split(" ").map { it.toLong() })

        for (blinkI in 1..75) {
            val currentSize = stones.count()
            (0..<currentSize).forEach { index ->
                val stone = stones[index]
                val stoneResult = applyRule(stone)
                stones[index] = stoneResult[0]
                val possibleSibling = stoneResult.getOrNull(1)
                if (possibleSibling != null) {
                    stones.add(possibleSibling)
                }
            }
        }

        return stones.count()
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = readInput("test")
    check(part1(testInput) == part1Expected)
    check(part2(testInput) == part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = readInput("input")
    part1(input).println("part1")
    part2(input).println("part2")
}
