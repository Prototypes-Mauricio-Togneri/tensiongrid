import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_matching.dart';
import 'package:tensiongrid/domain/types/category.dart';
import 'package:tensiongrid/domain/types/event_type.dart';

class EventMatching extends Event<TileMatching> {
  Category? category;
  int validTiles = 0;
  int count = 0;

  EventMatching({
    required super.trigger,
    required super.timeout,
    required super.tiles,
  }) : super(type: EventType.matching);

  @override
  void onTileAdded(TileMatching tile) {
    category = _getCategory(tilesActive);
    validTiles = tilesActive.where((tile) => tile.category == category).length;
  }

  Category _getCategory(List<TileMatching> tiles) {
    final Map<Category, int> categoryCount = {};

    for (final TileMatching tile in tiles) {
      categoryCount[tile.category] = (categoryCount[tile.category] ?? 0) + 1;
    }

    Category result = categoryCount.keys.first;
    int maxCount = 0;

    for (final MapEntry<Category, int> entry in categoryCount.entries) {
      if (entry.value > maxCount) {
        maxCount = entry.value;
        result = entry.key;
      }
    }

    return result;
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
