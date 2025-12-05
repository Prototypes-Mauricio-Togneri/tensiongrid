import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';

abstract class Tile {
  late final String id;
  final int x;
  final int y;
  final Event event;

  Tile({
    required this.x,
    required this.y,
    required this.event,
  }) {
    id = '$x,$y';
  }

  void update(double dt) {}

  TileComponent component({
    required Vector2 position,
    required Vector2 size,
    required GridComponent gridComponent,
  });

  @override
  bool operator ==(Object other) =>
      other is Tile &&
      other.runtimeType == runtimeType &&
      other.hashCode == hashCode;

  @override
  int get hashCode => id.hashCode;
}
