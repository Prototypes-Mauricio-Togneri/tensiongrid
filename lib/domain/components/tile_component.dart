import 'dart:ui';
import 'package:flame/components.dart';
import 'package:tensiongrid/domain/entities/tile.dart';

class TileComponent extends PositionComponent {
  final Tile tile;

  TileComponent({
    required super.position,
    required super.size,
    required this.tile,
  }) : super(anchor: Anchor.center);

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    final Paint paint = Paint()
      ..color = const Color(0xffff0000)
      ..strokeWidth = 0.5
      ..style = PaintingStyle.stroke;

    canvas.drawRect(
      Rect.fromLTWH(
        -size.x / 2,
        -size.y / 2,
        size.x,
        size.y,
      ),
      paint,
    );
  }
}
