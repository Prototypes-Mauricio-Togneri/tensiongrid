import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_matching_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/category.dart';

class TileMatching extends Tile {
  final Category category;
  final String value;

  TileMatching({
    required super.location,
    required super.event,
    required this.category,
    required this.value,
  });

  @override
  TileComponent component({
    required Vector2 position,
    required Vector2 size,
    required GridComponent gridComponent,
  }) => TileMatchingComponent(
    position: position,
    size: size,
    tile: this,
    gridComponent: gridComponent,
  );
}
