package day01

import allIndexesOf
import println
import readInput

data class Candidate(val index: Int, val value: Int)

val wordToNumber = mapOf(
    "one" to 1,
    "two" to 2,
    "three" to 3,
    "four" to 4,
    "five" to 5,
    "six" to 6,
    "seven" to 7,
    "eight" to 8,
    "nine" to 9
)

fun main() {
    fun part1(input: List<String>): Int {
        val numbers = input.map { line ->
            val digits = line.filter { it.isDigit() }
            "${digits.first()}${digits.last()}".toInt()
        }

        return numbers.sum()
    }


    fun part2(input: List<String>): Int {
        val numbers = input.map { line ->
            val digitCandidates = line.withIndex().mapNotNull { (index, char) ->
                if (char.isDigit()) Candidate(index, char.digitToInt())
                else null
            }

            val wordCandidates = wordToNumber.entries.flatMap { (numberWord, value) ->
                line.allIndexesOf(numberWord).map { Candidate(it, value) }
            }

            val allCandidates = digitCandidates + wordCandidates

            val first = allCandidates.minBy { it.index }.value
            val last = allCandidates.maxBy { it.index }.value

            "$first$last".toInt()
        }

        return numbers.sum()
    }


    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = readInput("test")
    check(part1(testInput) == 142)
    
    val test2Input = readInput("test2")
    val test2Ans = part2(test2Input)
    check(test2Ans == 281)


    // Read the input from the `src/Day01.txt` file.
    val input = readInput("input")
    part1(input).println("part1")
    part2(input).println("part2")
}
