import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/location.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_align.dart';
import 'package:tensiongrid/domain/types/direction.dart';
import 'package:tensiongrid/domain/types/event_type.dart';
import 'package:tensiongrid/utils/generator.dart';

class EventAlign extends Event<TileAlign> {
  int alignedUp = 0;
  int alignedDown = 0;
  int alignedLeft = 0;
  int alignedRight = 0;

  static const double durationPerTile = 2;

  EventAlign({
    required super.trigger,
    required super.timeout,
    required super.tiles,
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

  factory EventAlign.create({
    required double trigger,
    required double timeout,
    required List<Location> locations,
  }) {
    final EventAlign event = EventAlign(
      trigger: trigger,
      timeout: timeout,
      tiles: [],
    );

    final Set<Direction> usedDirections = {};

    for (final Location location in locations) {
      final Direction direction = _uniqueDirection(usedDirections);

      event.addTile(
        TileAlign(
          location: location,
          event: event,
          direction: direction,
        ),
      );
    }

    return event;
  }

  static Direction _uniqueDirection(Set<Direction> usedDirections) {
    Direction direction = randomEnum(Direction.values);

    while (usedDirections.contains(direction)) {
      direction = randomEnum(Direction.values);
    }

    usedDirections.add(direction);

    return direction;
  }
}
