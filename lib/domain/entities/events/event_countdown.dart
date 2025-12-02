import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_countdown.dart';

class EventCountdown extends Event<TileCountdown> {
  EventCountdown({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
  });

  @override
  int get pointsFail => timeout.ceil();

  @override
  int get pointsSuccess => (timeout - remainingTime).floor();

  @override
  ActionResult tileTapped({
    required TileCountdown tile,
    required double time,
  }) => ActionResult.completed(this);
}
