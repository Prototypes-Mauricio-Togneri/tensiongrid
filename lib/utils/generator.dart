import 'dart:math';
import 'package:tensiongrid/domain/entities/coordinates.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/events/event_sequence.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_number.dart';
import 'package:tensiongrid/domain/types/number_type.dart';
import 'package:tensiongrid/utils/palette.dart';

class EventGenerator {
  final int width;
  final int height;

  const EventGenerator({
    required this.width,
    required this.height,
  });

  Event eventSequence({
    required String id,
    required int timestamp,
    required int length,
    required NumberType type,
  }) {
    final List<Coordinates> coordinates = _generateCoordinates(
      width: width,
      height: height,
      length: length,
    );

    final List<Tile> tiles = [];

    for (int i = 0; i < coordinates.length; i++) {
      final Coordinates coord = coordinates[i];

      tiles.add(
        TileNumber(
          x: coord.x,
          y: coord.y,
          color: Palette.TILE_WHITE,
          number: i + 1,
          type: type,
        ),
      );
    }

    return EventSequence(
      id: id,
      timestamp: timestamp,
      tiles: tiles,
    );
  }

  static List<Coordinates> _generateCoordinates({
    required int width,
    required int height,
    required int length,
  }) {
    final Random random = Random();
    final Set<Coordinates> coordinates = {};

    while (coordinates.length < length) {
      final int x = random.nextInt(width);
      final int y = random.nextInt(height);
      final Coordinates coord = Coordinates(x: x, y: y);
      coordinates.add(coord);
    }

    return coordinates.toList();
  }
}
