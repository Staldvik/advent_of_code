package day05

import parseInput
import println

fun main() {
    val part1Expected = 143
    val part2Expected = 123

    fun getRules(input: List<String>) = input.takeWhile { line -> line != "" }.map { ruleLine ->
        val (first, second) = ruleLine.split("|").map { it.toInt() }
        Pair(first, second)
    }

    fun getUpdates(input: List<String>) =
        input.takeLastWhile { line -> line != "" }.map { updatesLine -> updatesLine.split(",").map { it.toInt() } }

    fun findRuleHits(rules: List<Pair<Int, Int>>, num: Int, update: List<Int>) = rules.filter {
        val isFirst = it.first == num && update.contains(it.second)
        val isSecond = it.second == num && update.contains(it.first)
        isFirst || isSecond
    }

    fun part1(input: List<String>): Int {
        val rules = getRules(input)
        val updates = getUpdates(input)

        val validUpdates = updates.filter { updateLine ->
            updateLine.withIndex().all { (index, updateNumber) ->
                val ruleHits = findRuleHits(rules, updateNumber, updateLine)
                val (mustBeBefore, mustBeAfter) = ruleHits.partition { it.first == updateNumber }
                val allBeforeRulesMet = mustBeBefore.all { index < updateLine.indexOf(it.second) }
                val allAfterRulesMet = mustBeAfter.all { index > updateLine.indexOf(it.first) }
                allBeforeRulesMet && allAfterRulesMet
            }
        }

        return validUpdates.sumOf { it[it.count() / 2] }
    }


    fun part2(input: List<String>): Int {
        val rules = getRules(input)
        val updates = getUpdates(input)

        val (validUpdates, invalidUpdates) = updates.partition { updateLine ->
            updateLine.withIndex().all { updateNumber ->
                val ruleHits = findRuleHits(rules, updateNumber.value, updateLine)
                val (mustBeBefore, mustBeAfter) = ruleHits.partition { it.first == updateNumber.value }
                val allBeforeRulesMet = mustBeBefore.all { updateNumber.index < updateLine.indexOf(it.second) }
                val allAfterRulesMet = mustBeAfter.all { updateNumber.index > updateLine.indexOf(it.first) }
                allBeforeRulesMet && allAfterRulesMet
            }
        }

        val correctedUpdates = invalidUpdates.map { updateLine ->
            updateLine.sortedBy { updateNumber ->
                val ruleHits = findRuleHits(rules, updateNumber, updateLine)
                val (mustBeBefore, mustBeAfter) = ruleHits.partition { it.first == updateNumber }
                mustBeAfter.count() - mustBeBefore.count()
            }
        }

        return correctedUpdates.sumOf { it[it.count() / 2] }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("test")
    check(part1(testInput) == part1Expected)
    check(part2(testInput) == part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    part1(input).println("part1")
    part2(input).println("part2")
}
