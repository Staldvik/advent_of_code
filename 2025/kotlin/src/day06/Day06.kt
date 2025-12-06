package day06

import utils.parseInput

fun main() {
    val part1Expected = 4277556L
    val part2Expected = 3263827L

    fun part1(input: List<String>): Long {
        val groups = input.map { it.split(" ").filter { it.isNotEmpty() } }
        val nums = groups.dropLast(1)
        val operations = groups.last()
        var sum = 0L;
        for (i in 0..<nums[0].size) {
            val initial = if (operations[i] == "*") 1L else 0L
            sum += nums.fold(initial) { acc, strings ->
                return@fold when (operations[i]) {
                    "*" -> acc * strings[i].toLong()
                    "+" -> acc + strings[i].toLong()
                    else -> {
                        throw Error("Unknown operation")
                    }
                }
            }
        }
        return sum
    }

    fun part2(input: List<String>): Long {
        assert(input.maxBy { it.length } == input.minBy { it.length })

        val columns = mutableListOf(-1)
        for (x in 0 until input[0].length) {
            val isEmptyColumn = (0 until input.size).all { input[it][x] == ' ' }
            if (isEmptyColumn) {
                columns.add(x)
            }
        }

        val nums = input.dropLast(1)
        val operations = input.last().split("").filter { it.isNotBlank() }

        var sum = 0L
        var startIndex = input[0].lastIndex
        for ((endIndex, operator) in columns.zip(operations).reversed()) {
            val problem = mutableListOf<Long>()
            for (x in startIndex downTo endIndex + 1) {
                var numString = ""
                for (y in 0 until nums.size) {
                    val char = input[y][x]
                    if (!char.isWhitespace()) {
                        numString += char
                    }
                }
                problem.add(numString.toLong())
            }
            val initial = if (operator == "*") 1L else 0L
            sum += problem.fold(initial) { acc, n ->
                when(operator) {
                    "*" -> acc * n
                    "+" -> acc + n
                    else -> { throw Error("Unknown operation") }
                }
            }
            startIndex = endIndex - 1
        }

        return sum
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
    testSolution(::part1, input, 7326876294741)
    testSolution(::part2, input, 10756006415204)
}
