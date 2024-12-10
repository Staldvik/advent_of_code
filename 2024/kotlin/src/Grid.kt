data class Dir(val dy: Int, val dx: Int) {
    fun rotateRight() = when (this) {
        Dir(-1, 0) -> Dir(0, 1)
        Dir(0, 1) -> Dir(1, 0)
        Dir(1, 0) -> Dir(0, -1)
        Dir(0, -1) -> Dir(-1, 0)
        else -> throw NotImplementedError("rotateRight not implemented for $this")
    }

    companion object {
        val cardinalDirs = listOf(
            Dir(-1, 0),
            Dir(0, 1),
            Dir(1, 0),
            Dir(0, -1)
        )

        val diagonalDirs = listOf(
            Dir(-1, -1),
            Dir(-1, 1),
            Dir(1, -1),
            Dir(1, 1),
        )

        val allDirs = cardinalDirs + diagonalDirs
    }
}

data class Pos(val y: Int, val x: Int) {
    fun moveDir(dir: Dir, steps: Int = 1) = Pos(y = y + (dir.dy * steps), x = x + (dir.dx * steps))
    fun moveDirSequence(dir: Dir, steps: Int = 1) = sequence {
        var currentPoint = this@Pos
        while (true) {
            currentPoint = currentPoint.moveDir(dir, 1)
            yield(currentPoint)
        }
    }

    fun isWithin(grid: Grid) = grid.grid.getOrNull(this.y)?.getOrNull(this.x) != null
}


class Grid(val grid: List<MutableList<Char>>) {
    companion object {
        fun fromInput(input: List<String>) = Grid(input.map { it.toCharArray().toMutableList() })
    }

    fun print() {
        kotlin.io.println()
        grid.forEach { row ->
            kotlin.io.println(row.joinToString(""))
        }
    }

    /** Note: only gets the first even if several are present */
    fun getCharPos(char: Char): Pos {
        grid.forEachIndexed { y, row ->
            val x = row.indexOf(char)
            if (x != -1) return Pos(y, x)
        }
        throw IllegalStateException("No start character '^' found in grid")
    }

    fun getAntennas(): Map<Char, Set<Pos>> {
        val result = mutableMapOf<Char, MutableSet<Pos>>()
        grid.forEachIndexed { y, row ->
            row.forEachIndexed { x, char ->
                if (char != '.') {
                    result.getOrPut(char) { mutableSetOf() }.add((Pos(y, x)))
                }
            }
        }
        return result
    }

    fun atPos(pos: Pos) = this.grid.getOrNull(pos.y)?.getOrNull(pos.x)

    fun setAtPos(pos: Pos, char: Char): Grid {
        val newGrid = grid.map { it.toMutableList() }.toMutableList()
        newGrid[pos.y][pos.x] = char
        return Grid(newGrid)
    }

    fun findAll(findChar: Char): MutableSet<Pos> = grid.flatMapIndexed() { y, row ->
        row.mapIndexed() { x, char ->
            if (char == findChar) Pos(y, x) else null
        }.filterNotNull()
    }.toMutableSet()
}