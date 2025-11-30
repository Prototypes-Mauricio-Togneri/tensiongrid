import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_countdown_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class TileCountdown extends Tile {
  double timeout;

  TileCountdown({
    required super.x,
    required super.y,
    required super.color,
    required super.event,
    required this.timeout,
  });

  @override
  void update(double dt) {
    super.update(dt);

    timeout -= dt;

    if (timeout < 0) {
      timeout = 0;
    }
  }

  @override
  TileComponent component({
    required Vector2 position,
    required Vector2 size,
    required GridComponent gridComponent,
  }) => TileCountdownComponent(
    position: position,
    size: size,
    tile: this,
    gridComponent: gridComponent,
  );
}
