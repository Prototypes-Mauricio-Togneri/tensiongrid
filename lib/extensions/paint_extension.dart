import 'package:flutter/material.dart';

extension PaintExtension on Paint {
  Paint copy() {
    final Paint paint = Paint();
    paint.color = color;
    paint.strokeWidth = strokeWidth;
    paint.style = style;
    paint.strokeCap = strokeCap;
    paint.strokeJoin = strokeJoin;
    paint.blendMode = blendMode;
    paint.maskFilter = maskFilter;

    return paint;
  }
}
