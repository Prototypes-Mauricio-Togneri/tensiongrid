import 'package:flame/game.dart';
import 'package:flame/widgets.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/utils/palette.dart';

extension CanvasExtension on Canvas {
  void drawText({
    required String text,
    required Vector2 position,
    required double size,
    TextAlign textAlign = TextAlign.center,
    FontWeight fontWeight = FontWeight.normal,
    Anchor anchor = Anchor.center,
    Color? color,
    Paint? foreground,
    Paint? background,
    String? fontFamily,
  }) {
    final TextStyle textStyle = TextStyle(
      fontSize: size,
      fontWeight: fontWeight,
      color: color,
      foreground: foreground,
      background: background,
      fontFamily: fontFamily,
    );
    final TextSpan textSpan = TextSpan(
      text: text,
      style: textStyle,
    );
    final TextPainter textPainter = TextPainter(
      text: textSpan,
      textDirection: TextDirection.ltr,
      textAlign: textAlign,
    );
    textPainter.layout();

    final Vector2 translatedPosition = translate(
      anchor: anchor,
      point: Vector2(
        position.x,
        position.y,
      ),
      size: Vector2(
        textPainter.size.width,
        textPainter.size.height,
      ),
    );
    textPainter.paint(this, translatedPosition.toOffset());
  }

  void drawTextNeon({
    required String text,
    required Vector2 position,
    required double size,
    required NeonPaint paint,
    TextAlign textAlign = TextAlign.center,
    FontWeight fontWeight = FontWeight.normal,
    Anchor anchor = Anchor.center,
    String? fontFamily,
  }) {
    drawText(
      text: text,
      position: position,
      size: size,
      foreground: paint.neon,
      fontFamily: fontFamily,
      textAlign: textAlign,
      fontWeight: fontWeight,
      anchor: anchor,
    );

    drawText(
      text: text,
      position: position,
      size: size,
      foreground: paint.base,
      fontFamily: fontFamily,
      textAlign: textAlign,
      fontWeight: fontWeight,
      anchor: anchor,
    );
  }

  Vector2 translate({
    required Anchor anchor,
    required Vector2 point,
    required Vector2 size,
  }) => point - (Vector2(anchor.x, anchor.y)..multiply(size));

  void drawRectNeon({
    required RRect rect,
    required NeonPaint paint,
  }) {
    drawRRect(
      rect,
      paint.neon,
    );

    drawRRect(
      rect,
      paint.base,
    );
  }

  void drawCircleNeon({
    required Vector2 center,
    required double radius,
    required NeonPaint paint,
  }) {
    drawCircle(
      center.toOffset(),
      radius,
      paint.neon,
    );

    drawCircle(
      center.toOffset(),
      radius,
      paint.base,
    );
  }
}
