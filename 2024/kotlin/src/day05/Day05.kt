package day05

import println
import readInput


fun main() {
    val part1Expected = 143
    val part2Expected = 123

    fun part1(input: List<String>): Int {
        val rules = input.takeWhile { it != "" }.map {
            val (first, second) = it.split("|").map { char -> char.toInt() }
            Pair(first, second)
        }

        val updates = input.takeLastWhile { it != "" }.map { updatesLine -> updatesLine.split(",").map { it.toInt() } }

        val validUpdates = updates.filter { updateLine ->
            updateLine.withIndex().all { (index, updateNumber) ->
                val ruleHits = rules.filter { it.first == updateNumber || it.second == updateNumber }
                val (mustBeBefore, mustBeAfter) = ruleHits.partition { it.first == updateNumber }
                val isBeforeAll = mustBeBefore.all { (_, compareNum) ->
                    val compareNumIndex = updateLine.indexOf(compareNum)
                    if (compareNumIndex == -1) true else index < compareNumIndex
                }
                val isAfterAll = mustBeAfter.all { (compareNum) ->
                    val compareNumIndex = updateLine.indexOf(compareNum)
                    if (compareNumIndex == -1) true else index > compareNumIndex
                }
                isBeforeAll && isAfterAll
            }
        }

        return validUpdates.sumOf { it[it.count() / 2] }
    }

    fun part2(input: List<String>): Int {
        val rules = input.takeWhile { it != "" }.map {
            val (first, second) = it.split("|").map { char -> char.toInt() }
            Pair(first, second)
        }

        val updates = input.takeLastWhile { it != "" }.map { updatesLine -> updatesLine.split(",").map { it.toInt() } }

        val (validUpdates, invalidUpdates) = updates.partition { updateLine ->
            updateLine.withIndex().all { (index, updateNumber) ->
                val ruleHits = rules.filter { it.first == updateNumber || it.second == updateNumber }
                val (mustBeBefore, mustBeAfter) = ruleHits.partition { it.first == updateNumber }
                val isBeforeAll = mustBeBefore.all { (_, compareNum) ->
                    val compareNumIndex = updateLine.indexOf(compareNum)
                    if (compareNumIndex == -1) true else index < compareNumIndex
                }
                val isAfterAll = mustBeAfter.all { (compareNum) ->
                    val compareNumIndex = updateLine.indexOf(compareNum)
                    if (compareNumIndex == -1) true else index > compareNumIndex
                }
                isBeforeAll && isAfterAll
            }
        }

        val correctedUpdates = invalidUpdates.map { updateLine ->
            updateLine.withIndex().sortedBy { (index, updateNumber) ->
                val ruleHits = rules.filter {
                    val isFirst = it.first == updateNumber && updateLine.contains(it.second)
                    val isSecond = it.second == updateNumber && updateLine.contains(it.first)

                    isFirst || isSecond
                }
                val (mustBeBefore, mustBeAfter) = ruleHits.partition { it.first == updateNumber }
                mustBeAfter.count() - mustBeBefore.count()
            }.map { it.value }
        }

        return correctedUpdates.sumOf { it[it.count() / 2] }
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
