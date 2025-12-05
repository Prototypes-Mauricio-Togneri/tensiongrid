import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_countdown.dart';
import 'package:tensiongrid/domain/types/event_type.dart';

class EventCountdown extends Event<TileCountdown> {
  EventCountdown({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
  }) : super(type: EventType.countdown);

  @override
  int get pointsFail => timeout.ceil();

  @override
  int get pointsSuccess => (timeout - remainingTime).ceil();

  @override
  ActionResult tileTapped({
    required TileCountdown tile,
    required double time,
  }) => ActionResult.completed(this);
}
