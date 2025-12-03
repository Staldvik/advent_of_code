package day02

import utils.parseInput


fun main() {
    val part1Expected = 1227775554L
    val part2Expected = 4174379265L

    fun ranges(input: List<String>): List<LongRange> {
        val line = input.first();
        val idRanges = line.split(",").map { range ->
            val (from, to) = range.split("-").map { it.toLong() }
            from.rangeTo(to)
        }
        return idRanges
    }

    fun part1(input: List<String>): Long {
        val idRanges = ranges(input)

        return idRanges.sumOf { range ->
            var sum = 0L;
            range.forEach { id ->
                val idLength = id.toString().length
                if (idLength % 2 == 0) {
                    val (first, last) = id.toString().let { Pair(it.take(idLength / 2), it.drop(idLength / 2)) }
                    if (first == last) {
                        sum += id
                    }
                }
            }
            sum;
        }
    }

    fun part2(input: List<String>): Long {
        val idRanges = ranges(input)

        return idRanges.sumOf { range ->
            var sum = 0L;
            range.forEach { id ->
                val idString = id.toString()
                var n = 1;
                while (n <= idString.length / 2) {
                    val part = idString.take(n);
                    if (part.repeat(idString.length / n) == idString) {
                        sum += id
                        return@forEach
                    }
                    n++
                }

            }
            sum;
        }

    }

    fun testSolution(solver: (List<String>) -> Long, input: List<String>, expected: Long) {
        val result = solver(input)
        check(result == expected) { "Expected $expected but got $result" }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("test")
    testSolution(::part1, testInput, part1Expected)
    testSolution(::part2, testInput, part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    testSolution(::part1, input, 13108371860L)
    testSolution(::part2, input, 22471660255L)
}
