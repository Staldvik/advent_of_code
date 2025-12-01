package day01

import utils.parseInput
import utils.println

class Dial(var pos: Int) {
    fun move(direction: String) {
        when (direction) {
            "R" -> {

            }

            "L" -> {

            }

            else -> throw IllegalArgumentException("Invalid Direction")
        }
    }
}


fun main() {
    val part1Expected = 3
    val part2Expected = 6

    fun part1(input: List<String>): Int {
        var pos = 50
        var count = 0
        input.forEach {
            val direction = it.take(1)
            val ticks = it.drop(1).toInt()

            if (direction == "R") {
                pos += ticks
            } else {
                pos -= ticks
            }

            pos %= 100

            println("$direction $ticks gives $pos")

            if (pos == 0) count++
        }
        count.println("count")
        return count
    }

    fun part2(input: List<String>): Int {
        var pos = 50;
        var count = 0;
        input.forEach {
            val direction = it.take(1)
            val ticks = it.drop(1).toInt();

            if (direction == "R") {
                pos += ticks
            } else {
                pos -= ticks
            }

            if (pos > 99) count += pos.floorDiv( 100)
            if (pos < 0) count += -pos.floorDiv( 100)

            pos = Math.floorMod(pos, 100)

            println("$direction $ticks gives $pos")

        }
        count.println("count")
        return count
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("test")
    //check(part1(testInput) == part1Expected)
    check(part2(testInput) == part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    part1(input).println("part1") // 461 too low
    part2(input).println("part2") // 3390 too low // 6659 too low
}
