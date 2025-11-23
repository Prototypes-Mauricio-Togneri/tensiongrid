import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/character_tile.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/palette.dart';

class CharacterTileComponent extends TileComponent<CharacterTile> {
  late final TextNeonPaint neonPaint;

  CharacterTileComponent({
    required super.position,
    required super.size,
    required super.match,
    required super.tile,
  }) {
    neonPaint = TextNeonPaint.create(tile.color);
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    canvas.drawText(
      text: tile.value,
      position: size / 2,
      size: size.x / 3,
      foreground: neonPaint.neon,
    );

    canvas.drawText(
      text: tile.value,
      position: size / 2,
      size: size.x / 3,
      foreground: neonPaint.base,
    );
  }
}
