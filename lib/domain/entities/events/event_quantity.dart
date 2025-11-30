import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_quantity.dart';

class EventQuantity extends Event<TileQuantity> {
  final int quantity;
  int counter = 0;

  EventQuantity({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
    required this.quantity,
  });

  @override
  int get pointsFail => hasStarted ? (quantity - counter) : quantity;

  @override
  int get pointsSuccess => quantity * 2;

  @override
  ActionResult onTileTapped({
    required TileQuantity tile,
    required double time,
  }) {
    super.onTileTapped(tile: tile, time: time);

    if (counter > 0) {
      counter--;
    }

    tile.decrementCounter();

    if (counter == 0) {
      removeTile(tile);

      return ActionResult(
        score: pointsSuccess,
        eventCompleted: true,
        removeTile: true,
        soundTap: true,
      );
    } else {
      return const ActionResult(soundTap: true);
    }
  }
}
