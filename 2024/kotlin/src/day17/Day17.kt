package day17

import println
import readInput
import kotlin.math.pow

data class Registers(var A: Long = 0, var B: Long = 0, var C: Long = 0) {
    companion object {
        fun from(input: Map<Char, Int>): Registers {
            throw NotImplementedError("Overloading could be nice instead of long method names?")
        }

        fun from(list: List<String>): Registers {
            val registers = Registers()
            list.forEach { line ->
                val (registerName, value) = Regex("""Register ([ABC]): (\d+)""").find(line)?.destructured
                    ?: error("Unable to parse $line")
                val registerChar = registerName.first()
                require(registerChar in 'A'..'C') { "Failed parsing, found unsupported register: $registerChar" }

                val registerValue = value.toLong()
                when (registerChar) {
                    'A' -> registers.A = registerValue
                    'B' -> registers.B = registerValue
                    'C' -> registers.C = registerValue
                }
            }
            return registers
        }
    }
}

data class OperationOutput(val out: Int? = null, val newPointer: Int? = null)

class Computer(private val registers: Registers, private val instructions: List<Int>) {
    companion object {
        fun fromInput(input: String): Computer {
            val (registersString, instructionsString) = input.split("\n\n")
            val registers = Registers.from(registersString.lines())
            val instructions = instructionsString.split("Program: ").last().split(",").map { it.toInt() }
            return Computer(registers, instructions)
        }
    }

    private fun runOperand(opcode: Int, operand: Int): OperationOutput? {
        fun getCombo(): Long = when (operand) {
            in 0..3 -> operand.toLong()
            4 -> registers.A
            5 -> registers.B
            6 -> registers.C
            7 -> throw IllegalArgumentException("7 is reserved, shouldn't have shown up as combo")
            else -> error("Unknown operand $operand")
        }

        fun getLiteral(): Long = operand.toLong()

        when (opcode) {
            0 -> registers.A = registers.A.div(2.0.pow(getCombo().toDouble())).toLong()
            1 -> registers.B = registers.B.xor(getLiteral())
            2 -> registers.B = getCombo().mod(8).toLong()
            3 -> return when {
                registers.A == 0L -> null
                else -> OperationOutput(newPointer = operand)
            }

            4 -> registers.B = registers.B.xor(registers.C)
            5 -> return OperationOutput(out = getCombo().mod(8))
            6 -> registers.B = registers.A.div(2.0.pow(getCombo().toDouble())).toLong()
            7 -> registers.C = registers.A.div(2.0.pow(getCombo().toDouble())).toLong()
        }
        return null
    }

    private fun reverseOperand(opcode: Int, operand: Int): OperationOutput? {
        fun getCombo(): Long = when (operand) {
            in 0..3 -> operand.toLong()
            4 -> registers.A
            5 -> registers.B
            6 -> registers.C
            7 -> throw IllegalArgumentException("7 is reserved, shouldn't have shown up as combo")
            else -> error("Unknown operand $operand")
        }

        fun getLiteral(): Long = operand.toLong()

        when (opcode) {
            0 -> registers.A = registers.A.div(2.0.pow(getCombo().toDouble())).toLong()
            1 -> registers.B = registers.B.xor(getLiteral())
            2 -> registers.B = getCombo().mod(8).toLong()
            3 -> return when {
                registers.A == 0L -> null
                else -> OperationOutput(newPointer = operand)
            }

            4 -> registers.B = registers.B.xor(registers.C)
            5 -> return OperationOutput(out = getCombo().mod(8))
            6 -> registers.B = registers.A.div(2.0.pow(getCombo().toDouble())).toLong()
            7 -> registers.C = registers.A.div(2.0.pow(getCombo().toDouble())).toLong()
        }
        return null
    }

    fun run(): String {
        val instructionPairs = instructions.zipWithNext()
        var pointer = 0
        val output = mutableListOf<Int>()
        while (true) {
            require(pointer % 2 == 0) { "Invalid pointer state!" }
            val (opcode, operand) = instructionPairs.getOrNull(pointer) ?: break
            val result = runOperand(opcode, operand)
            if (result?.out != null) output.add(result.out)
            pointer = result?.newPointer ?: (pointer + 2)
        }
        return output.joinToString(",")
    }

    fun part2(): Long {
        /**
         * Plan: Run the instructions in reverse and find way it could have been printed.
         * Abort run if state maes it impossible. Ugh I guess another round of recursion?
         */

        for (output in instructions.reversed().iterator()) {
            output.println("Trying to get output")

            when (output) {
                0 -> {
                    // just find the first and worry about others later

                    // This is the remainder after mod(8), so can't be a literal operand
                    // that means it's one of the registers

                    
                }

                else -> throw NotImplementedError("Not implemented for $output")


            }

        }

        return 0L
    }
}

fun main() {
    val part1Expected = "4,6,3,5,6,3,5,2,1,0"
    val part2Expected = 1


    fun part1(input: String): String {
        val computer = Computer.fromInput(input)
        val output = computer.run()
        return output
    }


    fun part2(input: String): Long {
        val computer = Computer.fromInput(input)
        val calculatedA = computer.part2()
        return calculatedA
    }

    part1(readInput("simple-test")).println("Part 1 simple test")

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = readInput("test")
    val part1Result = part1(testInput)
    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }

    // Read the input from the `src/Day01.txt` file.
    val input = readInput("input")
    part1(input).println("part1 (is not 1,0,4,2,7,4,1,7,2)") // Not 1,0,4,2,7,4,1,7,2

    val part2Result = part2(readInput("simple-test-2"))
    check(part2Result == 117440L) { "expected $part2Expected, got $part2Result" }

    part2(input).println("part2")
}
