import 'dart:async';
import 'dart:ui';
import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/tile_component.dart';
import 'package:tensiongrid/domain/entities/stage.dart';
import 'package:tensiongrid/domain/entities/tile.dart';

class GridComponent extends PositionComponent {
  final Stage stage;

  GridComponent({
    required super.position,
    required super.size,
    required this.stage,
  }) : super(anchor: Anchor.center);

  @override
  FutureOr onLoad() {
    final Vector2 tileSize = Vector2(
      size.x / stage.width,
      size.y / stage.height,
    );

    for (final Tile tile in stage.tiles) {
      add(
        TileComponent(
          position: Vector2(
            tile.x * size.x,
            tile.y * size.y,
          ),
          size: tileSize,
          tile: tile,
        ),
      );
    }

    return super.onLoad();
  }

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
