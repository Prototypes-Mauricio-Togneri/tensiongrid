import 'dart:async';
import 'dart:math';
import 'dart:ui';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/number_tile.dart';
import 'package:tensiongrid/domain/types/number_type.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/formatter.dart';
import 'package:tensiongrid/utils/palette.dart';

class NumberTileComponent extends TileComponent<NumberTile> {
  final Paint paintDots = Palette.paint(
    style: PaintingStyle.fill,
  );
  late final TextNeonPaint neonPaint;
  late final double characterSize;

  NumberTileComponent({
    required super.position,
    required super.size,
    required super.match,
    required super.tile,
  });

  @override
  FutureOr onLoad() {
    neonPaint = TextNeonPaint.create(tile.color);
    paintDots.color = tile.color;
    characterSize = size.x / 3;

    return super.onLoad();
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    if (tile.type == NumberType.arabic) {
      canvas.drawText(
        text: '${tile.number}',
        position: size / 2,
        size: characterSize,
        color: const Color(0xffffffff),
      );
    } else if (tile.type == NumberType.roman) {
      final String romanNumeral = Formatter.toRomanNumeral(tile.number);
      canvas.drawText(
        text: romanNumeral,
        position: size / 2,
        size: characterSize,
        color: const Color(0xffffffff),
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
