import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/entities/stage.dart';
import 'package:tensiongrid/domain/entities/tile.dart';

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

  Stage get currentStage => stages[stageIndex];

  factory Match.test() {
    final List<Tile> tiles = [];

    for (int x = 0; x < Constants.GRID_MAX_WIDTH; x++) {
      for (int y = 0; y < Constants.GRID_MAX_HEIGHT; y++) {
        tiles.add(Tile(x: x, y: y));
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
          tiles: tiles,
        ),
        Stage(
          id: 's2',
          info: 'Stage 2',
          tiles: tiles,
        ),
      ],
    );
  }
}
