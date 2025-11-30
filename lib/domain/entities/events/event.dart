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

  bool get isStarted => tilesRemoved.isNotEmpty;

  bool get isCompleted => false;

  int get pointsCompleted;

  int get pointsTimeout;

  int get remainingTime => (timeout - elapsedTime).floor();

  bool isNew(double time) => timestamp <= time;

  void removeTile(T tile) {
    tilesActive.remove(tile);
    tilesRemoved.add(tile);
  }

  void onTimedout() {}

  ActionResult onTileTapped({
    required T tile,
    required double time,
  });

  ActionResult onTileSwiped({
    required T tile,
    required Direction direction,
  });
}
