import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/direction.dart';

abstract class Event<T extends Tile> {
  final String id;
  final double timestamp;
  final List<T> tilesRemoved = [];
  final List<T> tilesActive = [];
  final double timeout;
  int numberOfTiles = 0;
  double elapsedTime = 0;
  bool _hasStarted = false;
  bool _isPressed = false;

  Event({
    required this.id,
    required this.timestamp,
    required this.timeout,
    required List<T> tiles,
  }) {
    tilesActive.addAll(tiles);
    numberOfTiles = tiles.length;
  }

  bool get hasStarted => _hasStarted;

  bool get isPressed => _isPressed;

  void addTile(T tile) {
    tilesActive.add(tile);
    numberOfTiles++;
    onTileAdded(tile);
  }

  void onTileAdded(T tile) {}

  void removeTile(T tile) {
    tilesActive.remove(tile);
    tilesRemoved.add(tile);
  }

  bool update(double dt) {
    if (!_isPressed) {
      elapsedTime += dt;
    }

    for (final T tile in tilesActive) {
      tile.update(dt);
    }

    return elapsedTime >= timeout;
  }

  int get pointsFail;

  int get pointsSuccess;

  double get remainingTime => timeout - elapsedTime;

  bool isNew(double time) => timestamp <= time;

  ActionResult onTilePressed({
    required T tile,
    required double time,
  }) {
    _isPressed = true;
    _hasStarted = true;

    return tilePressed(
      tile: tile,
      time: time,
    );
  }

  ActionResult tilePressed({
    required T tile,
    required double time,
  }) => ActionResult.neutral(this);

  ActionResult onTileTapped({
    required T tile,
    required double time,
  }) {
    _isPressed = false;
    _hasStarted = true;

    return tileTapped(
      tile: tile,
      time: time,
    );
  }

  ActionResult tileTapped({
    required T tile,
    required double time,
  }) => ActionResult.neutral(this);

  ActionResult onTileSwiped({
    required T tile,
    required Direction direction,
  }) {
    _isPressed = true;
    _hasStarted = true;

    return tileSwiped(
      tile: tile,
      direction: direction,
    );
  }

  ActionResult tileSwiped({
    required T tile,
    required Direction direction,
  }) => ActionResult.neutral(this);
}
