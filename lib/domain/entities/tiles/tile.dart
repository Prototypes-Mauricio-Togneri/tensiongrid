import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/location.dart';
import 'package:tensiongrid/domain/json/json_tile.dart';

abstract class Tile {
  final Location location;
  final Event event;

  Tile({
    required this.location,
    required this.event,
  });

  void update(double dt) {}

  TileComponent component({
    required Vector2 position,
    required Vector2 size,
    required GridComponent gridComponent,
  });

  JsonTile get json;

  @override
  bool operator ==(Object other) =>
      other is Tile &&
      other.runtimeType == runtimeType &&
      other.hashCode == hashCode;

  @override
  int get hashCode => location.toString().hashCode;
}
