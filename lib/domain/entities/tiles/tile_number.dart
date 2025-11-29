import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_number_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/number_type.dart';

class TileNumber extends Tile {
  final int number;
  final NumberType type;

  TileNumber({
    required super.x,
    required super.y,
    required super.color,
    required this.number,
    required this.type,
  });

  @override
  TileComponent component({
    required Vector2 position,
    required Vector2 size,
  }) => TileNumberComponent(
    position: position,
    size: size,
    tile: this,
  );
}
