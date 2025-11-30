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
  int get pointsFail => hasStarted ? 10 : 20;

  @override
  int get pointsSuccess => 0;

  bool isTimeCompleted(double time) => time >= timeout / 2;

  @override
  ActionResult onTilePressed({
    required TileBomb tile,
    required double time,
  }) {
    if (isTimeCompleted(time)) {
      removeTile(tile);

      return ActionResult(
        score: pointsSuccess,
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
        score: pointsSuccess,
        eventCompleted: true,
        removeTile: true,
        soundTap: true,
      );
    } else {
      return ActionResult(
        score: -pointsFail,
        removeTile: true,
        soundError: true,
      );
    }
  }
}
