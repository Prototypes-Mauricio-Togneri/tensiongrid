import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_quantity.dart';

class EventQuantity extends Event<TileQuantity> {
  final int quantity;
  late int count;

  EventQuantity({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
    required this.quantity,
  }) {
    count = quantity;
  }

  @override
  int get pointsFail => hasStarted ? (quantity - count) : quantity;

  @override
  int get pointsSuccess => quantity * 2;

  @override
  ActionResult onTileTapped({
    required TileQuantity tile,
    required double time,
  }) {
    super.onTileTapped(tile: tile, time: time);

    if (count > 0) {
      count--;
    }

    tile.decrementCounter();

    if (count == 0) {
      removeTile(tile);

      return ActionResult(
        event: this,
        score: pointsSuccess,
        eventCompleted: true,
        removeTile: true,
        soundTap: true,
      );
    } else {
      return ActionResult(
        event: this,
        soundTap: true,
      );
    }
  }
}
