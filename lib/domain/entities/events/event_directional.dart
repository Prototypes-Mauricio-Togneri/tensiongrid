import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/location.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_directional.dart';
import 'package:tensiongrid/domain/types/direction.dart';
import 'package:tensiongrid/domain/types/event_type.dart';
import 'package:tensiongrid/utils/generator.dart';

class EventDirectional extends Event<TileDirectional> {
  static const double duration = 3;

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

  factory EventDirectional.create({
    required double trigger,
    required List<Location> locations,
  }) {
    final EventDirectional event = EventDirectional(
      trigger: trigger,
      timeout: duration,
      tiles: [],
    );

    for (final Location location in locations) {
      event.addTile(
        TileDirectional(
          location: location,
          event: event,
          direction: randomEnum(Direction.values),
        ),
      );
    }

    return event;
  }
}
