package day17

import println
import readInput
import kotlin.math.pow

data class OperationOutput(val out: Int? = null, val newPointer: Int? = null)

fun main() {
    val part1Expected = "4,6,3,5,6,3,5,2,1,0"
    val part2Expected = 1


    fun part1(input: String): String {
        println()
        val (registerList, instructionsString) = input.split("\n\n")
        val registers = registerList.lines().associate {
            val (registerName, value) = Regex("""Register (\w): (\d+)""").find(it)!!.destructured
            Pair(registerName.first(), value.toLong())
        }.toMutableMap()

        fun getRegister(char: Char) = when (char) {
            in registers -> registers[char]!!
            else -> error("$char not found in registers $registers")
        }

        registers.println("Registers")
        instructionsString.println("Instructions")

        fun getCombo(operand: Int) = when (operand) {
            in 0..3 -> operand.toLong()
            4 -> getRegister('A')
            5 -> getRegister('B')
            6 -> getRegister('C')
            7 -> throw IllegalArgumentException("7 is reserved, shouldn't have shown up as combo")
            else -> error("Unknown operand $operand")
        }

        /** Might return new pointer location */
        fun runOperand(opcode: Int, operand: Int): OperationOutput? {
            when (opcode) {
                0 -> {
                    registers['A'] = getRegister('A').div(2f.pow(operand)).toLong()
                }

                1 -> {
                    registers['B'] = getRegister('B').xor(operand.toLong())
                }

                2 -> {
                    val combo = getCombo(operand)
                    val result = combo.mod(8)
                    registers['B'] = result.toLong()
                }

                3 -> {
                    val a = registers['A']
                    if (a == 0L) return null
                    return OperationOutput(newPointer = operand)
                }

                4 -> {
                    registers['B'] = getRegister('B').xor(getRegister('C'))
                }

                5 -> {
                    return OperationOutput(out = getCombo(operand).mod(8))
                }

                6 -> {
                    registers['B'] = getRegister('A').div(2f.pow(operand)).toLong()
                }

                7 -> {
                    registers['C'] = getRegister('A').div(2f.pow(operand)).toLong()
                }

            }
            return null
        }

        val instructionPairs = instructionsString.split("Program: ").last().split(",").map { it.toInt() }.zipWithNext()
        var pointer = 0
        val result = mutableListOf<Int>()
        while (true) {
            val (opcode, operand) = instructionPairs.getOrNull(pointer) ?: break
            val output = runOperand(opcode, operand)
            if (output?.out != null) result.add(output.out)
            if (output?.newPointer != null) pointer = output.newPointer
            else pointer += 2
        }

        println("Program finished, registers are now $registers")
        return result.joinToString(",")
    }


    fun part2(input: String): Int {
        return 1
    }

    part1(readInput("simple-test")).println("Part 1 simple test")

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = readInput("test")
    val part1Result = part1(testInput)
    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }

    // Read the input from the `src/Day01.txt` file.
    val input = readInput("input")
    part1(input).println("part1 (is not 1,0,4,2,7,4,1,7,2)") // Not 1,0,4,2,7,4,1,7,2

    val part2Result = part2(testInput)
    check(part2Result == part2Expected) { "expected $part2Expected, got $part2Result" }

    part2(input).println("part2")
}
