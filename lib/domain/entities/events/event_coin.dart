import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_coin.dart';
import 'package:tensiongrid/domain/types/event_type.dart';

class EventCoin extends Event<TileCoin> {
  EventCoin({
    required super.trigger,
    required super.timeout,
    required super.tiles,
  }) : super(type: EventType.coin);

  @override
  int get pointsFail => 1;

  @override
  int get pointsSuccess => 5 + remainingTime.floor();

  @override
  ActionResult tileTapped({
    required TileCoin tile,
    required double time,
  }) => ActionResult.completed(this);
}
