import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/entities/stages/stage.dart';
import 'package:tensiongrid/domain/entities/stages/stage_sequence.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/number_type.dart';
import 'package:tensiongrid/utils/generator.dart';

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

  ActionResult onTileTapped(Tile tile) {
    final ActionResult result = stage.onTileTapped(tile);

    if (result.nextStage) {
      stageIndex++;
    }

    return result;
  }

  factory Match.test() {
    const int width = Constants.GRID_MAX_WIDTH;
    const int height = Constants.GRID_MAX_HEIGHT;

    const StageGenerator generator = StageGenerator(
      width: width,
      height: height,
    );

    return Match(
      id: '123',
      player1: const Player(
        id: '1',
        name: 'Alice',
      ),
      player2: const Player(
        id: '2',
        name: 'Bob',
      ),
      stages: [
        generator.match('s0'),
        StageSequence(
          id: 's1',
          info: 'Number sequence',
          width: width,
          height: height,
          tiles: Tile.sequenceNumberTiles(
            width: width,
            height: height,
            max: 3,
            type: NumberType.arabic,
          ),
          numberOfTiles: 3,
        ),
        StageSequence(
          id: 's2',
          info: 'Character sequence',
          width: width,
          height: height,
          tiles: Tile.sequenceCharacterTiles(
            width: width,
            height: height,
            max: 3,
          ),
          numberOfTiles: 3,
        ),
        StageSequence(
          id: 's3',
          info: 'Dot sequence',
          width: width,
          height: height,
          tiles: Tile.sequenceNumberTiles(
            width: width,
            height: height,
            max: 3,
            type: NumberType.dots,
          ),
          numberOfTiles: 3,
        ),
      ],
    );
  }
}
