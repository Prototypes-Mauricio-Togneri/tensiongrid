import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class EventCoin extends Event {
  EventCoin({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
  });

  @override
  bool get isCompleted => tilesRemoved.length >= numberOfTiles;

  @override
  int get pointsTimeout => 1;

  @override
  int get pointsCompleted => 5 + remainingTime;

  @override
  ActionResult onTileTapped(Tile tile) {
    return ActionResult(
      score: pointsCompleted,
      eventCompleted: true,
      removeTile: true,
      soundTap: true,
    );
  }
}
