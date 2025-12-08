import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_coin_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/json/json_tile.dart';

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

  @override
  JsonTile get json => JsonTile(
    location: location.json,
    quantity: null,
    number: null,
    category: null,
    value: null,
    direction: null,
  );
}
