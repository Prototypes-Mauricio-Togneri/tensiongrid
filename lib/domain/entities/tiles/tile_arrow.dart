import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/tiles/tile_arrow_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/arrow.dart';

class TileArrow extends Tile {
  final Arrow arrow;

  TileArrow({
    required super.x,
    required super.y,
    required super.color,
    required this.arrow,
  }) : super(category: arrow.name);

  @override
  TileComponent component({
    required Vector2 position,
    required Vector2 size,
  }) => TileArrowComponent(
    position: position,
    size: size,
    tile: this,
  );
}
