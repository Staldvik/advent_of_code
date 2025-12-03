package day04

import utils.Dir
import utils.Grid
import utils.Pos
import utils.parseInput
import utils.println


fun main() {
    val part1Expected = 18
    val part2Expected = 9

    fun getNextChar(char: Char): Char {
        return when (char) {
            'X' -> 'M'
            'M' -> 'A'
            'A' -> 'S'
            else -> error("Trying to get next char for $char")
        }
    }

    fun part1(input: List<String>): Int {
        val wordPuzzle = Grid.fromInput(input)
        val words = mutableListOf<Set<Pos>>()

        for ((y, line) in input.withIndex()) {
            for ((x, char) in line.withIndex()) {
                fun checkDirFor(
                    char: Char,
                    current: Pos,
                    dir: Dir,
                    result: MutableSet<Pos>,
                ): MutableSet<Pos>? {
                    result.add(current)
                    val currentChar = wordPuzzle.atPos(current) ?: return null
                    if (currentChar == 'S') return result
                    if (currentChar != char) return null
                    return checkDirFor(getNextChar(char), current.moveDir(dir), dir, result)
                }

                val isPotentialStart = char == 'X'
                if (isPotentialStart) {
                    val currentCord = Pos(y, x)
                    for (dir in Dir.allDirs) {
                        val dirResult = checkDirFor(
                            getNextChar(char),
                            currentCord.moveDir(dir),
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
        val wordPuzzle = Grid.fromInput(input)
        val words = mutableListOf<Set<Pos>>()

        fun checkDirFor(
            char: Char,
            current: Pos,
            dir: Dir,
            result: LinkedHashSet<Pos>,
        ): LinkedHashSet<Pos>? {
            result.add(current)
            val currentChar = wordPuzzle.atPos(current) ?: return null
            if (currentChar == 'S') return result
            if (currentChar != char) return null
            return checkDirFor(getNextChar(char), current.moveDir(dir), dir, result)
        }

        for ((y, line) in input.withIndex()) {
            for ((x, char) in line.withIndex()) {
                val isPotentialStart = char == 'M'
                if (isPotentialStart) {
                    val currentCord = Pos(y, x)
                    for (dir in Dir.allDirs) {
                        val dirResult = checkDirFor(
                            getNextChar(char),
                            currentCord.moveDir(dir),
                            dir,
                            linkedSetOf(currentCord)
                        )
                        if (dirResult?.count() == 3) words.add(dirResult)
                    }
                }
            }
        }

        val result = words.fold(mutableMapOf<Pos, MutableList<Set<Pos>>>()) { map, word ->
            val wordA = word.find { wordPuzzle.atPos(it) == 'A' }!!
            map.getOrPut(wordA) { mutableListOf() }.add(word)
            map
        }.filter { it.value.count() > 1 }

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

        return onlyX.count()
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = parseInput("example1")
    check(part1(testInput) == part1Expected)
    check(part2(testInput) == part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = parseInput("input")
    part1(input).println("part1")
    part2(input).println("part2")
}
