import 'package:tensiongrid/domain/entities/tiles/tile.dart';

abstract class Stage {
  final String id;
  final String info;
  final int width;
  final int height;
  final List<Tile> tiles;

  const Stage({
    required this.id,
    required this.info,
    required this.width,
    required this.height,
    required this.tiles,
  });

  void onTileTapped(Tile tile);
}
