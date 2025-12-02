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
      _draw6(
        canvas: canvas,
        center: center,
        radius: radius,
        spacing: spacing,
      );
    } else if (tile.counter == 5) {
      _draw5(
        canvas: canvas,
        center: center,
        radius: radius,
        spacing: spacing,
      );
    } else if (tile.counter == 4) {
      _draw4(
        canvas: canvas,
        center: center,
        radius: radius,
        spacing: spacing,
      );
    } else if (tile.counter == 3) {
      _draw3(
        canvas: canvas,
        center: center,
        radius: radius,
        spacing: spacing,
      );
    } else if (tile.counter == 2) {
      _draw2(
        canvas: canvas,
        center: center,
        radius: radius,
        spacing: spacing,
      );
    } else if (tile.counter == 1) {
      _draw1(
        canvas: canvas,
        center: center,
        radius: radius,
        spacing: spacing,
      );
    }
  }

  void _draw6({
    required Canvas canvas,
    required Vector2 center,
    required double radius,
    required double spacing,
  }) {
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
  }

  void _draw5({
    required Canvas canvas,
    required Vector2 center,
    required double radius,
    required double spacing,
  }) {
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
  }

  void _draw4({
    required Canvas canvas,
    required Vector2 center,
    required double radius,
    required double spacing,
  }) {
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
  }

  void _draw3({
    required Canvas canvas,
    required Vector2 center,
    required double radius,
    required double spacing,
  }) {
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
  }

  void _draw2({
    required Canvas canvas,
    required Vector2 center,
    required double radius,
    required double spacing,
  }) {
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
  }

  void _draw1({
    required Canvas canvas,
    required Vector2 center,
    required double radius,
    required double spacing,
  }) {
    canvas.drawCircleNeon(
      center: center,
      radius: radius,
      paint: neonPaint,
    );
  }
}
