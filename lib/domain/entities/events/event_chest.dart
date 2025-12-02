import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_chest.dart';

class EventChest extends Event<TileChest> {
  EventChest({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
  });

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
}
