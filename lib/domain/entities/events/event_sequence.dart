import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_character.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_number.dart';

class EventSequence extends Event {
  EventSequence({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
  });

  @override
  bool get isCompleted => tilesRemoved >= tiles.length;

  @override
  int get pointsTimeout => 10;

  @override
  int get pointsCompleted => tiles.length * 10;

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
        return ActionResult(
          score: pointsCompleted,
          soundEventCompleted: true,
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
      return const ActionResult(
        removeTile: false,
        soundError: true,
      );
    }
  }
}
