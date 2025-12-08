import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/components/tiles/tile_quantity_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/json/json_tile.dart';

class TileQuantity extends Tile {
  final int quantity;
  late int counter;

  TileQuantity({
    required super.location,
    required super.event,
    required this.quantity,
  }) {
    counter = quantity;
  }

  void decrementCounter() {
    if (counter > 0) {
      counter--;
    }
  }

  @override
  TileComponent component({
    required Vector2 position,
    required Vector2 size,
    required GridComponent gridComponent,
  }) => TileQuantityComponent(
    position: position,
    size: size,
    tile: this,
    gridComponent: gridComponent,
  );

  @override
  JsonTile get json => JsonTile(
    location: location.json,
    quantity: quantity,
    direction: null,
    number: null,
    category: null,
    value: null,
  );
}
