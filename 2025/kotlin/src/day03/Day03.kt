package day03

import utils.parseInput


fun List<Int>.maxBetween(afterIndex: Int, untilIndex: Int): Pair<Int, Int> {
    val slice = this.slice(afterIndex until untilIndex)
    val (index, max) = slice.withIndex().maxBy { it.value }
    return Pair(max, index + afterIndex)
}

fun main() {
    val part1Expected = 357L
    val part2Expected = 3121910778619

    fun parse(input: List<String>): List<List<Int>> {
        return input.map { line -> line.split("").map { ch -> ch.toInt() } }
    }

    fun part1(input: List<String>): Long {
        val banks = parse(input)
        return banks.sumOf { bank ->
            val (first, firstIndex) = bank.maxBetween(0, bank.size - 1)
            val (second, secondIndex) = bank.maxBetween(firstIndex + 1, bank.size)
            "$first$second".toLong()
        }
    }

    fun part2(input: List<String>): Long {
        val banks = parse(input)
        return banks.sumOf { bank ->
            val (first, firstIndex) = bank.maxBetween(0, bank.size - 12)
            var num = "$first"

            var prevIndex = firstIndex
            while (num.length < 12) {
                val (next, nextIndex) = bank.maxBetween(prevIndex + 1, bank.size - (12 - num.length - 1))
                num += next
                prevIndex = nextIndex
            }
            num.toLong()
        }
    }

    fun testSolution(solver: (List<String>) -> Long, input: List<String>, expected: Long) {
        val result = solver(input)
        check(result == expected) { "Expected $expected but got $result" }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("example1")
    testSolution(::part1, testInput, part1Expected)
    testSolution(::part2, testInput, part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    testSolution(::part1, input, 17087) // 9737 too low
    testSolution(::part2, input, 169019504359949)
}
