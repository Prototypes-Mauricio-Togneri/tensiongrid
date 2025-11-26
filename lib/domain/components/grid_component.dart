import 'dart:ui';
import 'package:flame/components.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class GridComponent extends PositionComponent {
  final Match match;
  late final Vector2 tileSize;

  GridComponent({
    required super.position,
    required super.size,
    required this.match,
  }) : super(anchor: Anchor.center) {
    tileSize = Vector2(
      size.x / match.width,
      size.y / match.height,
    );
  }

  @override
  void update(double dt) {
    super.update(dt);

    final Event? newEvent = match.newEvent;

    if (newEvent != null) {
      for (final Tile tile in newEvent.tiles) {
        add(
          tile.component(
            position: _tilePosition(
              tile: tile,
              tileSize: tileSize,
            ),
            size: tileSize * 0.85,
          ),
        );
      }
    }
  }

  Vector2 _tilePosition({
    required Tile tile,
    required Vector2 tileSize,
  }) => Vector2(
    (tile.x * tileSize.x) + tileSize.x / 2,
    (tile.y * tileSize.y) + tileSize.y / 2,
  );

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    final Paint paint = Paint()
      ..color = const Color(0xffff0000)
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
  }
}
