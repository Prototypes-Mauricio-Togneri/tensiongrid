import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';

class TimeComponent extends PositionComponent {
  final Match match;

  TimeComponent({
    required super.position,
    required super.size,
    required this.match,
  }) : super(anchor: Anchor.center);

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    canvas.drawText(
      text: match.elapsedTimeFormatted,
      position: position,
      size: 50, //size.x,
      color: Colors.white,
    );

    canvas.drawRect(
      Rect.fromLTWH(0, 0, size.x, size.y),
      Paint()..color = Colors.white,
    );
  }
}
