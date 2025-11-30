import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_sequence.dart';

class EventSequence extends Event<TileSequence> {
  EventSequence({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
  });

  @override
  bool get isCompleted => tilesRemoved.length >= numberOfTiles;

  @override
  int get pointsTimeout => tilesRemoved.isNotEmpty ? tilesActive.length : 0;

  @override
  int get pointsCompleted => tilesRemoved.length * 2;

  @override
  ActionResult onTileTapped({
    required TileSequence tile,
    required double time,
  }) {
    final int currentIndex = tilesRemoved.length + 1;

    if (tile.number == currentIndex) {
      removeTile(tile);

      if (isCompleted) {
        return ActionResult(
          score: pointsCompleted,
          eventCompleted: true,
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
