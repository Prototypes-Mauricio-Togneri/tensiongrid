import 'package:flutter/material.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_character.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/palette.dart';

class TileCharacterComponent extends TileComponent<TileCharacter> {
  late final NeonPaint neonPaint;

  TileCharacterComponent({
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
      text: tile.value,
      position: size / 2,
      size: (size.x / 2) * tile.size,
      paint: neonPaint,
      fontFamily: Constants.FONT_MICHROMA,
    );
  }
}
