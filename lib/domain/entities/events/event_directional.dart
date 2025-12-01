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
  int get pointsFail => 2;

  @override
  int get pointsSuccess => 10 + remainingTime.floor();

  @override
  ActionResult tileSwiped({
    required TileDirectional tile,
    required Direction direction,
  }) {
    if (direction == tile.direction) {
      removeTile(tile);

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
        score: -10, // TODO(momo): use score for error
        soundError: true,
      );
    }
  }
}
