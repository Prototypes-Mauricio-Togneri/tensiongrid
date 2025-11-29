import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

abstract class Event {
  final String id;
  final double timestamp;
  final List<Tile> tilesRemoved = [];
  final List<Tile> tilesActive = [];
  final int timeout;
  late final int numberOfTiles;
  double elapsedTime = 0;

  Event({
    required this.id,
    required this.timestamp,
    required this.timeout,
    required List<Tile> tiles,
  }) {
    tilesActive.addAll(tiles);
    numberOfTiles = tiles.length;
  }

  bool update(double dt) {
    elapsedTime += dt;

    return elapsedTime >= timeout;
  }

  bool get isStarted => tilesRemoved.isNotEmpty;

  bool get isCompleted => false;

  int get pointsCompleted;

  int get pointsTimeout;

  int get remainingTime => (timeout - elapsedTime).ceil();

  bool isBefore(double time) => timestamp <= time;

  bool containsTile(Tile tile) {
    for (final Tile element in tilesActive) {
      if (element == tile) {
        return true;
      }
    }

    return false;
  }

  void removeTile(Tile tile) {
    tilesActive.remove(tile);
    tilesRemoved.add(tile);
  }

  ActionResult onTileTapped(Tile tile);
}
