import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_shape_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/shape.dart';

class TileShape extends Tile {
  final Shape shape;

  TileShape({
    required super.x,
    required super.y,
    required super.color,
    required this.shape,
  }) : super(category: shape.name);

  @override
  TileComponent component({
    required Vector2 position,
    required Vector2 size,
  }) => TileShapeComponent(
    position: position,
    size: size,
    tile: this,
  );
}
