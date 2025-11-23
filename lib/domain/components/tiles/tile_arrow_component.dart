import 'dart:async';
import 'dart:ui';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_arrow.dart';
import 'package:tensiongrid/domain/types/arrow.dart';
import 'package:tensiongrid/utils/palette.dart';

class TileArrowComponent extends TileComponent<TileArrow> {
  final Paint paintShape = Palette.paint(
    style: PaintingStyle.stroke,
  );

  TileArrowComponent({
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

    switch (tile.arrow) {
      case Arrow.arrow_up:
        final Path path = _arrowUpPath();
        canvas.drawPath(path, paintShape);
      case Arrow.arrow_down:
        final Path path = _arrowDownPath();
        canvas.drawPath(path, paintShape);
      case Arrow.arrow_left:
        final Path path = _arrowLeftPath();
        canvas.drawPath(path, paintShape);
      case Arrow.arrow_right:
        final Path path = _arrowRightPath();
        canvas.drawPath(path, paintShape);
    }
  }

  Path _arrowUpPath() => Path()
    // Arrow head - top point
    ..moveTo(size.x / 2, size.y / 4)
    // Arrow head - left side (bigger head)
    ..lineTo(size.x / 4, size.y / 2)
    // Arrow shaft - left side (thicker shaft)
    ..lineTo(size.x * 2 / 5, size.y / 2)
    ..lineTo(size.x * 2 / 5, size.y * 3 / 4)
    // Arrow shaft - bottom (thicker shaft)
    ..lineTo(size.x * 3 / 5, size.y * 3 / 4)
    // Arrow shaft - right side (thicker shaft)
    ..lineTo(size.x * 3 / 5, size.y / 2)
    // Arrow head - right side (bigger head)
    ..lineTo(size.x * 3 / 4, size.y / 2)
    // Back to top point
    ..close();

  Path _arrowDownPath() => Path()
    // Arrow head - bottom point
    ..moveTo(size.x / 2, size.y * 3 / 4)
    // Arrow head - left side (bigger head)
    ..lineTo(size.x / 4, size.y / 2)
    // Arrow shaft - left side (thicker shaft)
    ..lineTo(size.x * 2 / 5, size.y / 2)
    ..lineTo(size.x * 2 / 5, size.y / 4)
    // Arrow shaft - top (thicker shaft)
    ..lineTo(size.x * 3 / 5, size.y / 4)
    // Arrow shaft - right side (thicker shaft)
    ..lineTo(size.x * 3 / 5, size.y / 2)
    // Arrow head - right side (bigger head)
    ..lineTo(size.x * 3 / 4, size.y / 2)
    // Back to bottom point
    ..close();

  Path _arrowLeftPath() => Path()
    // Arrow head - left point
    ..moveTo(size.x / 4, size.y / 2)
    // Arrow head - top side (bigger head)
    ..lineTo(size.x / 2, size.y / 4)
    // Arrow shaft - top side (thicker shaft)
    ..lineTo(size.x / 2, size.y * 2 / 5)
    ..lineTo(size.x * 3 / 4, size.y * 2 / 5)
    // Arrow shaft - right (thicker shaft)
    ..lineTo(size.x * 3 / 4, size.y * 3 / 5)
    // Arrow shaft - bottom side (thicker shaft)
    ..lineTo(size.x / 2, size.y * 3 / 5)
    // Arrow head - bottom side (bigger head)
    ..lineTo(size.x / 2, size.y * 3 / 4)
    // Back to left point
    ..close();

  Path _arrowRightPath() => Path()
    // Arrow head - right point
    ..moveTo(size.x * 3 / 4, size.y / 2)
    // Arrow head - top side (bigger head)
    ..lineTo(size.x / 2, size.y / 4)
    // Arrow shaft - top side (thicker shaft)
    ..lineTo(size.x / 2, size.y * 2 / 5)
    ..lineTo(size.x / 4, size.y * 2 / 5)
    // Arrow shaft - left (thicker shaft)
    ..lineTo(size.x / 4, size.y * 3 / 5)
    // Arrow shaft - bottom side (thicker shaft)
    ..lineTo(size.x / 2, size.y * 3 / 5)
    // Arrow head - bottom side (bigger head)
    ..lineTo(size.x / 2, size.y * 3 / 4)
    // Back to right point
    ..close();
}
