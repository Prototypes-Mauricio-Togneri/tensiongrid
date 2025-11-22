import 'dart:ui';
import 'package:flame/components.dart';
import 'package:tensiongrid/domain/entities/tile.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';

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
      ..color = const Color(0xffffffff)
      ..strokeWidth = 0.5
      ..style = PaintingStyle.stroke;

    canvas.drawRect(
      Rect.fromLTWH(
        0,
        0,
        size.x,
        size.y,
      ),
      paint,
    );

    canvas.drawText(
      text: '${tile.x},${tile.y}',
      position: size / 2,
      size: 5,
      color: const Color(0xffffffff),
    );
  }
}
