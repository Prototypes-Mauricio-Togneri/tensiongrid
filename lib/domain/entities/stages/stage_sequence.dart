import 'package:tensiongrid/domain/entities/stages/stage.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_character.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_number.dart';
import 'package:tensiongrid/domain/types/action_result.dart';

class StageSequence extends Stage {
  final int maxIndex;
  int currentIndex = 1;

  StageSequence({
    required super.id,
    required super.info,
    required super.width,
    required super.height,
    required super.tiles,
    required this.maxIndex,
  });

  @override
  ActionResult onTileTapped(Tile tile) {
    print('Tile tapped at (${tile.x}, ${tile.y})');

    if (tile is TileNumber) {
      return _checkIndex(
        index: tile.number,
        tile: tile,
      );
    } else if (tile is TileCharacter) {
      return _checkIndex(
        index: tile.index,
        tile: tile,
      );
    } else {
      return ActionResult.failure;
    }
  }

  ActionResult _checkIndex({
    required int index,
    required Tile tile,
  }) {
    if (index == currentIndex) {
      currentIndex++;
      tiles.remove(tile);

      if (currentIndex > maxIndex) {
        return ActionResult.next_stage;
      } else {
        return ActionResult.remove;
      }
    } else {
      return ActionResult.failure;
    }
  }
}
