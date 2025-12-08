import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_matching.dart';
import 'package:tensiongrid/domain/types/category.dart';
import 'package:tensiongrid/domain/types/event_type.dart';

class EventMatching extends Event<TileMatching> {
  late final Category category;
  late final int validTiles;
  int count = 0;

  EventMatching({
    required super.trigger,
    required super.timeout,
    required List<TileMatching> tiles,
  }) : super(type: EventType.matching, tiles: tiles) {
    category = tiles[0].category;
    validTiles = tiles.length;
  }

  @override
  int get pointsFail => hasStarted ? (validTiles - count) : 0;

  @override
  int get pointsSuccess => count * 3;

  @override
  ActionResult tileTapped({
    required TileMatching tile,
    required double time,
  }) {
    if (tile.category == category) {
      count++;
      removeTile(tile);

      if (count == validTiles) {
        return ActionResult.completed(this);
      } else {
        return ActionResult.remove(this);
      }
    } else {
      return ActionResult.mistake(this);
    }
  }
}
