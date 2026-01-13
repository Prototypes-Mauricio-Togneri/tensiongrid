/**
 * Represents the game grid with nodes and edges.
 * Handles position calculations and node/edge exclusions for level design.
 */
class Grid {
    /**
     * @param {Object} config - Grid configuration from level data
     */
    constructor(config) {
        this.height = config.height       // Number of rows
        this.width = config.width         // Number of columns
        this.cellSize = config.cellSize   // Pixels between nodes
        this.nodeRadius = config.nodeRadius // Node visual radius
        this.edgeWidth = config.edgeWidth // Edge line thickness
        this.excludedNodes = new Set()    // Set of "row,col" keys for excluded nodes
        this.excludedEdges = new Set()    // Set of edge keys for excluded edges

        // Parse excluded nodes from config
        if (config.excludes?.nodes) {
            for (const node of config.excludes.nodes) {
                this.excludedNodes.add(`${node.y},${node.x}`)
            }
        }

        // Parse excluded edges from config
        if (config.excludes?.edges) {
            for (const edge of config.excludes.edges) {
                this.excludedEdges.add(this.getEdgeKey(edge.from.y, edge.from.x, edge.to.y, edge.to.x))
            }
        }
    }

    /**
     * Check if a node is excluded from the grid.
     * @param {number} row - Grid row
     * @param {number} col - Grid column
     * @returns {boolean} True if node is excluded
     */
    isExcluded(row, col) {
        return this.excludedNodes.has(`${row},${col}`)
    }

    /**
     * Generate a canonical key for an edge between two nodes.
     * Keys are sorted to ensure the same edge always produces the same key.
     * @param {number} row1 - First node row
     * @param {number} col1 - First node column
     * @param {number} row2 - Second node row
     * @param {number} col2 - Second node column
     * @returns {string} Canonical edge key
     */
    getEdgeKey(row1, col1, row2, col2) {
        const key1 = `${row1},${col1}`
        const key2 = `${row2},${col2}`
        return key1 < key2 ? `${key1}-${key2}` : `${key2}-${key1}`
    }

    /**
     * Check if an edge between two nodes is excluded.
     * @param {number} row1 - First node row
     * @param {number} col1 - First node column
     * @param {number} row2 - Second node row
     * @param {number} col2 - Second node column
     * @returns {boolean} True if edge is excluded
     */
    isEdgeExcluded(row1, col1, row2, col2) {
        return this.excludedEdges.has(this.getEdgeKey(row1, col1, row2, col2))
    }

    /**
     * Convert grid coordinates to world space position.
     * @param {number} row - Grid row
     * @param {number} col - Grid column
     * @returns {Vector2} World position
     */
    getNodePosition(row, col) {
        return new Vector2(
            col * this.cellSize,
            row * this.cellSize
        )
    }

    /**
     * Check if a grid position is within bounds and not excluded.
     * @param {number} row - Grid row
     * @param {number} col - Grid column
     * @returns {boolean} True if position is valid and accessible
     */
    isValidPosition(row, col) {
        return row >= 0 && row < this.height && col >= 0 && col < this.width && !this.isExcluded(row, col)
    }

    /**
     * Wrap position to opposite edge if out of bounds (toroidal wrapping).
     * @param {number} row - Grid row (may be out of bounds)
     * @param {number} col - Grid column (may be out of bounds)
     * @returns {Object} Object with wrapped row, col, and whether wrapping occurred
     */
    wrapPosition(row, col) {
        const wrappedRow = (row + this.height) % this.height
        const wrappedCol = (col + this.width) % this.width
        return {
            row: wrappedRow,
            col: wrappedCol,
            wrapped: row !== wrappedRow || col !== wrappedCol
        }
    }
}
