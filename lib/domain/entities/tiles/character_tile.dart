import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/tiles/character_tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class CharacterTile extends Tile {
  final int value;

  CharacterTile({
    required this.value,
    required super.x,
    required super.y,
    required super.color,
  });

  @override
  CharacterTileComponent component({
    required Vector2 position,
    required Vector2 size,
  }) => CharacterTileComponent(
    position: position,
    size: size,
    tile: this,
  );
}
