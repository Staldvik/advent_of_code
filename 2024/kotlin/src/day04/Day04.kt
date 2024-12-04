package day04

import println
import readInput


fun main() {
    val part1Expected = 18
    val part2Expected = 9

    data class Dir(val dy: Int, val dx: Int)
    data class Coord(val y: Int, val x: Int, val char: Char?)

    val dirs = listOf(
        Dir(-1, -1),
        Dir(-1, 0),
        Dir(-1, 1),
        Dir(0, -1),
        Dir(0, 1),
        Dir(1, -1),
        Dir(1, 0),
        Dir(1, 1),
    )

    fun getNextChar(char: Char): Char {
        return when (char) {
            'X' -> 'M'
            'M' -> 'A'
            'A' -> 'S'
            else -> error("Trying to get next char for $char")
        }
    }

    fun getNextCoord(coord: Coord, dir: Dir, input: List<String>): Coord {
        val nextY = coord.y + dir.dy
        val nextX = coord.x + dir.dx
        return Coord(
            nextY, nextX, input.getOrNull(nextY)?.getOrNull(nextX)
        )
    }

    fun part1(input: List<String>): Int {
        val words = mutableListOf<Set<Coord>>()

        for ((y, line) in input.withIndex()) {
            for ((x, char) in line.withIndex()) {
                fun checkDirFor(
                    char: Char,
                    current: Coord,
                    dir: Dir,
                    result: MutableSet<Coord>,
                ): MutableSet<Coord>? {
                    result.add(current)
                    if (current.char == null) return null
                    if (current.char == 'S') return result
                    if (current.char != char) return null
                    return checkDirFor(getNextChar(char), getNextCoord(current, dir, input), dir, result)
                }

                val isPotentialStart = char == 'X'
                if (isPotentialStart) {
                    val currentCord = Coord(y, x, 'X')
                    for (dir in dirs) {
                        val dirResult = checkDirFor(
                            getNextChar(char),
                            getNextCoord(currentCord, dir, input),
                            dir,
                            mutableSetOf(currentCord)
                        )
                        if (dirResult?.count() == 4) words.add(dirResult)
                    }
                }
            }
        }

        return words.count()
    }

    fun part2(input: List<String>): Int {
        val words = mutableListOf<LinkedHashSet<Coord>>()

        for ((y, line) in input.withIndex()) {
            for ((x, char) in line.withIndex()) {
                fun checkDirFor(
                    char: Char,
                    current: Coord,
                    dir: Dir,
                    result: LinkedHashSet<Coord>,
                ): LinkedHashSet<Coord>? {
                    result.add(current)
                    if (current.char == null) return null
                    if (current.char == 'S') return result
                    if (current.char != char) return null
                    return checkDirFor(getNextChar(char), getNextCoord(current, dir, input), dir, result)
                }

                val isPotentialStart = char == 'M'
                if (isPotentialStart) {
                    val currentCord = Coord(y, x, 'M')
                    for (dir in dirs) {
                        val dirResult = checkDirFor(
                            getNextChar(char),
                            getNextCoord(currentCord, dir, input),
                            dir,
                            linkedSetOf(currentCord)
                        )
                        if (dirResult?.count() == 3) words.add(dirResult)
                    }
                }
            }
        }

        // Plan
        // Find all words that share the same 'A'
        val result = words.fold(mutableMapOf<Coord, MutableList<LinkedHashSet<Coord>>>()) { map, word ->
            val wordA = word.find { it.char == 'A' }!!
            map.getOrPut(wordA) { mutableListOf() }.add(word)
            map
        }.filter { it.value.count() > 1 }

        result.println()

        // Find top and check down two, use other (bottom) and check up
        val onlyX = result.filter { (middle, words) ->
            val corners = listOf(Dir(1, 1), Dir(1, -1), Dir(-1, 1), Dir(-1, -1))
            corners.all { corner ->
                val cornerX = middle.x + corner.dx
                val cornerY = middle.y + corner.dy
                words.any() { word ->
                    word.any() { wordChar ->
                        wordChar.x == cornerX && wordChar.y == cornerY

                    }
                }
            }
        }


        // Has S or M opposite
        // Has S or M opposite

        onlyX.count().println("Onlyx count")

        return onlyX.count()
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
