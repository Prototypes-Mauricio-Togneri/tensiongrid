import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/location.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_chest.dart';
import 'package:tensiongrid/domain/types/event_type.dart';

class EventChest extends Event<TileChest> {
  static const double duration = 5;

  EventChest({
    required super.trigger,
    required super.timeout,
    required super.tiles,
  }) : super(type: EventType.chest);

  @override
  int get pointsFail => hasStarted ? 10 : 5;

  @override
  int get pointsSuccess => 30;

  bool _isTimeCompleted(double time) => time >= 3;

  @override
  ActionResult tilePressed({
    required TileChest tile,
    required double time,
  }) {
    if (_isTimeCompleted(time)) {
      return ActionResult.completed(this);
    } else {
      return ActionResult.neutral(this);
    }
  }

  @override
  ActionResult tileTapped({
    required TileChest tile,
    required double time,
  }) {
    if (_isTimeCompleted(time)) {
      return ActionResult.completed(this);
    } else {
      return ActionResult.penalty(this);
    }
  }

  factory EventChest.create({
    required double trigger,
    required List<Location> locations,
  }) {
    final EventChest event = EventChest(
      trigger: trigger,
      timeout: duration,
      tiles: [],
    );

    for (final Location location in locations) {
      event.addTile(
        TileChest(
          location: location,
          event: event,
        ),
      );
    }

    return event;
  }
}
