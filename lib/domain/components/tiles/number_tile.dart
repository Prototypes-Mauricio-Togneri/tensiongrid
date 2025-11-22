import 'dart:ui';
import 'package:tensiongrid/domain/components/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/number_tile.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';

class NumberTileComponent extends TileComponent<NumberTile> {
  NumberTileComponent({
    required super.position,
    required super.size,
    required super.tile,
  }) : super();

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    canvas.drawText(
      text: '${tile.number}',
      position: size / 2,
      size: size.x / 5,
      color: const Color(0xffffffff),
    );
  }
}
