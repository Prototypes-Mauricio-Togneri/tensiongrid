import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_sequence_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class TileSequence extends Tile {
  final int number;

  TileSequence({
    required super.location,
    required super.event,
    required this.number,
  });

  @override
  TileComponent component({
    required Vector2 position,
    required Vector2 size,
    required GridComponent gridComponent,
  }) => TileSequenceComponent(
    position: position,
    size: size,
    tile: this,
    gridComponent: gridComponent,
  );
}
