import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_matching.dart';
import 'package:tensiongrid/domain/types/category.dart';

class EventMatching extends Event<TileMatching> {
  final Category category;
  final int validTiles;
  int count = 0;

  EventMatching({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
    required this.category,
    required this.validTiles,
  });

  @override
  int get pointsFail => hasStarted ? (validTiles - count) : 0;

  @override
  int get pointsSuccess => count * 3;

  @override
  ActionResult onTileTapped({
    required TileMatching tile,
    required double time,
  }) {
    super.onTileTapped(tile: tile, time: time);

    if (tile.category == category) {
      count++;
      removeTile(tile);

      if (count == validTiles) {
        return ActionResult(
          event: this,
          score: pointsSuccess,
          eventCompleted: true,
          removeTile: true,
          soundTap: true,
        );
      } else {
        return ActionResult(
          event: this,
          removeTile: true,
          soundTap: true,
        );
      }
    } else {
      return ActionResult(
        event: this,
        soundError: true,
      );
    }
  }
}
