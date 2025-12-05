# Tension Grid

- Generator algorithm
- Backend and matchmaking

# Matchmaking

## Never played

```
userId not in playerIds
```

## Played but not winner

```
userId in playerIds AND userId != winnerId
```

## Create new match

```
Create new grid
```

# Grid

- id: string
- createdAt: timestamp
- size:
  - width: number
  - height: number
- events: Event[]
- winnerId: string | null
- playerIds: string[]
- matches: Match[]

# Match

- id: string
- createdAt: timestamp
- player1: Player
- player2: Player

# Player

- id: string
- index: number
- name: string
- score: number

# Event

- id: string
- type: string
- trigger: number
- tiles: Tile[]

# Tile

- id: string
- type: string
- location:
  - x: number
  - y: number

[Website](https://tension-grid.web.app)
