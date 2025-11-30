import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_quantity.dart';

class EventQuantity extends Event<TileQuantity> {
  final int quantity;

  EventQuantity({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
    required this.quantity,
  });

  @override
  int get pointsFail => 1;

  @override
  int get pointsSuccess => 5 + remainingTime.floor();

  @override
  ActionResult onTileTapped({
    required TileQuantity tile,
    required double time,
  }) {
    super.onTileTapped(tile: tile, time: time);

    removeTile(tile);

    return ActionResult(
      score: pointsSuccess,
      eventCompleted: true,
      removeTile: true,
      soundTap: true,
    );
  }
}
