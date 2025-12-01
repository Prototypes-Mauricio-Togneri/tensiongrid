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
  int get pointsFail => timeout.ceil();

  @override
  int get pointsSuccess => (timeout - remainingTime).floor();

  @override
  void onFailed() {
    // TODO(momo): play explosion sound
  }

  @override
  ActionResult onTileTapped({
    required TileCountdown tile,
    required double time,
  }) {
    super.onTileTapped(tile: tile, time: time);

    removeTile(tile);

    return ActionResult(
      event: this,
      score: pointsSuccess,
      eventCompleted: true,
      removeTile: true,
      soundTap: true,
    );
  }
}
