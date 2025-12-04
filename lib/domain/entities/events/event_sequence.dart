import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_sequence.dart';
import 'package:tensiongrid/domain/types/event_type.dart';

class EventSequence extends Event<TileSequence> {
  EventSequence({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
  }) : super(type: EventType.sequence);

  @override
  int get pointsFail => hasStarted ? tilesActive.length : 0;

  @override
  int get pointsSuccess => tilesRemoved.length * 2;

  @override
  ActionResult tileTapped({
    required TileSequence tile,
    required double time,
  }) {
    final int currentIndex = tilesRemoved.length + 1;

    if (tile.number == currentIndex) {
      removeTile(tile);

      if (tilesRemoved.length >= numberOfTiles) {
        return ActionResult.completed(this);
      } else {
        return ActionResult.remove(this);
      }
    } else {
      return ActionResult.mistake(this);
    }
  }
}
