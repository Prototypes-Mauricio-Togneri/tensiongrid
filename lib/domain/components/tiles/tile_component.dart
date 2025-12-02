import 'dart:ui';
import 'package:tensiongrid/domain/components/actionable_component.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/direction.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/palette.dart';

abstract class TileComponent<T extends Tile> extends ActionableComponent {
  late final Paint paintBackground;
  late final NeonPaint paintBorder;
  late final RRect rect;
  final GridComponent gridComponent;
  final T tile;

  TileComponent({
    required super.position,
    required super.size,
    required this.tile,
    required this.gridComponent,
  }) {
    paintBackground = Palette.paint(
      style: PaintingStyle.fill,
      color: tile.color.withAlpha(50),
    );
    paintBorder = NeonPaint.create(
      color: tile.color,
      style: PaintingStyle.stroke,
      strokeWidth: size.x * 0.04,
      neonStrokeWidthFactor: 1.2,
    );
    rect = RRect.fromRectAndRadius(
      Rect.fromLTWH(0, 0, size.x, size.y),
      Radius.circular(size.x * 0.05),
    );
  }

  bool get showExplosion => false;

  @override
  void onTilePressed(double time) => gridComponent.onTilePressed(
    tileComponent: this,
    time: time,
  );

  @override
  void onTileTapped(double time) => gridComponent.onTileTapped(
    tileComponent: this,
    time: time,
  );

  @override
  void onTileSwiped(Direction direction) => gridComponent.onTileSwiped(
    tileComponent: this,
    direction: direction,
  );

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    if (isPressed) {
      canvas.drawRRect(
        rect,
        paintBackground,
      );
    }

    canvas.drawRectNeon(
      rect: rect,
      paint: paintBorder,
    );
  }
}
