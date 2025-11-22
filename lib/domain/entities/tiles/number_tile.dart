import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/tiles/number_tile.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class NumberTile extends Tile {
  final int number;

  NumberTile({
    required this.number,
    required super.x,
    required super.y,
    required super.color,
  });

  @override
  NumberTileComponent component({
    required Vector2 position,
    required Vector2 size,
  }) => NumberTileComponent(
    position: position,
    size: size,
    tile: this,
  );
}
