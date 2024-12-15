data class Dir(val dy: Int, val dx: Int) {
    fun print() {
        when (this) {
            Dir(-1, 0) -> kotlin.io.println('↑')
            Dir(0, 1) -> kotlin.io.println('→')
            Dir(1, 0) -> kotlin.io.println('↓')
            Dir(0, -1) -> kotlin.io.println('←')

            Dir(-1, -1) -> kotlin.io.println('↖')
            Dir(-1, 1) -> kotlin.io.println('↗')
            Dir(1, 1) -> kotlin.io.println('↘')
            Dir(1, -1) -> kotlin.io.println('↙')
        }
    }

    fun rotateRight() = when (this) {
        Dir(-1, 0) -> Dir(0, 1)
        Dir(0, 1) -> Dir(1, 0)
        Dir(1, 0) -> Dir(0, -1)
        Dir(0, -1) -> Dir(-1, 0)
        else -> throw NotImplementedError("rotateRight not implemented for $this")
    }

    companion object {
        val UP = Dir(-1, 0)
        val DOWN = Dir(1, 0)
        val LEFT = Dir(0, -1)
        val RIGHT = Dir(0, 1)

        val verticalDirs = listOf(
            UP, DOWN
        )

        val horizontalDirs = listOf(
            LEFT, RIGHT
        )

        // Not reusing the above because I want a certain order here
        val cardinalDirs = listOf(
            UP, RIGHT, DOWN, LEFT
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
    fun moveDir(dir: Dir, steps: Int = 1, wrap: Pos? = null): Pos {
        if (wrap != null) {
            val newY = y + dir.dy * steps
            val newX = x + dir.dx * steps

            val wrappedY = ((newY % wrap.y) + wrap.y) % wrap.y
            val wrappedX = ((newX % wrap.x) + wrap.x) % wrap.x

            return Pos(wrappedY, wrappedX)
        }
        return Pos(y = y + (dir.dy * steps), x = x + (dir.dx * steps))
    }

    fun moveDirSequence(dir: Dir, steps: Int = 1) = sequence {
        var currentPoint = this@Pos
        while (true) {
            currentPoint = currentPoint.moveDir(dir, 1)
            yield(currentPoint)
        }
    }

    fun isWithin(grid: Grid) = grid.grid.getOrNull(this.y)?.getOrNull(this.x) != null
    fun getDirTo(pos: Pos) = Dir.allDirs.find { dir -> this.moveDir(dir) == pos }
    fun getDistTo(pos: Pos) = Dir(pos.y - this.y, pos.x - this.x)
}


class Grid(val grid: List<MutableList<Char>>) {
    companion object {
        fun fromInput(input: List<String>) = Grid(input.map { it.toCharArray().toMutableList() })
        fun ofSize(width: Int, height: Int) = Grid(List(height) { MutableList(width) { 'x' } })
    }

    fun print() {
        kotlin.io.println()
        grid.forEach { row ->
            kotlin.io.println(row.joinToString(""))
        }
    }

    fun showOnly(positions: List<Pos>) = grid.mapIndexed { y, row ->
        row.mapIndexed { x, char ->
            val pos = Pos(y, x)
            if (positions.contains(pos)) char
            else ' '
        }
    }

    fun printWith(positions: List<Pos>) {
        kotlin.io.println()
        grid.forEachIndexed { y, row ->
            val newRow = row.mapIndexed { x, char ->
                val pos = Pos(y, x)
                if (positions.contains(pos)) char
                else '·'
            }
            kotlin.io.println(newRow.joinToString(""))
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

    fun getChars(): MutableMap<Char, MutableSet<Pos>> {
        val result = mutableMapOf<Char, MutableSet<Pos>>()
        grid.forEachIndexed { y, row ->
            row.forEachIndexed { x, char ->
                result.getOrPut(char) { mutableSetOf() }.add((Pos(y, x)))
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

    fun movePos(pos: Pos, dir: Dir) {
        val moveChar = atPos(pos)
        check(moveChar != null) { "Trying to move a empty place" }
        grid[pos.y][pos.x] = '.'
        val newPos = pos.moveDir(dir)
        grid[newPos.y][newPos.x] = moveChar
    }

    fun findAll(findChar: Char): MutableSet<Pos> = grid.flatMapIndexed() { y, row ->
        row.mapIndexed() { x, char ->
            if (char == findChar) Pos(y, x) else null
        }.filterNotNull()
    }.toMutableSet()
}