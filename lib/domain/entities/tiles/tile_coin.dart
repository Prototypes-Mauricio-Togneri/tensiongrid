import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_coin_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class TileCoin extends Tile {
  TileCoin({
    required super.location,
    required super.event,
  });

  @override
  TileComponent component({
    required Vector2 position,
    required Vector2 size,
    required GridComponent gridComponent,
  }) => TileCoinComponent(
    position: position,
    size: size,
    tile: this,
    gridComponent: gridComponent,
  );
}
