import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/palette.dart';

class ExplosionComponent extends PositionComponent {
  double percentage = 1;
  late final NeonPaint neonPaint;

  ExplosionComponent({
    required super.position,
    required super.size,
  }) : super(anchor: Anchor.center) {
    neonPaint = NeonPaint.create(
      color: Palette.EXPLOSION,
      style: PaintingStyle.stroke,
      strokeWidth: size.x / 20,
    );
  }

  @override
  void update(double dt) {
    super.update(dt);

    percentage = (percentage - (dt * 2)).clamp(0, 1);
    neonPaint.alpha((percentage * 255).toInt());

    if (percentage == 0) {
      removeFromParent();
    }
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    canvas.drawCircleNeon(
      center: size / 2,
      radius: (size.x / 2) * (1 - percentage),
      paint: neonPaint,
    );
  }
}
