import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/location.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_bomb.dart';
import 'package:tensiongrid/domain/types/event_type.dart';

class EventBomb extends Event<TileBomb> {
  static const double duration = 5;

  EventBomb({
    required super.trigger,
    required super.timeout,
    required super.tiles,
  }) : super(type: EventType.bomb);

  @override
  int get pointsFail => hasStarted ? 10 : 20;

  @override
  int get pointsSuccess => 0;

  bool _isTimeCompleted(double time) => time >= 3;

  @override
  ActionResult tilePressed({
    required TileBomb tile,
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
    required TileBomb tile,
    required double time,
  }) {
    if (_isTimeCompleted(time)) {
      return ActionResult.completed(this);
    } else {
      return ActionResult.penalty(this);
    }
  }

  factory EventBomb.create({
    required double trigger,
    required List<Location> locations,
  }) {
    final EventBomb event = EventBomb(
      trigger: trigger,
      timeout: duration,
      tiles: [],
    );

    for (final Location location in locations) {
      event.addTile(
        TileBomb(
          location: location,
          event: event,
        ),
      );
    }

    return event;
  }
}
