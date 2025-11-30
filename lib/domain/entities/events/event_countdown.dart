import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_countdown.dart';

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
  int get pointsCompleted => (timeout - remainingTime).floor();

  @override
  void onTimedout() {
    // TODO(momo): play explosion sound
  }

  @override
  ActionResult onTileTapped({
    required TileCountdown tile,
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
}
