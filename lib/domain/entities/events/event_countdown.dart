import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_countdown.dart';
import 'package:tensiongrid/domain/types/direction.dart';

class EventCountdown extends Event<TileCountdown> {
  EventCountdown({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
  });

  @override
  int get pointsTimeout => timeout.ceil();

  @override
  int get pointsCompleted => timeout.ceil() - remainingTime;

  @override
  void onTimedout() {
    // TODO(momo): play explosion sound
  }

  @override
  ActionResult onTileTapped(TileCountdown tile) {
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
    required TileCountdown tile,
    required Direction direction,
  }) => const ActionResult();
}
