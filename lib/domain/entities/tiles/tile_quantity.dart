import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_quantity_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class TileQuantity extends Tile {
  final int quantity;

  TileQuantity({
    required super.x,
    required super.y,
    required super.color,
    required super.event,
    required this.quantity,
  });

  @override
  TileComponent component({
    required Vector2 position,
    required Vector2 size,
    required GridComponent gridComponent,
  }) => TileQuantityComponent(
    position: position,
    size: size,
    tile: this,
    gridComponent: gridComponent,
  );
}
