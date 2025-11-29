import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_swipe_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/direction.dart';

class TileSwipe extends Tile {
  final Direction direction;

  TileSwipe({
    required super.x,
    required super.y,
    required super.color,
    required this.direction,
  });

  @override
  TileComponent component({
    required Vector2 position,
    required Vector2 size,
  }) => TileSwipeComponent(
    position: position,
    size: size,
    tile: this,
  );
}
