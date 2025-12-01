import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_align.dart';
import 'package:tensiongrid/domain/types/direction.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/palette.dart';

class TileAlignComponent extends TileComponent<TileAlign> {
  late final NeonPaint neonPaint;

  TileAlignComponent({
    required super.position,
    required super.size,
    required super.tile,
    required super.gridComponent,
  }) {
    neonPaint = NeonPaint.create(
      color: tile.color,
      style: PaintingStyle.fill,
    );
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    switch (tile.direction) {
      case Direction.up:
        canvas.drawTextNeon(
          text: '⬆️',
          position: size / 2,
          size: size.x / 2.5,
          paint: neonPaint,
        );
      case Direction.down:
        canvas.drawTextNeon(
          text: '⬇️',
          position: size / 2,
          size: size.x / 2.5,
          paint: neonPaint,
        );
      case Direction.left:
        canvas.drawTextNeon(
          text: '⬅️',
          position: size / 2,
          size: size.x / 2.5,
          paint: neonPaint,
        );
      case Direction.right:
        canvas.drawTextNeon(
          text: '➡️',
          position: size / 2,
          size: size.x / 2.5,
          paint: neonPaint,
        );
    }
  }
}
