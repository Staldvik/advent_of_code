package day09

import println
import readInput


fun main() {
    val part1Expected = 1928L
    val part2Expected = 1

    fun part1(input: List<String>): Long {
        val diskMap = input.first().toCharArray().toMutableList()
        val fileSystem = mutableMapOf<IntRange, Int?>()

        var pointer = 0;
        var idCounter = 0;
        diskMap.forEachIndexed() { index, block ->
            val blockValue = block.digitToInt()
            if (blockValue == 0) return@forEachIndexed

            val range = pointer.rangeUntil(pointer + blockValue)
            val isFile = index % 2 == 0

            if (isFile) {
                fileSystem[range] = idCounter++
            } else {
                fileSystem[range] = null
            }

            pointer += blockValue
        }

        fileSystem.println("Filesystem")

        fun compact(id: Int, sourceRange: IntRange) {
            val destination = fileSystem.entries
                .filter { it.value == null && it.key.first < sourceRange.first }
                .minByOrNull { it.key.first }

            if (destination == null) return

            destination.key.println("Compacting $id with range $sourceRange into")

            val destinationRange = destination.key
            if (sourceRange.count() > destinationRange.count()) {
                // Source is larger than destination, fill up destination
                fileSystem[destinationRange] = id

                // Remember to add entry for remaining in source
                val remainder = sourceRange.first..sourceRange.last - destinationRange.count()
                fileSystem[remainder] = id

                compact(id, remainder)
            } else if (sourceRange.count() == destinationRange.count()) {
                fileSystem[destinationRange] = id
            } else {
                // Source is smaller to destination

                // Remove the to-be overwritten range
                fileSystem.remove(destinationRange)
                // Add entry for source
                val insertedRange = destinationRange.first..<destinationRange.first + sourceRange.count()
                fileSystem[insertedRange] = id

                // Remember to add entry for remainder in destination
                val remainingRange =
                    insertedRange.last + 1..destinationRange.last
                fileSystem[remainingRange] = null
            }

            // Remove the taken range from source
            fileSystem.remove(sourceRange)
        }

        // Go through blocks in reverse order (notice toList to iterate over copy)
        fileSystem.entries.toList().reversed().forEach() { (range, id) ->
            if (id != null) compact(id, range)
        }

        val result = fileSystem.entries.sumOf {
            if (it.value != null) {
                val res = it.key.sumOf { idx -> idx * it.value!! }
                res.println("$it")
                res.toLong()
            } else {
                0L
            }
        }

        result.println("result")

        return result
    }

    fun part2(input: List<String>): Int {
        return 1
    }

    // Or read a large test input from the `src/Day01_test.txt` file:
    val testInput = readInput("test")
    check(part1(testInput) == part1Expected)
    check(part2(testInput) == part2Expected)

    // Read the input from the `src/Day01.txt` file.
    val input = readInput("input")
    //part1(input).println("part1") // 6193070082075 Too low, 6215617910304 Also too low
    part2(input).println("part2")
}