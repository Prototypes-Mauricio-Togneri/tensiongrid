import 'package:flutter/material.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_directional.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/palette.dart';

class TileDirectionalComponent extends TileComponent<TileDirectional> {
  late final NeonPaint neonPaint;

  TileDirectionalComponent({
    required super.position,
    required super.size,
    required super.tile,
  }) {
    neonPaint = NeonPaint.create(
      color: tile.color,
      style: PaintingStyle.fill,
    );
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    canvas.drawTextNeon(
      text: '▶',
      position: size / 2,
      size: size.x / 2.5,
      paint: neonPaint,
      fontFamily: Constants.FONT_MICHROMA,
    );
  }
}
