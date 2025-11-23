import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

abstract class Stage {
  final String id;
  final String info;
  final int width;
  final int height;
  final List<Tile> tiles;
  int _score = 0;

  Stage({
    required this.id,
    required this.info,
    required this.width,
    required this.height,
    required this.tiles,
  });

  void addScore(int score) {
    _score += score;
  }

  int get score => _score;

  ActionResult onTileTapped(Tile tile);
}
