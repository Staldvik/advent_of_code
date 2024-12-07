package day07

import println
import readInput

enum class Operator {
    Plus,
    Multiply,
    Concatinate
}

fun main() {
    val part1Expected = 3749L
    val part2Expected = 11387L


    fun calculate(operator: Operator, numbers: Pair<Long, Long>): Long {
        return when (operator) {
            Operator.Multiply -> numbers.first * numbers.second
            Operator.Plus -> numbers.first + numbers.second
            Operator.Concatinate -> "${numbers.first}${numbers.second}".toLong()
        }
    }

    fun generateCombinations(
        operators: List<Operator>,
        numbers: List<Long>,
        result: List<Operator> = emptyList(),
    ): List<List<Operator>> {
        if (result.size == numbers.size - 1) {
            return listOf(result)
        }
        return operators.flatMap { operator ->
            generateCombinations(operators, numbers, result + operator)
        }
    }


    fun trySolve(operators: List<Operator>, wantedResult: Long, numbers: List<Long>): Boolean {
        val combinations = generateCombinations(operators, numbers)
        return combinations.any() { combination ->
            var result: Long = numbers.get(0)
            var i = 1
            for (operator in combination) {
                result = calculate(operator, Pair(result, numbers.get(i)))
                i++
            }
            result == wantedResult
        }
    }

    fun part1(input: List<String>): Long {
        val lines = input.map { line ->
            val (equationString, equation) = line.split(": ")
            val equationResult = equationString.toLong()
            val equationNumbers = equation.split(" ").map { it.toLong() }
            Pair(equationResult, equationNumbers)
        }

        lines.println("lines")

        val validResults = lines.filter { (equationResult, equationNumbers) ->
            trySolve(listOf(Operator.Plus, Operator.Multiply), equationResult, equationNumbers)
        }

        validResults.println("Valid results")

        validResults.sumOf { it.first }.println("result")
        return validResults.sumOf { it.first }
    }

    fun part2(input: List<String>): Long {
        val lines = input.map { line ->
            val (equationString, equation) = line.split(": ")
            val equationResult = equationString.toLong()
            val equationNumbers = equation.split(" ").map { it.toLong() }
            Pair(equationResult, equationNumbers)
        }

        lines.println("lines")

        val validResults = lines.filter { (equationResult, equationNumbers) ->
            trySolve(listOf(Operator.Plus, Operator.Multiply, Operator.Concatinate), equationResult, equationNumbers)
        }

        validResults.println("Valid results")

        validResults.sumOf { it.first }.println("result")
        return validResults.sumOf { it.first }
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

