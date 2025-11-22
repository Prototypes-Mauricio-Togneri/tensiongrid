import 'dart:ui';
import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';

abstract class Tile {
  final int x;
  final int y;
  final Color color;

  const Tile({
    required this.x,
    required this.y,
    required this.color,
  });

  TileComponent component({
    required Vector2 position,
    required Vector2 size,
  });
}
