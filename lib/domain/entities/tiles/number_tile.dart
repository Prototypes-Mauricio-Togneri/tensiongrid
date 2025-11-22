import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/tiles/number_tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/timeout.dart';

class NumberTile extends Tile {
  final int number;
  final NumberType type;

  NumberTile({
    required this.number,
    required this.type,
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
