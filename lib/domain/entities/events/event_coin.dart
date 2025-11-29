import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_coin.dart';
import 'package:tensiongrid/domain/types/direction.dart';

class EventCoin extends Event<TileCoin> {
  EventCoin({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
  });

  @override
  int get pointsTimeout => 1;

  @override
  int get pointsCompleted => 5 + remainingTime;

  @override
  ActionResult onTileTapped(Tile tile) => ActionResult(
    score: pointsCompleted,
    eventCompleted: true,
    removeTile: true,
    soundTap: true,
  );

  @override
  ActionResult onTileSwiped({
    required Tile tile,
    required Direction direction,
  }) => const ActionResult();
}
