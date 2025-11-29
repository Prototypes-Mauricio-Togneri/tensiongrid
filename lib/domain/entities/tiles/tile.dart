import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';

abstract class Tile {
  late final String id;
  final int x;
  final int y;
  final Color color;

  Tile({
    required this.x,
    required this.y,
    required this.color,
  }) {
    id = '$x,$y';
  }

  TileComponent component({
    required Vector2 position,
    required Vector2 size,
  });

  @override
  bool operator ==(Object other) =>
      other is Tile &&
      other.runtimeType == runtimeType &&
      other.hashCode == hashCode;

  @override
  int get hashCode => id.hashCode;
}
