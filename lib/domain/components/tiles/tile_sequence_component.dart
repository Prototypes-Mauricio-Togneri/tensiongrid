import 'dart:async';
import 'dart:ui';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_sequence.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/palette.dart';

class TileSequenceComponent extends TileComponent<TileSequence> {
  final Paint paintDots = Palette.paint(
    style: PaintingStyle.fill,
  );
  late final NeonPaint neonPaint;
  late final double characterSize;

  TileSequenceComponent({
    required super.position,
    required super.size,
    required super.tile,
  });

  @override
  FutureOr onLoad() {
    neonPaint = NeonPaint.create(
      color: tile.color,
      style: PaintingStyle.fill,
    );
    paintDots.color = tile.color;
    characterSize = size.x / 3;

    return super.onLoad();
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    canvas.drawTextNeon(
      text: '${tile.number}',
      position: size / 2,
      size: size.x / 3,
      paint: neonPaint,
      fontFamily: Constants.FONT_MICHROMA,
    );
  }
}
