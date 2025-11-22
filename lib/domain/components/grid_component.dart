import 'dart:ui';
import 'package:flame/components.dart';

class GridComponent extends PositionComponent {
  GridComponent({
    required super.position,
    required super.size,
  }) : super(anchor: Anchor.center);

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    final paint = Paint()
      ..color = const Color(0xffff0000)
      ..style = PaintingStyle.fill;
    canvas.drawRect(size.toRect(), paint);
  }
}
