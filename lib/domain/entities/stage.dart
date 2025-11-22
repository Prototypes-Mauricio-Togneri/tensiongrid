import 'package:tensiongrid/domain/entities/tile.dart';

class Stage {
  final String id;
  final String info;
  final List<Tile> tiles;

  const Stage({
    required this.id,
    required this.info,
    required this.tiles,
  });
}
