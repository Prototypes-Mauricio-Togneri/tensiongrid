import 'dart:math';
import 'package:flutter/material.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/entities/coordinates.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/events/event_coin.dart';
import 'package:tensiongrid/domain/entities/events/event_sequence.dart';
import 'package:tensiongrid/domain/entities/events/event_swipe.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_character.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_number.dart';
import 'package:tensiongrid/domain/types/number_type.dart';
import 'package:tensiongrid/domain/types/timeout.dart';
import 'package:tensiongrid/utils/palette.dart';

class MatchGenerator {
  static Match test() {
    const int width = 5;
    const int height = 5;

    const EventGenerator generator = EventGenerator(
      width: width,
      height: height,
    );

    return Match(
      id: '123',
      width: width,
      height: height,
      player1: const Player(
        id: '1',
        index: Constants.PLAYER_1,
        name: 'Alice',
        color: Colors.blue,
      ),
      player2: const Player(
        id: '2',
        index: Constants.PLAYER_2,
        name: 'Bob',
        color: Colors.red,
      ),
      events: [
        generator.eventSwipe(
          id: 's0',
          timestamp: 1,
        ),
        generator.eventCoin(
          id: 's0',
          timestamp: 3,
        ),
        generator.eventSequence(
          id: 's0',
          timestamp: 5,
          length: 3,
          type: NumberType.arabic,
        ),
      ],
    );
  }
}

class EventGenerator {
  final int width;
  final int height;

  const EventGenerator({
    required this.width,
    required this.height,
  });

  Event eventCoin({
    required String id,
    required int timestamp,
  }) {
    final List<Coordinates> coordinates = _generateCoordinates(
      width: width,
      height: height,
      length: 1,
    );

    final List<Tile> tiles = [];

    for (int i = 0; i < coordinates.length; i++) {
      final Coordinates coord = coordinates[i];

      tiles.add(
        TileCharacter(
          x: coord.x,
          y: coord.y,
          color: Palette.TILE_WHITE,
          index: 0,
          value: '🪙',
          size: 0.9,
        ),
      );
    }

    return EventCoin(
      id: id,
      timestamp: timestamp.toDouble(),
      timeout: Timeout.short.time,
      tiles: tiles,
    );
  }

  Event eventSwipe({
    required String id,
    required int timestamp,
  }) {
    final List<Coordinates> coordinates = _generateCoordinates(
      width: width,
      height: height,
      length: 1,
    );

    final List<Tile> tiles = [];

    for (int i = 0; i < coordinates.length; i++) {
      final Coordinates coord = coordinates[i];

      tiles.add(
        TileCharacter(
          x: coord.x,
          y: coord.y,
          color: Palette.TILE_WHITE,
          index: 0,
          value: '▶',
          size: 1,
        ),
      );
    }

    return EventSwipe(
      id: id,
      timestamp: timestamp.toDouble(),
      timeout: Timeout.short.time,
      tiles: tiles,
    );
  }

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
      timestamp: timestamp.toDouble(),
      timeout: Timeout.short.time * tiles.length,
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
