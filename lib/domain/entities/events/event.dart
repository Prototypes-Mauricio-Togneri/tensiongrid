import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

abstract class Event {
  final String id;
  final int timestamp;
  final List<Tile> tiles;
  int tilesRemoved = 0;

  Event({
    required this.id,
    required this.timestamp,
    required this.tiles,
  });

  bool get isCompleted;

  void removeTile(Tile tile) {
    tiles.remove(tile);
    tilesRemoved++;
  }

  ActionResult onTileTapped(Tile tile);
}
