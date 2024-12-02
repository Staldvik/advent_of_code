package day02

import println
import readInput
import kotlin.math.abs

fun main() {
    val part1Expected = 2
    val part2Expected = 4

    fun isSafe(report: List<Int>): Boolean {
        var increasingLevels: Boolean? = null
        return report.withIndex().all { (index, currentLevel) ->
            if (index == 0) return@all true
            val previousLevel = report[index - 1]
            if (currentLevel == previousLevel) return@all false

            val isIncrease = currentLevel - previousLevel > 0

            if (increasingLevels == null) {
                increasingLevels = isIncrease
            }

            val isSafeDistance = abs(currentLevel - previousLevel) <= 3

            isSafeDistance && (isIncrease && increasingLevels == true || !isIncrease && increasingLevels == false)
        }
    }

    fun part1(input: List<String>): Int {
        return input.count() { report ->
            val levels = report.split(" ").map { it.toInt() }
            isSafe(levels)
        }
    }

    fun part2(input: List<String>): Int {
        return input.count() { report ->
            val levels = report.split(" ").map { it.toInt() }

            for (removeIndex in 0..levels.count()) {
                val levelsWithRemovedNum = levels.filterIndexed() { index, _ ->
                    index != removeIndex
                }

                val safe = isSafe(levelsWithRemovedNum)

                if (safe) {
                    return@count true
                }
            }

            return@count false
        }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = readInput("test")
    val testResult = part1(testInput)
    testResult.println("part1 test")
    check(testResult == part1Expected)

    val part2Test = part2(testInput)
    part2Test.println("part2 test")
    check(part2Test == part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = readInput("input")
    part1(input).println("part1")
    part2(input).println("part2") // 621 too low
}
