import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/tiles/tile_character_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class TileCharacter extends Tile {
  final int index;
  final String value;
  final double size;

  TileCharacter({
    required super.x,
    required super.y,
    required super.color,
    required this.index,
    required this.value,
    required this.size,
  });

  @override
  TileComponent component({
    required Vector2 position,
    required Vector2 size,
  }) => TileCharacterComponent(
    position: position,
    size: size,
    tile: this,
  );
}
