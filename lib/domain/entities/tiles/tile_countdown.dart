import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_countdown_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/json/json_tile.dart';

class TileCountdown extends Tile {
  double timeout;

  TileCountdown({
    required super.location,
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

  @override
  JsonTile get json => JsonTile(
    location: location.json,
    quantity: null,
    number: null,
    category: null,
    value: null,
    direction: null,
  );
}
