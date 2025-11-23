import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_character.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/palette.dart';

class TileCharacterComponent extends TileComponent<TileCharacter> {
  late final TextNeonPaint neonPaint;

  TileCharacterComponent({
    required super.position,
    required super.size,
    required super.tile,
  }) {
    neonPaint = TextNeonPaint.create(tile.color);
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    canvas.drawTextNeon(
      text: tile.value,
      position: size / 2,
      size: size.x / 3,
      paint: neonPaint,
    );
  }
}
