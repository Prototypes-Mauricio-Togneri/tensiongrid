import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_bomb.dart';
import 'package:tensiongrid/domain/types/event_type.dart';

class EventBomb extends Event<TileBomb> {
  EventBomb({
    required super.id,
    required super.timestamp,
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
}
