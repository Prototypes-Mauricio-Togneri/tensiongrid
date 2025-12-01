import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_chest.dart';

class EventChest extends Event<TileChest> {
  EventChest({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
  });

  @override
  int get pointsFail => hasStarted ? 10 : 5;

  @override
  int get pointsSuccess => 50;

  bool isTimeCompleted(double time) => time >= timeout / 2;

  @override
  ActionResult onTilePressed({
    required TileChest tile,
    required double time,
  }) {
    super.onTilePressed(tile: tile, time: time);

    if (isTimeCompleted(time)) {
      removeTile(tile);

      return ActionResult(
        event: this,
        score: pointsSuccess,
        eventCompleted: true,
        removeTile: true,
        soundTap: true,
      );
    } else {
      return ActionResult(event: this);
    }
  }

  @override
  ActionResult onTileTapped({
    required TileChest tile,
    required double time,
  }) {
    super.onTileTapped(tile: tile, time: time);

    if (isTimeCompleted(time)) {
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
        removeTile: true,
        soundError: true,
      );
    }
  }
}
