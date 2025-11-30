import 'package:flame/game.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_quantity.dart';
import 'package:tensiongrid/extensions/canvas_extension.dart';
import 'package:tensiongrid/utils/palette.dart';

class TileQuantityComponent extends TileComponent<TileQuantity> {
  late final NeonPaint neonPaint;

  TileQuantityComponent({
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

    final Vector2 center = size / 2;
    final double radius = size.x / 15;
    final double spacing = size.x / 4;

    if (tile.counter == 6) {
      for (int col = 0; col < 2; col++) {
        for (int row = 0; row < 3; row++) {
          canvas.drawCircleNeon(
            center: Vector2(
              center.x - spacing + col * spacing * 2,
              center.y - spacing + row * spacing,
            ),
            radius: radius,
            paint: neonPaint,
          );
        }
      }
    } else if (tile.counter == 5) {
      canvas.drawCircleNeon(
        center: Vector2(center.x - spacing, center.y - spacing),
        radius: radius,
        paint: neonPaint,
      );
      canvas.drawCircleNeon(
        center: Vector2(center.x + spacing, center.y - spacing),
        radius: radius,
        paint: neonPaint,
      );
      canvas.drawCircleNeon(
        center: center,
        radius: radius,
        paint: neonPaint,
      );
      canvas.drawCircleNeon(
        center: Vector2(center.x - spacing, center.y + spacing),
        radius: radius,
        paint: neonPaint,
      );
      canvas.drawCircleNeon(
        center: Vector2(center.x + spacing, center.y + spacing),
        radius: radius,
        paint: neonPaint,
      );
    } else if (tile.counter == 4) {
      canvas.drawCircleNeon(
        center: Vector2(center.x - spacing, center.y - spacing),
        radius: radius,
        paint: neonPaint,
      );
      canvas.drawCircleNeon(
        center: Vector2(center.x + spacing, center.y - spacing),
        radius: radius,
        paint: neonPaint,
      );
      canvas.drawCircleNeon(
        center: Vector2(center.x - spacing, center.y + spacing),
        radius: radius,
        paint: neonPaint,
      );
      canvas.drawCircleNeon(
        center: Vector2(center.x + spacing, center.y + spacing),
        radius: radius,
        paint: neonPaint,
      );
    } else if (tile.counter == 3) {
      canvas.drawCircleNeon(
        center: Vector2(center.x + spacing, center.y - spacing),
        radius: radius,
        paint: neonPaint,
      );
      canvas.drawCircleNeon(
        center: center,
        radius: radius,
        paint: neonPaint,
      );
      canvas.drawCircleNeon(
        center: Vector2(center.x - spacing, center.y + spacing),
        radius: radius,
        paint: neonPaint,
      );
    } else if (tile.counter == 2) {
      canvas.drawCircleNeon(
        center: Vector2(center.x + spacing, center.y - spacing),
        radius: radius,
        paint: neonPaint,
      );
      canvas.drawCircleNeon(
        center: Vector2(center.x - spacing, center.y + spacing),
        radius: radius,
        paint: neonPaint,
      );
    } else if (tile.counter == 1) {
      canvas.drawCircleNeon(
        center: center,
        radius: radius,
        paint: neonPaint,
      );
    }
  }
}
