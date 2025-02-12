package day02

import utils.exceptIndex
import utils.parseInput
import utils.println
import kotlin.math.abs

fun main() {
    val part1Expected = 2
    val part2Expected = 4

    fun isReportSafe(levels: List<Int>): Boolean {
        var increasingLevels: Boolean? = null
        return levels.withIndex().all { (index, currentLevel) ->
            if (index == 0) return@all true
            val previousLevel = levels[index - 1]
            if (currentLevel == previousLevel) return@all false

            val isIncrease = currentLevel - previousLevel > 0

            if (increasingLevels == null) {
                increasingLevels = isIncrease
            }

            val isSafeDistance = abs(currentLevel - previousLevel) <= 3

            isSafeDistance && (isIncrease && increasingLevels == true || !isIncrease && increasingLevels == false)
        }
    }

    fun getReportLevels(report: String) = report.split(" ").map { it.toInt() }

    fun part1(input: List<String>): Int {
        return input.count() { report ->
            isReportSafe(getReportLevels(report))
        }
    }

    fun part2(input: List<String>): Int {
        return input.count() { report ->
            val levels = getReportLevels(report)
            levels.withIndex().any() { (removeIndex) ->
                isReportSafe(levels.exceptIndex(removeIndex))
            }
        }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("test")
    val testResult = part1(testInput)
    testResult.println("part1 test")
    check(testResult == part1Expected)

    val part2Test = part2(testInput)
    part2Test.println("part2 test")
    check(part2Test == part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    part1(input).println("part1")
    part2(input).println("part2") // 621 too low
}
