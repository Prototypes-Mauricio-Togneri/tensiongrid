import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_directional.dart';
import 'package:tensiongrid/domain/types/direction.dart';
import 'package:tensiongrid/domain/types/event_type.dart';

class EventDirectional extends Event<TileDirectional> {
  EventDirectional({
    required super.trigger,
    required super.timeout,
    required super.tiles,
  }) : super(type: EventType.directional);

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
      return ActionResult.completed(this);
    } else {
      return ActionResult.penalty(this);
    }
  }
}
