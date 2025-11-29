import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

abstract class Event {
  final String id;
  final double timestamp;
  final List<Tile> tiles;
  final int timeout;
  int tilesRemoved = 0;

  Event({
    required this.id,
    required this.timestamp,
    required this.timeout,
    required this.tiles,
  });

  bool isBefore(double time) => timestamp <= time;

  bool get isCompleted;

  bool isTimedOut(double elapsedTime) => elapsedTime >= timeout;

  void removeTile(Tile tile) {
    tiles.remove(tile);
    tilesRemoved++;
  }

  ActionResult onTileTapped(Tile tile);
}
