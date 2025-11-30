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
  bool get isStarted => tilesRemoved.isNotEmpty;

  @override
  int get pointsTimeout => isStarted ? 10 : 0;

  @override
  int get pointsCompleted => 50;

  bool isTimeCompleted(double time) => time >= timeout / 2;

  @override
  ActionResult onTilePressed({
    required TileChest tile,
    required double time,
  }) {
    if (isTimeCompleted(time)) {
      removeTile(tile);

      return ActionResult(
        score: pointsCompleted,
        eventCompleted: true,
        removeTile: true,
        soundTap: true,
      );
    } else {
      return const ActionResult();
    }
  }

  @override
  ActionResult onTileTapped({
    required TileChest tile,
    required double time,
  }) {
    if (isTimeCompleted(time)) {
      removeTile(tile);

      return ActionResult(
        score: pointsCompleted,
        eventCompleted: true,
        removeTile: true,
        soundTap: true,
      );
    } else {
      return const ActionResult(
        removeTile: true,
        soundError: true,
      );
    }
  }
}
