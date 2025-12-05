package day05

import utils.Dir
import utils.Grid
import utils.Pos
import utils.parseInput
import utils.println

fun main() {
    val part1Expected = 3
    val part2Expected = 14L

    fun part1(input: List<String>): Int {
        val ranges = input.takeWhile { it.isNotEmpty() }.map { it.split("-") }.map { it[0].toLong()..it[1].toLong() }
        val ids = input.takeLastWhile { it.isNotEmpty() }.map { it.toLong() }
        ranges.println("ranges")
        ids.println("ids")

        return ids.count { id -> ranges.any { range -> id in range }}
    }

    fun part2(input: List<String>): Long {
        val ranges = input.takeWhile { it.isNotEmpty() }.map { it.split("-") }.map { it[0].toLong()..it[1].toLong() }
        val sortedRanges = ranges.sortedBy { it.first }
        var currStart = sortedRanges.first().first
        var currEnd = sortedRanges.first().last
        var count = 0L

        for (range in sortedRanges.drop(1)) {
            val overlaps = currEnd >= range.first
            val adjacent = range.first == currEnd + 1L

            if (overlaps || adjacent) {
                if (range.last > currEnd) currEnd = range.last
            } else {
                count += (currEnd - currStart + 1L)
                currStart = range.first
                currEnd = range.last
            }
        }

        count += (currEnd - currStart + 1L)

        return count
    }

    fun testSolution(solver: (List<String>) -> Int, input: List<String>, expected: Int) {
        val result = solver(input)
        check(result == expected) { "Expected $expected but got $result" }
    }

    fun testSolution2(solver: (List<String>) -> Long, input: List<String>, expected: Long) {
        val result = solver(input)
        check(result == expected) { "Expected $expected but got $result" }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("example1")
    testSolution(::part1, testInput, part1Expected)
    testSolution2(::part2, testInput, part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    testSolution(::part1, input, 505)
    testSolution2(::part2, input, 344423158480189) // 323231914337764 too low
}
