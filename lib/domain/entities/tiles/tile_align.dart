import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_align_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/json/json_tile.dart';
import 'package:tensiongrid/domain/types/direction.dart';

class TileAlign extends Tile {
  Direction direction;

  TileAlign({
    required super.location,
    required super.event,
    required this.direction,
  });

  @override
  TileComponent component({
    required Vector2 position,
    required Vector2 size,
    required GridComponent gridComponent,
  }) => TileAlignComponent(
    position: position,
    size: size,
    tile: this,
    gridComponent: gridComponent,
  );

  @override
  JsonTile get json => JsonTile(
    location: location.json,
    direction: direction,
    quantity: null,
    number: null,
    category: null,
    value: null,
  );
}
