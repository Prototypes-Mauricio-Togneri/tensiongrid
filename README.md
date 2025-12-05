# Tension Grid

- Generator algorithm
- Backend and matchmaking

# Grid
- id: string
- createdAt: timestamp
- width: number
- height: number
- events: Event[]
- playerIds: string[]
- history: History[]

# Match
- id: string
- createdAt: timestamp
- player1: Player
- player2: Player

# Player
- id: string
- index: number
- name: string
- color: string
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
