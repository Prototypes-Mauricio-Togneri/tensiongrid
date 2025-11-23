import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

abstract class Stage {
  final String id;
  final String info;
  final int width;
  final int height;
  final List<Tile> tiles;
  final int numberOfTiles;
  int _score = 0;
  int tilesRemoved = 0;

  Stage({
    required this.id,
    required this.info,
    required this.width,
    required this.height,
    required this.tiles,
    required this.numberOfTiles,
  });

  bool get isCompleted => tilesRemoved >= numberOfTiles;

  void removeTile(Tile tile) {
    tiles.remove(tile);
    tilesRemoved++;
  }

  void addScore(int score) {
    _score += score;
  }

  int get score => _score;

  ActionResult onTileTapped(Tile tile);
}
