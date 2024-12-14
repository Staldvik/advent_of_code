package day14

import Dir
import Grid
import Pos
import parseInput
import println
import java.io.File
import java.io.FileWriter


data class Robot(val pos: Pos, val vel: Dir) {}

class QuadrantGrid(private val width: Int, private val height: Int) {
    private val centerX: Int = width / 2
    private val centerY: Int = height / 2

    data class Quadrant(
        val x: IntRange,
        val y: IntRange,
    )

    val topLeft = Quadrant(
        x = 0..<centerX,
        y = 0..<centerY
    )

    val topRight = Quadrant(
        x = centerX + 1..<width,
        y = 0..<centerY
    )

    val bottomLeft = Quadrant(
        x = 0..<centerX,
        y = centerY + 1..<height
    )

    val bottomRight = Quadrant(
        x = centerX + 1..<width,
        y = centerY + 1..<height
    )

    // List of all quadrants for easy iteration
    val quadrants: List<Quadrant> = listOf(
        topLeft, topRight, bottomLeft, bottomRight
    )

    // Optional: Method to check which quadrant a point belongs to
    fun getQuadrantForPoint(pos: Pos): Quadrant? {
        return quadrants.find { quadrant -> pos.x in quadrant.x && pos.y in quadrant.y }
    }
}

fun main() {
    val part1Expected = 21
    val part2Expected = 1

    fun getRobotPositionsAfter(robots: List<Robot>, seconds: Int): List<Pos> {
        return robots.map {
            it.pos.moveDir(it.vel, seconds, wrap = Pos(103, 101))
        }
    }

    fun parseRobots(input: List<String>): List<Robot> = input.map { line ->
        val parsedLine = Regex("""(\w+)=(-?\d+),(-?\d+)""").findAll(line).associate {
            val x = it.groupValues[2].toInt()
            val y = it.groupValues[3].toInt()
            when (it.groupValues[1]) {
                "p" -> "position" to Pos(y, x)
                "v" -> "velocity" to Dir(y, x)
                else -> error("Unknown ${it.groupValues[1]}")
            }
        }

        Robot(parsedLine["position"] as Pos, parsedLine["velocity"] as Dir)
    }


    fun part1(input: List<String>): Int {
        val robots = parseRobots(input)
        val grid = QuadrantGrid(101, 103)

        val robotPositions = getRobotPositionsAfter(robots, 100)
        robotPositions.println("Robot positions")

        var result = 1;
        val quadrantCount = robotPositions.groupBy { grid.getQuadrantForPoint(it) }
        quadrantCount.println("QuadrantCount")
        quadrantCount.entries.filter { it.key != null }.forEach { result *= it.value.count() }

        return result
    }

    fun part2(input: List<String>): Int {
        val robots = parseRobots(input)
        val testGrid = Grid.ofSize(101, 103)

        val testFile = File("src/day14/whatev.txt")
        val writer = FileWriter(testFile)

        (7_500..10_000).forEach {
            val result = testGrid.showOnly(getRobotPositionsAfter(robots, it))
            writer.write("Iter $it")
            result.forEach { line ->
                writer.write(line.toCharArray())
                writer.write("\n")
            }
            writer.write("\n")
        }


        return 2
    }

//
//    // Or read a large test input from the `src/Day01_test.txt` file:
//    val testInput = parseInput("test")
//    val part1Result = part1(testInput)
//    check(part1Result == part1Expected) { "expected $part1Expected, got $part1Result" }
//    val part2Result = part2(testInput)
//    check(part2Result == part2Expected) { "expected $part2Expected, got $part2Result" }
//
//    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    part1(input).println("part1")
    part2(input).println("part2")
}
