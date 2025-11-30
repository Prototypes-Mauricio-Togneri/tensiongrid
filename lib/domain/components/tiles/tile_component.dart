import 'dart:ui';
import 'package:tensiongrid/domain/components/actionable_component.dart';
import 'package:tensiongrid/domain/components/grid_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/direction.dart';
import 'package:tensiongrid/utils/palette.dart';

abstract class TileComponent<T extends Tile> extends ActionableComponent {
  final Paint paintBorderBase = Palette.paint(
    style: PaintingStyle.stroke,
  );
  final Paint paintBorderNeon = Palette.paint(
    style: PaintingStyle.stroke,
    maskFilter: const MaskFilter.blur(BlurStyle.normal, 1),
  );
  final Paint paintBackground = Palette.paint(
    style: PaintingStyle.fill,
  );
  final T tile;
  final GridComponent gridComponent;
  late final RRect rect;

  TileComponent({
    required super.position,
    required super.size,
    required this.tile,
    required this.gridComponent,
  }) {
    final double borderWidth = size.x * 0.04;

    paintBorderBase.strokeWidth = borderWidth;
    paintBorderBase.color = tile.color.withAlpha(200);

    paintBorderNeon.strokeWidth = borderWidth;
    paintBorderNeon.color = tile.color;

    paintBackground.color = tile.color.withAlpha(50);

    rect = RRect.fromRectAndRadius(
      Rect.fromLTWH(0, 0, size.x, size.y),
      Radius.circular(size.x * 0.05),
    );
  }

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
      canvas.drawRRect(rect, paintBackground);
      canvas.drawRRect(rect, paintBorderNeon);
    }

    canvas.drawRRect(rect, paintBorderBase);

    /*canvas.drawText(
      text: '${tile.x},${tile.y}',
      position: size / 2,
      size: size.x / 5,
      color: const Color(0xffffffff),
    );*/
  }
}
