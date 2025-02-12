package day21

import Dir
import Grid
import parseInput
import println

/**
 * ```
 *     +---+---+
 *     | ^ | A |
 * +---+---+---+
 * | < | v | > |
 * +---+---+---+
 * ```
 */
val directionalPad = listOf(" ^A", "<v>")

/**
 * ```
 * +---+---+---+
 * | 7 | 8 | 9 |
 * +---+---+---+
 * | 4 | 5 | 6 |
 * +---+---+---+
 * | 1 | 2 | 3 |
 * +---+---+---+
 *     | 0 | A |
 *     +---+---+
 *
 * ```
 */
val numberPad = listOf("789", "456", "123", " 0A")

open class InputDevice(val keypad: Grid) {
    private var currentHover = keypad.getCharPos('A')

    /** Will return the shortest paths taken to hover */
    fun hoverChar(char: Char): List<String> {
        val newPos = keypad.getCharPos(char)
        val paths = keypad.shortestPath(currentHover, newPos)
        currentHover = newPos

        return paths.map { path ->
            path.windowed(2).map { (it, next) ->
                when (it.getDirTo(next)) {
                    Dir.UP -> '^'
                    Dir.RIGHT -> '>'
                    Dir.DOWN -> 'v'
                    Dir.LEFT -> '<'
                    else -> error("${it.getDirTo(next)} not understandable")
                }
            }.joinToString("")
        }
    }
}

class NumberPad : InputDevice(Grid.fromInput(numberPad))
class DirectionalPad : InputDevice(Grid.fromInput(directionalPad))

fun main() {
    val part1Expected = 126384
    val part2Expected = 1

    fun part1(input: List<String>): Int {
        val door = NumberPad()
        val robot = DirectionalPad()
        val user = DirectionalPad()

        val link = linkedSetOf(door, robot, user)

//        val test = input.map { line ->
//            val userInput = link.scan(listOf(line)) { acc, inputDevice ->
//                val commands = acc.flatMap { outputs ->
//                    val result = outputs.map { output ->
//                        val newPos = inputDevice.keypad.getCharPos(output)
//                        val requiresInput =
//                            inputDevice.keypad
//                                .shortestPath(inputDevice.currentHover, newPos)
//                                .map { getRequiredInput(it) + "A" }
//                        inputDevice.currentHover = newPos
//                        requiresInput
//                    }
//                    result.println("This is how it looks")
//                    val combinations = result.fold(listOf("")) { acc, list ->
//                        acc.flatMap { prefix -> list.map { prefix + it } }
//                    }
//                    combinations.println("This is the combinations")
//
//                    combinations
//                }
//                commands
//            }
//            Pair(line, userInput)
//        }
//
//        return test.sumOf { (doorCode, commands) ->
//            val numericPart = doorCode.filter { it.isDigit() }
//            (numericPart.toInt() * commands.count()).println("${numericPart.toInt()} * ${commands.count()}")
//            numericPart.toInt() * commands.count()
//        }

        fun getInputsFor(input: String, inputDevice: InputDevice) {
            
        }

        getInputsFor(input[0], door)

        return 2
    }

    fun part2(input: List<String>): Int {
        return 1
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("test")
    val part1Result = part1(testInput)
    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    part1(input).println("part1") // 253278 too high

    val part2Result = part2(testInput)
    check(part2Result == part2Expected) { "expected $part2Expected, got $part2Result" }

    part2(input).println("part2")
}
