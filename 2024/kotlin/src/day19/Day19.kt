package day19

import println
import readInput


fun main() {
    val part1Expected = 6
    val part2Expected = 16

    fun part1(input: String): Int {
        val (towelsString, desiredDesignsString) = input.split("\n\n")
        val towels = towelsString.split(", ")
        val desiredDesigns = desiredDesignsString.lines()

        fun findTowels(design: String, fromIndex: Int): List<String> {
            val result = towels.filter {
                design.substring(fromIndex..<design.count()).startsWith(it)
            }
            return result
        }

        fun buildDesign(design: String, towels: List<String>): Boolean {
            val currentDesign = towels.joinToString("")
            if (currentDesign == design) return true
            if (currentDesign.count() >= design.count()) return false
            for (possibleTowel in findTowels(design, currentDesign.count())) {
                if (buildDesign(design, towels + possibleTowel)) return true
            }
            return false
        }

        return desiredDesigns.count { design ->
            val startTowels = findTowels(design, 0)
            for (startingTowel in startTowels) {
                val complete = buildDesign(design, mutableListOf(startingTowel))
                if (complete) return@count true
            }
            return@count false
        }

    }

    fun part2(input: String): Int {
        val (towelsString, desiredDesignsString) = input.split("\n\n")
        val towels = towelsString.split(", ")
        towels.println()
        val desiredDesigns = desiredDesignsString.lines()

        fun findTowels(design: String, fromIndex: Int): List<String> {
            val result = towels.filter {
                val restOfDesign = design.substring(fromIndex..<design.count())
                restOfDesign.println("Rest of design")
                restOfDesign.startsWith(it)
            }
            result.println("Fitting towels")

            return result
        }
        
        fun buildDesign(design: String, towels: List<String>, result: MutableList<List<String>>): List<String>? {
            val currentDesign = towels.joinToString("")
            if (currentDesign == design) return towels
            if (currentDesign.count() >= design.count()) return null
            for (possibleTowel in findTowels(design, currentDesign.count())) {
                val validCombination = buildDesign(design, towels + possibleTowel, result)
                if (validCombination !== null) result.add(validCombination)
            }
            return null
        }

        return desiredDesigns.sumOf { design ->
            val result = mutableListOf<List<String>>()
            buildDesign(design, listOf(), result)

            result.println("For design $design")
            result.count()
        }
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = readInput("test")
    val part1Result = part1(testInput)
    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }

    // Read the input from the `src/Day01.txt` file.
    val input = readInput("input")
    part1(input).println("part1")

    val part2Result = part2(testInput)
    check(part2Result == part2Expected) { "expected $part2Expected, got $part2Result" }

    part2(input).println("part2")
}
