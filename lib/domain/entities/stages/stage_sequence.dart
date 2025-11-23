import 'package:tensiongrid/domain/entities/stages/stage.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_character.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_number.dart';
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

    if (tile is TileNumber) {
      if (tile.index == currentIndex) {
        currentIndex++;
        tiles.remove(tile);

        return ActionResult.success;
      } else {
        return ActionResult.failure;
      }
    } else if (tile is TileCharacter) {
      if (tile.index == currentIndex) {
        currentIndex++;
        tiles.remove(tile);

        return ActionResult.success;
      } else {
        return ActionResult.failure;
      }
    }

    return ActionResult.none;
  }
}
