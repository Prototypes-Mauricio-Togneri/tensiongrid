import 'dart:math';

enum Direction {
  up,
  down,
  left,
  right;

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
}
