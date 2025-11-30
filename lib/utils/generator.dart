import 'dart:math';
import 'package:flutter/material.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/entities/coordinates.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/events/event_coin.dart';
import 'package:tensiongrid/domain/entities/events/event_directional.dart';
import 'package:tensiongrid/domain/entities/events/event_sequence.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_coin.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_directional.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_sequence.dart';
import 'package:tensiongrid/domain/types/direction.dart';
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
        generator.eventDirectional(
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
    final Event event = EventCoin(
      id: id,
      timestamp: timestamp.toDouble(),
      timeout: Timeout.short.time,
      tiles: [],
    );

    final List<Coordinates> coordinates = _generateCoordinates(
      width: width,
      height: height,
      length: 1,
    );

    for (int i = 0; i < coordinates.length; i++) {
      final Coordinates coord = coordinates[i];

      event.addTile(
        TileCoin(
          x: coord.x,
          y: coord.y,
          color: Palette.TILE_WHITE,
          event: event,
        ),
      );
    }

    return event;
  }

  Event eventDirectional({
    required String id,
    required int timestamp,
  }) {
    final Event event = EventDirectional(
      id: id,
      timestamp: timestamp.toDouble(),
      timeout: Timeout.short.time,
      tiles: [],
    );

    final List<Coordinates> coordinates = _generateCoordinates(
      width: width,
      height: height,
      length: 1,
    );

    for (int i = 0; i < coordinates.length; i++) {
      final Coordinates coord = coordinates[i];
      final Direction direction =
          Direction.values[Random().nextInt(Direction.values.length)];

      event.addTile(
        TileDirectional(
          x: coord.x,
          y: coord.y,
          color: direction.color,
          event: event,
          direction: direction,
        ),
      );
    }

    return event;
  }

  Event eventSequence({
    required String id,
    required int timestamp,
    required int length,
  }) {
    final Event event = EventSequence(
      id: id,
      timestamp: timestamp.toDouble(),
      timeout: Timeout.short.time * length,
      tiles: [],
    );

    final List<Coordinates> coordinates = _generateCoordinates(
      width: width,
      height: height,
      length: length,
    );

    for (int i = 0; i < coordinates.length; i++) {
      final Coordinates coord = coordinates[i];

      event.addTile(
        TileSequence(
          x: coord.x,
          y: coord.y,
          color: Palette.TILE_WHITE,
          event: event,
          number: i + 1,
        ),
      );
    }

    return event;
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
