import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_bomb.dart';

class EventBomb extends Event<TileBomb> {
  EventBomb({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
  });

  @override
  int get pointsTimeout => hasStarted ? 10 : 20;

  @override
  int get pointsCompleted => 0;

  bool isTimeCompleted(double time) => time >= timeout / 2;

  @override
  ActionResult onTilePressed({
    required TileBomb tile,
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
    required TileBomb tile,
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
