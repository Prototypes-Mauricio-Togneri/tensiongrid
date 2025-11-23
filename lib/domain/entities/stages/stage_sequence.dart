import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/stages/stage.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_character.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_number.dart';

class StageSequence extends Stage {
  StageSequence({
    required super.id,
    required super.info,
    required super.width,
    required super.height,
    required super.tiles,
    required super.numberOfTiles,
  });

  int get currentIndex => tilesRemoved + 1;

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
      return const ActionResult(soundError: true);
    }
  }

  ActionResult _checkIndex({
    required int index,
    required Tile tile,
  }) {
    if (index == currentIndex) {
      removeTile(tile);

      if (isCompleted) {
        return const ActionResult(
          nextStage: true,
          removeTile: true,
          soundTap: true,
        );
      } else {
        return const ActionResult(
          removeTile: true,
          soundTap: true,
        );
      }
    } else {
      final bool validIndex = index >= 1 && index <= numberOfTiles;

      return ActionResult(
        removeTile: !validIndex,
        soundError: true,
      );
    }
  }
}
