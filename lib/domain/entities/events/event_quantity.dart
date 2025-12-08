import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_quantity.dart';
import 'package:tensiongrid/domain/types/event_type.dart';

class EventQuantity extends Event<TileQuantity> {
  late final int quantity;
  late int counter;

  EventQuantity({
    required super.trigger,
    required super.timeout,
    required List<TileQuantity> tiles,
  }) : super(type: EventType.quantity, tiles: tiles) {
    quantity = tiles[0].quantity;
    counter = quantity;
  }

  @override
  int get pointsFail => counter;

  @override
  int get pointsSuccess => quantity * 2;

  @override
  ActionResult tileTapped({
    required TileQuantity tile,
    required double time,
  }) {
    if (counter > 0) {
      counter--;
    }

    tile.decrementCounter();

    if (counter == 0) {
      return ActionResult.completed(this);
    } else {
      return ActionResult.tap(this);
    }
  }
}
