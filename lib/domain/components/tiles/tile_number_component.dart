import 'dart:async';
import 'dart:math';
import 'dart:ui';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_number.dart';
import 'package:tensiongrid/domain/types/number_type.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/formatter.dart';
import 'package:tensiongrid/utils/palette.dart';

class TileNumberComponent extends TileComponent<TileNumber> {
  final Paint paintDots = Palette.paint(
    style: PaintingStyle.fill,
  );
  late final NeonPaint neonPaint;
  late final double characterSize;

  TileNumberComponent({
    required super.position,
    required super.size,
    required super.tile,
  });

  @override
  FutureOr onLoad() {
    neonPaint = NeonPaint.create(
      color: tile.color,
      style: PaintingStyle.fill,
    );
    paintDots.color = tile.color;
    characterSize = size.x / 3;

    return super.onLoad();
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    if (tile.type == NumberType.arabic) {
      canvas.drawTextNeon(
        text: '${tile.number}',
        position: size / 2,
        size: size.x / 3,
        paint: neonPaint,
      );
    } else if (tile.type == NumberType.roman) {
      canvas.drawTextNeon(
        text: Formatter.toRomanNumeral(tile.number),
        position: size / 2,
        size: size.x / 3,
        paint: neonPaint,
      );
    } else if (tile.type == NumberType.dots) {
      final double dotSize = (size.x * 0.5) / (tile.number * 3);

      if (tile.number == 1) {
        canvas.drawCircle(
          Offset(size.x / 2, size.y / 2),
          dotSize,
          paintDots,
        );
      } else {
        for (int i = 0; i < tile.number; i++) {
          final double angle = (2 * pi / tile.number) * i;
          final double radius = size.x * 0.2;
          final double x = (size.x / 2) + radius * cos(angle);
          final double y = (size.y / 2) + radius * sin(angle);
          canvas.drawCircle(
            Offset(x, y),
            dotSize,
            paintDots,
          );
        }
      }
    }
  }
}
