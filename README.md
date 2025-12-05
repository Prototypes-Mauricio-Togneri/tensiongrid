# Tension Grid

- Generator algorithm
- Backend and matchmaking

# Match
- id: string
- createdAt: timestamp
- events: Event[]
- playerIds: string[]
- history: History[]

# History
- createdAt: timestamp
- player1: Player
- player2: Player

# Player
- id: string
- name: string
- score: number

# Event
- id: string
- type: string
- timestamp: number
- tiles: Tile[]

# Tile
- id: string
- type: string
- x: number
- y: number

[Website](https://tension-grid.web.app)
