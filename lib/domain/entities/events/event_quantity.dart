import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_quantity.dart';
import 'package:tensiongrid/domain/types/event_type.dart';

class EventQuantity extends Event<TileQuantity> {
  final int quantity;
  late int count;

  EventQuantity({
    required super.timestamp,
    required super.timeout,
    required super.tiles,
    required this.quantity,
  }) : super(type: EventType.quantity) {
    count = quantity;
  }

  @override
  int get pointsFail => count;

  @override
  int get pointsSuccess => quantity * 2;

  @override
  ActionResult tileTapped({
    required TileQuantity tile,
    required double time,
  }) {
    if (count > 0) {
      count--;
    }

    tile.decrementCounter();

    if (count == 0) {
      return ActionResult.completed(this);
    } else {
      return ActionResult.tap(this);
    }
  }
}
