import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/direction.dart';

abstract class Event<T extends Tile> {
  final String id;
  final double timestamp;
  final List<T> tilesRemoved = [];
  final List<T> tilesActive = [];
  final double timeout;
  int numberOfTiles = 0;
  double elapsedTime = 0;
  bool hasStarted = false;

  Event({
    required this.id,
    required this.timestamp,
    required this.timeout,
    required List<T> tiles,
  }) {
    tilesActive.addAll(tiles);
    numberOfTiles = tiles.length;
  }

  void addTile(T tile) {
    tilesActive.add(tile);
    numberOfTiles++;
  }

  bool update(double dt) {
    elapsedTime += dt;

    for (final T tile in tilesActive) {
      tile.update(dt);
    }

    return elapsedTime >= timeout;
  }

  bool get isCompleted => false;

  int get pointsCompleted;

  int get pointsTimeout;

  double get remainingTime => timeout - elapsedTime;

  bool isNew(double time) => timestamp <= time;

  void removeTile(T tile) {
    tilesActive.remove(tile);
    tilesRemoved.add(tile);
  }

  void onTimedout() {}

  ActionResult onTilePressed({
    required T tile,
    required double time,
  }) => const ActionResult();

  ActionResult onTileTapped({
    required T tile,
    required double time,
  }) => const ActionResult();

  ActionResult onTileSwiped({
    required T tile,
    required Direction direction,
  }) => const ActionResult();
}
