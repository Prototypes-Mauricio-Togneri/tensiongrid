import 'package:tensiongrid/domain/entities/stages/stage.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/action_result.dart';

class StageSequence extends Stage {
  int currentIndex = 1;

  StageSequence({
    required super.id,
    required super.info,
    required super.width,
    required super.height,
    required super.tiles,
  });

  @override
  ActionResult onTileTapped(Tile tile) {
    print('Tile tapped at (${tile.x}, ${tile.y})');

    return ActionResult.none;
  }
}
