import 'dart:async';
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

    /*
     // Basic shapes
  circle,
  triangle,
  square,
  pentagon,
  hexagon,

  // Arrow shapes
  arrowUp,
  arrowDown,
  arrowLeft,
  arrowRight,
  */

    switch (tile.shape) {
      case Shape.circle:
        canvas.drawCircle(
          Offset(size.x / 2, size.y / 2),
          size.x / 4,
          paintShape,
        );
      case Shape.triangle:
        final Path path = Path()
          ..moveTo(size.x / 2, size.y / 6)
          ..lineTo(size.x * 5 / 6, size.y * 5 / 6)
          ..lineTo(size.x / 6, size.y * 5 / 6)
          ..close();
        canvas.drawPath(path, paintShape);
      case Shape.square:
        canvas.drawRect(
          Rect.fromLTWH(
            size.x / 4,
            size.y / 4,
            size.x / 2,
            size.y / 2,
          ),
          paintShape,
        );
      case Shape.pentagon:
      // Implementation for pentagon shape
      case Shape.hexagon:
      // Implementation for hexagon shape
      case Shape.arrowUp:
      // Implementation for arrow up shape
      case Shape.arrowDown:
      // Implementation for arrow down shape
      case Shape.arrowLeft:
      // Implementation for arrow left shape
      case Shape.arrowRight:
      // Implementation for arrow right shape
    }
  }
}
