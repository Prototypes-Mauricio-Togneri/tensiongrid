import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/tiles/tile_coin_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class TileCoin extends Tile {
  TileCoin({
    required super.x,
    required super.y,
    required super.color,
  });

  @override
  TileComponent component({
    required Vector2 position,
    required Vector2 size,
  }) => TileCoinComponent(
    position: position,
    size: size,
    tile: this,
  );
}
