package day03

import utils.parseInput


fun main() {
    val part1Expected = 357L
    val part2Expected = 3121910778619

    fun biggestAfter(list: List<Int>, afterIndex: Int, untilIndex: Int): Pair<Int, Int> {
        val slice = list.slice(afterIndex until untilIndex)
        val max = slice.maxOrNull() ?: return Pair(-1, 0)
        val index = slice.indexOfFirst { it == max }
        return Pair(max, index + afterIndex)
    }

    fun parse(input: List<String>): MutableMap<Int, MutableList<Int>> {
        var map = mutableMapOf<Int, MutableList<Int>>()
        input.forEachIndexed { index, line ->
            line.forEach { c ->
                map.putIfAbsent(index, mutableListOf())
                map[index]?.add(c.digitToInt())
            }
        }
        return map
    }

    fun part1(input: List<String>): Long {
        var map = parse(input)


        return map.values.sumOf { list ->
            val (first, firstIndex) = biggestAfter(list, 0, list.size - 1)
            val (second, secondIndex) = biggestAfter(list, firstIndex + 1, list.size)
            "$first$second".toLong()
        }
    }

    fun part2(input: List<String>): Long {
        val map = parse(input)

        return map.values.sumOf { list ->
            val (first, firstIndex) = biggestAfter(list, 0, list.size - 12)
            var num = "$first"

            var prevIndex = firstIndex
            while (num.length < 12) {
                val (next, nextIndex) = biggestAfter(list, prevIndex + 1, list.size - (12 - num.length - 1))
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
