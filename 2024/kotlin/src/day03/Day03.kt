package day03

import println
import readInput


fun main() {
    val part1Expected = 161
    val part2Expected = 48

    fun findMultiplications(line: String) = Regex("mul\\(\\d{1,3},\\d{1,3}\\)").findAll(line)

    fun runMultiplication(string: String): Int {
        val result = "\\d{1,3},\\d{1,3}".toRegex().find(string) ?: return 0
        val (leftNum, rightNum) = result.value.split(",")
        return leftNum.toInt() * rightNum.toInt()
    }

    fun part1(input: List<String>): Int {
        return input.sumOf { line ->
            findMultiplications(line).sumOf { mulMatch ->
                runMultiplication(mulMatch.value)
            }
        }
    }

    fun part2(input: List<String>): Int {
        val longLine = input.joinToString("")

        return findMultiplications(longLine).sumOf { mul ->
            val lineUntilNow = longLine.substring(0, mul.range.first)
            val lastDisable = lineUntilNow.lastIndexOf("don't()")
            val lastEnable = lineUntilNow.lastIndexOf("do()")

            val isDisabled = lastDisable > lastEnable

            if (!isDisabled) runMultiplication(mul.value) else 0
        }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = readInput("test")
    check(part1(testInput) == part1Expected)

    val test2Input = readInput("test2")
    check(part2(test2Input) == part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = readInput("input")
    part1(input).println("part1")
    part2(input).println("part2") // 89912299 not correct
}
