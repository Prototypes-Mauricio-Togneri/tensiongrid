import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

abstract class Event {
  final String id;
  final int timestamp;
  final List<Tile> tiles;
  final int timeout;
  int elapsedTime = 0;
  int tilesRemoved = 0;

  Event({
    required this.id,
    required this.timestamp,
    required this.timeout,
    required this.tiles,
  });

  void update(double dt) {
    elapsedTime += dt.floor();
  }

  bool isBefore(int time) => timestamp <= time;

  bool get isCompleted;

  bool get isTimedOut => elapsedTime >= timeout;

  void removeTile(Tile tile) {
    tiles.remove(tile);
    tilesRemoved++;
  }

  ActionResult onTileTapped(Tile tile);
}
