import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_align.dart';
import 'package:tensiongrid/domain/types/direction.dart';
import 'package:tensiongrid/domain/types/event_type.dart';

class EventAlign extends Event<TileAlign> {
  final Direction direction;
  int alignedUp = 0;
  int alignedDown = 0;
  int alignedLeft = 0;
  int alignedRight = 0;

  EventAlign({
    required super.id,
    required super.timestamp,
    required super.timeout,
    required super.tiles,
    required this.direction,
  }) : super(type: EventType.align);

  @override
  void onTileAdded(TileAlign tile) {
    switch (tile.direction) {
      case Direction.up:
        alignedUp++;
      case Direction.down:
        alignedDown++;
      case Direction.left:
        alignedLeft++;
      case Direction.right:
        alignedRight++;
    }
  }

  @override
  int get pointsFail => hasStarted ? numberOfTiles : 0;

  @override
  int get pointsSuccess => numberOfTiles * 5;

  @override
  ActionResult tileTapped({
    required TileAlign tile,
    required double time,
  }) {
    switch (tile.direction) {
      case Direction.up:
        alignedUp--;
      case Direction.down:
        alignedDown--;
      case Direction.left:
        alignedLeft--;
      case Direction.right:
        alignedRight--;
    }

    tile.direction = tile.direction.next;

    switch (tile.direction) {
      case Direction.up:
        alignedUp++;
      case Direction.down:
        alignedDown++;
      case Direction.left:
        alignedLeft++;
      case Direction.right:
        alignedRight++;
    }

    if (alignedUp == numberOfTiles ||
        alignedDown == numberOfTiles ||
        alignedLeft == numberOfTiles ||
        alignedRight == numberOfTiles) {
      return ActionResult.completed(this);
    } else {
      return ActionResult.tap(this);
    }
  }
}
