import 'package:flame/components.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class Dimensions {
  static Vector2 cameraResolution(Vector2 canvasSize) => Vector2(
    Constants.UI_WIDTH.toDouble(),
    (canvasSize.y / canvasSize.x) * Constants.UI_WIDTH,
  );

  static Vector2 fpsPosition(Vector2 canvasSize) => Vector2(
    (canvasSize.x / 2) - 40,
    canvasSize.y - 40,
  );

  static Vector2 topbarPosition(Vector2 resolution) => Vector2(
    0,
    -(resolution.y / 2) + (Constants.TOPBAR_HEIGHT / 2),
  );

  static Vector2 topbarSize(Vector2 resolution) => Vector2(
    resolution.x,
    Constants.TOPBAR_HEIGHT.toDouble(),
  );

  static Vector2 gridSize() => Vector2(
    Constants.GRID_SIZE.toDouble(),
    Constants.GRID_SIZE.toDouble(),
  );

  static Vector2 tileSize({
    required Vector2 size,
    required int width,
    required int height,
  }) => Vector2(
    size.x / width,
    size.y / height,
  );

  static Vector2 tilePosition({
    required Tile tile,
    required Vector2 tileSize,
  }) => Vector2(
    (tile.x * tileSize.x) + tileSize.x / 2,
    (tile.y * tileSize.y) + tileSize.y / 2,
  );
}
