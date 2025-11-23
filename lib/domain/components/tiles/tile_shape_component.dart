import 'dart:async';
import 'dart:math';
import 'dart:ui';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_shape.dart';
import 'package:tensiongrid/domain/types/shape.dart';
import 'package:tensiongrid/utils/palette.dart';

class TileShapeComponent extends TileComponent<TileShape> {
  final Paint paintShape = Palette.paint(
    style: PaintingStyle.stroke,
  );

  TileShapeComponent({
    required super.position,
    required super.size,
    required super.tile,
  });

  @override
  FutureOr onLoad() {
    paintShape.color = tile.color;

    return super.onLoad();
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    switch (tile.shape) {
      case Shape.circle:
        canvas.drawCircle(
          Offset(size.x / 2, size.y / 2),
          size.x / 4,
          paintShape,
        );
      case Shape.triangle:
        final Path path = _trianglePath();
        canvas.drawPath(path, paintShape);
      case Shape.square:
        final Path path = _squarePath();
        canvas.drawPath(path, paintShape);
      case Shape.rombous:
        final Path path = _polygonPath(4);
        canvas.drawPath(path, paintShape);
      case Shape.pentagon:
        final Path path = _polygonPath(5);
        canvas.drawPath(path, paintShape);
      case Shape.hexagon:
        final Path path = _polygonPath(6);
        canvas.drawPath(path, paintShape);
    }
  }

  Path _trianglePath() => Path()
    ..moveTo(size.x / 2, size.y / 4)
    ..lineTo(size.x * 3 / 4, size.y * 3 / 4)
    ..lineTo(size.x / 4, size.y * 3 / 4)
    ..close();

  Path _squarePath() => Path()
    ..moveTo(size.x / 4, size.y / 4)
    ..lineTo(size.x * 3 / 4, size.y / 4)
    ..lineTo(size.x * 3 / 4, size.y * 3 / 4)
    ..lineTo(size.x / 4, size.y * 3 / 4)
    ..close();

  Path _polygonPath(int sides) {
    final double centerX = size.x / 2;
    final double centerY = size.y / 2;
    final double radius = size.x / 4;
    final Path path = Path();

    for (int i = 0; i < sides; i++) {
      final double angle = (i * 2 * pi / sides) - (pi / 2);
      final double x = centerX + radius * cos(angle);
      final double y = centerY + radius * sin(angle);

      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    path.close();

    return path;
  }
}
