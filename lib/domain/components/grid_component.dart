import 'dart:ui';
import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/environments/environment.dart';
import 'package:tensiongrid/presentation/audio/audio.dart';
import 'package:tensiongrid/presentation/audio/sound.dart';
import 'package:tensiongrid/utils/dimensions.dart';

class GridComponent extends PositionComponent {
  final Match match;
  late final Vector2 tileSize;
  final List<TileComponent> tileComponents = [];

  GridComponent({
    required super.position,
    required super.size,
    required this.match,
  }) : super(anchor: Anchor.center) {
    tileSize = Dimensions.tileSize(
      size: size,
      width: match.width,
      height: match.height,
    );
  }

  @override
  void update(double dt) {
    super.update(dt);

    final (List<Event>, List<Event>) events = match.update(dt);

    for (final Event event in events.$1) {
      _addNewEvent(event);
    }

    for (final Event event in events.$2) {
      for (final Tile tile in event.tiles) {
        _removeTile(tile);
      }
    }
  }

  void _addNewEvent(Event event) {
    for (final Tile tile in event.tiles) {
      final TileComponent tileComponent = tile.component(
        position: Dimensions.tilePosition(
          tile: tile,
          tileSize: tileSize,
        ),
        size: tileSize * 0.85,
      );

      add(tileComponent);
      tileComponents.add(tileComponent);
    }
  }

  void _removeTile(Tile tile) {
    for (final TileComponent tileComponent in tileComponents) {
      if (tileComponent.tile == tile) {
        _removeTileComponent(tileComponent);
        break;
      }
    }
  }

  void _removeTileComponent(TileComponent tileComponent) {
    tileComponent.removeFromParent();
    tileComponents.remove(tileComponent);
  }

  void onTileTapped(TileComponent tileComponent) {
    final ActionResult result = match.onTileTapped(tileComponent.tile);

    if (result.removeTile) {
      _removeTileComponent(tileComponent);
    }

    if (result.soundTap) {
      Audio.get.playSound(Sound.TILE_TAP);
    }

    if (result.soundError) {
      Audio.get.playSound(Sound.TILE_ERROR);
    }

    if (result.soundEventCompleted) {
      Audio.get.playSound(Sound.EVENT_COMPLETED);
    }
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    if (Environment.get.isDebug) {
      final Paint paint = Paint()
        ..color = const Color(0xffff0000)
        ..strokeWidth = 0.5
        ..style = PaintingStyle.stroke;

      canvas.drawRect(
        Rect.fromLTWH(
          0,
          0,
          size.x,
          size.y,
        ),
        paint,
      );
    }
  }
}
