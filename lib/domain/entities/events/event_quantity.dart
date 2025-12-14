import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/location.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_quantity.dart';
import 'package:tensiongrid/domain/types/event_type.dart';

class EventQuantity extends Event<TileQuantity> {
  int quantity = 0;
  int counter = 0;

  static const double duration = 5;

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

  factory EventQuantity.create({
    required double trigger,
    required int quantity,
    required List<Location> locations,
  }) {
    final EventQuantity event = EventQuantity(
      trigger: trigger,
      timeout: duration,
      tiles: [],
    );

    for (final Location location in locations) {
      event.addTile(
        TileQuantity(
          location: location,
          event: event,
          quantity: quantity,
        ),
      );
    }

    return event;
  }
}
