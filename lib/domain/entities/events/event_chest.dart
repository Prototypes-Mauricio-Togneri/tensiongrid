import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_chest.dart';
import 'package:tensiongrid/domain/types/direction.dart';

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

  @override
  ActionResult onTileTapped({
    required TileChest tile,
    required double time,
  }) {
    removeTile(tile);

    if (time >= timeout / 2) {
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

  @override
  ActionResult onTileSwiped({
    required TileChest tile,
    required Direction direction,
  }) => const ActionResult();
}
