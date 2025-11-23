import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/tiles/number_tile_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/number_type.dart';

class NumberTile extends Tile {
  final int number;
  final NumberType type;

  NumberTile({
    required this.number,
    required this.type,
    required super.x,
    required super.y,
    required super.color,
  });

  @override
  TileComponent component({
    required Match match,
    required Vector2 position,
    required Vector2 size,
  }) => NumberTileComponent(
    position: position,
    size: size,
    tile: this,
    match: match,
  );
}
