import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_directional_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/direction.dart';

class TileDirectional extends Tile {
  final Direction direction;

  TileDirectional({
    required super.x,
    required super.y,
    required super.color,
    required this.direction,
  });

  @override
  TileComponent component({
    required Vector2 position,
    required Vector2 size,
    required GridComponent gridComponent,
  }) => TileDirectionalComponent(
    position: position,
    size: size,
    tile: this,
    gridComponent: gridComponent,
  );
}
