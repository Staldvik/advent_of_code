package day13

import Dir
import Pos
import println
import readInput

data class Machine(val buttonA: Dir, val buttonB: Dir, val goal: Pos) {}

fun main() {
    val part1Expected = 480
    val part2Expected = 1


    fun part1(input: String): Int {
        val machines = input.split("\n\n").map { machine ->
            val results =
                Regex("""X[+=](\d+), Y[+=](\d+)""")
                    .findAll(machine)
                    .flatMap { it.groupValues.drop(1).map { groupValue -> groupValue.toInt() } }
                    .windowed(2, 2)
                    .iterator()

            val buttonA = results.next().let { Dir(dx = it[0], dy = it[1]) }
            val buttonB = results.next().let { Dir(dx = it[0], dy = it[1]) }
            val goal = results.next().let { Pos(x = it[0], y = it[1]) }

            Machine(buttonA, buttonB, goal)
        }

        machines.println("Machines")

        return machines.sumOf { machine ->
            var machinePos = Pos(0, 0)

            // Try to find as many buttonB-presses
            val buttonBPresses = (0..100).findLast { pressAmount ->
                val newPos = machinePos.moveDir(machine.buttonB, pressAmount)
                if (newPos == machine.goal) return@findLast true

                val goalDist = newPos.getDistTo(machine.goal)
                val goalReachableWithButtonA =
                    goalDist.dy % machine.buttonA.dy == 0 && goalDist.dx % machine.buttonA.dx == 0

                if (goalReachableWithButtonA) {
                    machinePos = machinePos.moveDir(machine.buttonB, pressAmount)
                    true
                } else {
                    false
                }
            }

            if (buttonBPresses == null) {
                println("$machine not winnable")
                return@sumOf 0
            }

            // TODO: We can compute this without iteration, but should be correct no?
            val buttonAPresses = (0..100).find { pressAmount ->
                val newPos = machinePos.moveDir(machine.buttonA, pressAmount)
                newPos == machine.goal
            }

            if (buttonAPresses == null) return@sumOf 0


            println("$machine: $buttonAPresses and $buttonBPresses")


            buttonAPresses * 3 + buttonBPresses * 1
        }
    }

    fun part2(input: String): Int {
        return 1
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = readInput("test")
    val part1Result = part1(testInput)
    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }
    val part2Result = part2(testInput)
    check(part2Result == part2Expected) { "expected $part2Expected, got $part2Result" }

    // Read the input from the `src/Day01.txt` file.
    val input = readInput("input")
    part1(input).println("part1 expected higher than 26727") // 26727 too low
    part2(input).println("part2")
}
