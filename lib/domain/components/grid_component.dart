import 'dart:async';
import 'package:flame/components.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/stage.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class GridComponent extends PositionComponent {
  final Match match;
  final Stage stage;

  GridComponent({
    required super.position,
    required super.size,
    required this.match,
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
        tile.component(
          position: _tilePosition(
            tile: tile,
            tileSize: tileSize,
          ),
          size: tileSize * 0.85,
        ),
      );
    }

    return super.onLoad();
  }

  Vector2 _tilePosition({
    required Tile tile,
    required Vector2 tileSize,
  }) => Vector2(
    (tile.x * tileSize.x) + tileSize.x / 2,
    (tile.y * tileSize.y) + tileSize.y / 2,
  );

  /*@override
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
  }*/
}
