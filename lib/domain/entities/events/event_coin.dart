import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_coin.dart';

class EventCoin extends Event<TileCoin> {
  EventCoin({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
  });

  @override
  int get pointsFail => 1;

  @override
  int get pointsSuccess => 5 + remainingTime.floor();

  @override
  ActionResult tileTapped({
    required TileCoin tile,
    required double time,
  }) {
    removeTile(tile);

    return ActionResult.completed(this);
  }
}
