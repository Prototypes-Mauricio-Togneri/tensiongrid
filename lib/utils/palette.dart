import 'dart:ui';
import 'package:flutter/material.dart';

class Palette {
  static const MaterialColor PRIMARY = Colors.blue;

  static const Color SCREEN_BACKGROUND = Colors.black;
  static const Color GAME_BACKGROUND = Colors.black;

  static const Color TEXT_COLOR_PRIMARY = Colors.white;

  static Paint paint({
    PaintingStyle? style,
    Color? color,
    double? strokeWidth,
    StrokeCap? strokeCap,
    StrokeJoin? strokeJoin,
    BlendMode? blendMode,
    double? blurSigma,
  }) {
    final Paint paint = Paint();

    if (color != null) {
      paint.color = color;
    }

    if (strokeWidth != null) {
      paint.strokeWidth = strokeWidth;
    }

    if (style != null) {
      paint.style = style;
    }

    if (strokeCap != null) {
      paint.strokeCap = strokeCap;
    }

    if (strokeJoin != null) {
      paint.strokeJoin = strokeJoin;
    }

    if (blendMode != null) {
      paint.blendMode = blendMode;
    }

    if (blurSigma != null && blurSigma > 0) {
      paint.imageFilter = ImageFilter.blur(
        sigmaX: blurSigma,
        sigmaY: blurSigma,
      );
    }

    return paint;
  }
}
