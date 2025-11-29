import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_directional.dart';
import 'package:tensiongrid/domain/types/direction.dart';

class EventDirectional extends Event<TileDirectional> {
  EventDirectional({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
  });

  @override
  int get pointsTimeout => 2;

  @override
  int get pointsCompleted => 5 + remainingTime;

  @override
  ActionResult onTileTapped(TileDirectional tile) => const ActionResult();

  @override
  ActionResult onTileSwiped({
    required TileDirectional tile,
    required Direction direction,
  }) {
    if (direction == tile.direction) {
      removeTile(tile);

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
