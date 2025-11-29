import 'dart:ui';
import 'package:flutter/material.dart';

class Palette {
  static const MaterialColor PRIMARY = Colors.blue;

  static const Color TRANSPARENT = Colors.transparent;

  static const Color SCREEN_BACKGROUND = Colors.black;
  static const Color GAME_BACKGROUND = Colors.black;

  static const Color TEXT_COLOR_PRIMARY = Colors.white;

  static const Color PLAYER_1 = Colors.blue;
  static const Color PLAYER_2 = Colors.red;
  static const Color PLAYER_NAME = Colors.white;

  static const Color TOPBAR_TEXT = Colors.white;

  static const Color TILE_WHITE = Colors.white;

  static Paint paint({
    PaintingStyle? style,
    Color? color,
    double? strokeWidth,
    StrokeCap? strokeCap,
    StrokeJoin? strokeJoin,
    BlendMode? blendMode,
    double? blurSigma,
    MaskFilter? maskFilter,
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

    if (maskFilter != null) {
      paint.maskFilter = maskFilter;
    }

    return paint;
  }
}

class NeonPaint {
  final Paint base;
  final Paint neon;

  const NeonPaint({
    required this.base,
    required this.neon,
  });

  factory NeonPaint.create({
    required Color color,
    required PaintingStyle style,
    double? strokeWidth,
    StrokeCap? strokeCap,
    StrokeJoin? strokeJoin,
  }) => NeonPaint(
    base: Palette.paint(
      style: style,
      color: color,
      strokeWidth: strokeWidth,
      strokeCap: strokeCap,
      strokeJoin: strokeJoin,
    ),
    neon: Palette.paint(
      style: style,
      maskFilter: const MaskFilter.blur(BlurStyle.normal, 1),
      color: color,
      strokeWidth: strokeWidth != null ? strokeWidth * 2 : null,
      strokeCap: strokeCap,
      strokeJoin: strokeJoin,
    ),
  );
}
