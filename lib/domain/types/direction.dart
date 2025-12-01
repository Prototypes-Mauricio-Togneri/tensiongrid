import 'dart:math';
import 'dart:ui';

import 'package:tensiongrid/utils/palette.dart';

enum Direction {
  up,
  down,
  left,
  right;

  Direction get next {
    switch (this) {
      case Direction.up:
        return Direction.right;
      case Direction.right:
        return Direction.down;
      case Direction.down:
        return Direction.left;
      case Direction.left:
        return Direction.up;
    }
  }

  double get angle {
    switch (this) {
      case Direction.right:
        return 0;
      case Direction.up:
        return -pi / 2;
      case Direction.down:
        return pi / 2;
      case Direction.left:
        return pi;
    }
  }

  Color get color {
    switch (this) {
      case Direction.up:
        return Palette.TILE_RED;
      case Direction.down:
        return Palette.TILE_BLUE;
      case Direction.left:
        return Palette.TILE_GREEN;
      case Direction.right:
        return Palette.TILE_YELLOW;
    }
  }
}
