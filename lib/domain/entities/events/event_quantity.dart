import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_quantity.dart';
import 'package:tensiongrid/domain/types/event_type.dart';

class EventQuantity extends Event<TileQuantity> {
  int quantity = 0;
  int counter = 0;

  EventQuantity({
    required super.trigger,
    required super.timeout,
    required super.tiles,
  }) : super(type: EventType.quantity);

  @override
  void onTileAdded(TileQuantity tile) {
    quantity = tile.quantity;
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
