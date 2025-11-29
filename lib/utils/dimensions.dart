import 'dart:math';
import 'package:flame/components.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class Dimensions {
  static Vector2 cameraResolution(Vector2 canvasSize) => Vector2(
    Constants.UI_WIDTH.toDouble(),
    (canvasSize.y / canvasSize.x) * Constants.UI_WIDTH,
  );

  static Vector2 fpsPosition(Vector2 canvasSize) => Vector2(
    canvasSize.x - 85,
    canvasSize.y - 35,
  );

  static Vector2 topbarPosition(Vector2 resolution) => Vector2(
    0,
    -(resolution.y / 2) + (Constants.TOPBAR_HEIGHT / 2),
  );

  static Vector2 topbarSize(Vector2 resolution) => Vector2(
    resolution.x,
    Constants.TOPBAR_HEIGHT.toDouble(),
  );

  static Vector2 gridSize(Vector2 resolution) {
    final double gridSize = min(resolution.x, resolution.y) * 0.95;

    return Vector2(gridSize, gridSize);
  }

  static Vector2 playerIndicatorPosition({
    required Vector2 containerSize,
    required Vector2 indicatorSize,
    required int playerIndex,
  }) {
    if (playerIndex == Constants.PLAYER_1) {
      return Vector2(
            indicatorSize.x / 2,
            indicatorSize.y / 2,
          ) -
          Vector2(containerSize.y / 10, containerSize.y / 10);
    } else if (playerIndex == Constants.PLAYER_2) {
      return Vector2(
            containerSize.x - (indicatorSize.x / 2),
            indicatorSize.y / 2,
          ) -
          Vector2(-containerSize.y / 10, containerSize.y / 10);
    } else {
      throw Exception('Invalid player index: $playerIndex');
    }
  }

  static Vector2 playerIndicatorSize(Vector2 toolbarSize) => Vector2(
    toolbarSize.x * 0.375,
    toolbarSize.y,
  );

  static Vector2 playerNamePosition({
    required Vector2 size,
    required int playerIndex,
  }) {
    if (playerIndex == Constants.PLAYER_1) {
      return Vector2(
        size.y / 2,
        size.y * 0.55,
      );
    } else if (playerIndex == Constants.PLAYER_2) {
      return Vector2(
        size.x - size.y / 2,
        size.y * 0.55,
      );
    } else {
      throw Exception('Invalid player index: $playerIndex');
    }
  }

  static Vector2 timePosition(Vector2 size) => Vector2(
    size.x / 2,
    (size.y / 2) - (size.y / 10),
  );

  static Vector2 timeSize(Vector2 toolbarSize) => Vector2(
    toolbarSize.x * 0.25,
    toolbarSize.y,
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
