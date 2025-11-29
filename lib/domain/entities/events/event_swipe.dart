import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_swipe.dart';
import 'package:tensiongrid/domain/types/direction.dart';

class EventSwipe extends Event<TileSwipe> {
  EventSwipe({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
  });

  @override
  int get pointsTimeout => 1;

  @override
  int get pointsCompleted => 5 + remainingTime;

  @override
  ActionResult onTileTapped(TileSwipe tile) => const ActionResult();

  @override
  ActionResult onTileSwiped({
    required TileSwipe tile,
    required Direction direction,
  }) {
    if (direction == tile.direction) {
      return ActionResult(
        score: pointsCompleted,
        eventCompleted: true,
        removeTile: true,
        soundTap: true,
      );
    } else {
      return const ActionResult(
        score: -10, // TODO(momo): use score for error
        soundError: true,
      );
    }
  }
}
