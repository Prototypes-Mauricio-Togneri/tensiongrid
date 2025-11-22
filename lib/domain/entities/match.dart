import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/entities/stage.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/number_type.dart';

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

  void onTileTapped(Tile tile) {
    print('Tile tapped at (${tile.x}, ${tile.y})');
  }

  factory Match.test() {
    const int width = Constants.GRID_MAX_WIDTH;
    const int height = Constants.GRID_MAX_HEIGHT;

    final Match match = Match(
      id: '123',
      player1: const Player(id: '1', name: 'Alice'),
      player2: const Player(id: '2', name: 'Bob'),
      stages: [],
    );

    match.stages.add(
      Stage(
        id: 's1',
        info: 'Stage 1',
        width: width,
        height: height,
        tiles: Tile.sequenceNumberTiles(
          match: match,
          width: width,
          height: height,
          max: 15,
          type: NumberType.arabic,
        ),
      ),
    );

    return match;
  }
}
