import 'dart:ui';
import 'package:flame/components.dart';
import 'package:flame/events.dart';
import 'package:tensiongrid/domain/components/tiles/tile_component.dart';
import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/direction.dart';
import 'package:tensiongrid/environments/environment.dart';
import 'package:tensiongrid/presentation/audio/audio.dart';
import 'package:tensiongrid/presentation/audio/sound.dart';
import 'package:tensiongrid/utils/dimensions.dart';

class GridComponent extends PositionComponent with TapCallbacks, DragCallbacks {
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
      _removeEvent(event);
    }

    for (final Event event in events.$2) {
      _addEvent(event);
    }
  }

  void _addEvent(Event event) {
    for (final Tile tile in event.tilesActive) {
      final TileComponent tileComponent = tile.component(
        position: Dimensions.tilePosition(
          tile: tile,
          tileSize: tileSize,
        ),
        size: tileSize * 0.85,
        gridComponent: this,
      );

      add(tileComponent);
      tileComponents.add(tileComponent);
    }
  }

  void _removeEvent(Event event) {
    for (final Tile tile in event.tilesActive) {
      _removeTile(tile);
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
    _processActionResult(
      tileComponent: tileComponent,
      result: result,
    );
  }

  void onTileSwiped({
    required TileComponent tileComponent,
    required Direction direction,
  }) {
    final ActionResult result = match.onTileSwiped(
      tile: tileComponent.tile,
      direction: direction,
    );
    _processActionResult(
      tileComponent: tileComponent,
      result: result,
    );
  }

  void _processActionResult({
    required TileComponent tileComponent,
    required ActionResult result,
  }) {
    if (result.removeTile) {
      _removeTileComponent(tileComponent);
    }

    if (result.soundTap) {
      Audio.get.playSound(Sound.TILE_TAP);
    }

    if (result.soundError) {
      Audio.get.playSound(Sound.TILE_ERROR);
    }

    if (result.eventCompleted) {
      Audio.get.playSound(Sound.EVENT_COMPLETED);
    }
  }

  @override
  void onTapDown(TapDownEvent event) {
    super.onTapDown(event);

    _onWrongAction();
  }

  @override
  void onDragStart(DragStartEvent event) {
    super.onDragStart(event);

    _onWrongAction();
  }

  void _onWrongAction() {
    Audio.get.playSound(Sound.TILE_ERROR);
    match.onWrongAction();
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
