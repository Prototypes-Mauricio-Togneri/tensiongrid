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
  int get pointsFail => tilesRemoved.isNotEmpty ? tilesActive.length : 0;

  @override
  int get pointsSuccess => tilesRemoved.length * 2;

  @override
  ActionResult onTileTapped({
    required TileSequence tile,
    required double time,
  }) {
    super.onTileTapped(tile: tile, time: time);

    final int currentIndex = tilesRemoved.length + 1;

    if (tile.number == currentIndex) {
      removeTile(tile);

      if (tilesRemoved.length >= numberOfTiles) {
        return ActionResult(
          score: pointsSuccess,
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
