import 'package:flutter/material.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/entities/stage.dart';
import 'package:tensiongrid/domain/entities/tiles/number_tile.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class Match {
  final String id;
  final Player player1;
  final Player player2;
  final List<Stage> stages;
  int stageIndex = 0;

  Match({
    required this.id,
    required this.player1,
    required this.player2,
    required this.stages,
  });

  Stage get stage => stages[stageIndex];

  factory Match.test() {
    final List<Tile> tiles = [];

    for (int x = 0; x < Constants.GRID_MAX_WIDTH; x++) {
      for (int y = 0; y < Constants.GRID_MAX_HEIGHT; y++) {
        tiles.add(
          NumberTile(
            x: x,
            y: y,
            color: Colors.white,
            number: (x + 1) + (y * Constants.GRID_MAX_WIDTH),
          ),
        );
      }
    }

    return Match(
      id: '123',
      player1: const Player(id: '1', name: 'Alice'),
      player2: const Player(id: '2', name: 'Bob'),
      stages: [
        Stage(
          id: 's1',
          info: 'Stage 1',
          width: Constants.GRID_MAX_WIDTH,
          height: Constants.GRID_MAX_HEIGHT,
          tiles: tiles,
        ),
        Stage(
          id: 's2',
          info: 'Stage 2',
          width: Constants.GRID_MAX_WIDTH,
          height: Constants.GRID_MAX_HEIGHT,
          tiles: tiles,
        ),
      ],
    );
  }
}
