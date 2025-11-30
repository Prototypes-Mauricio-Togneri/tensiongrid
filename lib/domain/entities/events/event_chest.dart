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
  int get pointsTimeout => 5;

  @override
  int get pointsCompleted => 50;

  @override
  ActionResult onTileTapped({
    required TileChest tile,
    required double time,
  }) {
    removeTile(tile);

    return ActionResult(
      score: pointsCompleted,
      eventCompleted: true,
      removeTile: true,
      soundTap: true,
    );
  }

  @override
  ActionResult onTileSwiped({
    required TileChest tile,
    required Direction direction,
  }) => const ActionResult();
}
