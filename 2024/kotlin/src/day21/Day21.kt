package day21

import Dir
import Grid
import Pos
import parseInput
import println

class Keypad(val keypad: Grid) {
    var current = keypad.getCharPos('A')
}

fun getRequiredInput(set: Set<Pos>): String {
    return set.windowed(2).map { (it, next) ->
        when (it.getDirTo(next)) {
            Dir.UP -> '^'
            Dir.RIGHT -> '>'
            Dir.DOWN -> 'v'
            Dir.LEFT -> '<'
            else -> error("${it.getDirTo(next)} not understandable")
        }
    }.joinToString("")
}

fun main() {
    val part1Expected = 1
    val part2Expected = 1


    fun part1(input: List<String>): Int {
        val door = Keypad(Grid.fromInput(listOf("789", "456", "123", " 0A")))
        val robot1 = Keypad(Grid.fromInput(listOf(" ^A", "<v>")))
        val robot2 = Keypad(Grid.fromInput(listOf(" ^A", "<v>")))
        val user = Keypad(Grid.fromInput(listOf(" ^A", "<v>")))

        door.keypad.shortestPath(Pos(3, 2), Pos(3, 1)).println("Shortest")

        val link = linkedSetOf(door, robot1, robot2, user)

        val test = input.map { line ->
            val commands = line.map { output ->
                val newPos = door.keypad.getCharPos(output)
                val requiresInput = door.keypad.shortestPath(door.current, newPos).let { getRequiredInput(it) }
                door.current = newPos
                requiresInput
            }
            commands.joinToString("A") + "A"
        }

        test.println("Test")

        return 2
    }

    fun part2(input: List<String>): Int {
        return 1
    }

    part1(listOf("029A"))
    error("no longer pls")

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("test")
    val part1Result = part1(testInput)
    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    part1(input).println("part1")

    val part2Result = part2(testInput)
    check(part2Result == part2Expected) { "expected $part2Expected, got $part2Result" }

    part2(input).println("part2")
}
