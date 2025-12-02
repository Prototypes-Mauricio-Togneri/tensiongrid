import 'dart:math';
import 'package:flutter/material.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/entities/coordinates.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/events/event_align.dart';
import 'package:tensiongrid/domain/entities/events/event_bomb.dart';
import 'package:tensiongrid/domain/entities/events/event_chest.dart';
import 'package:tensiongrid/domain/entities/events/event_coin.dart';
import 'package:tensiongrid/domain/entities/events/event_countdown.dart';
import 'package:tensiongrid/domain/entities/events/event_directional.dart';
import 'package:tensiongrid/domain/entities/events/event_matching.dart';
import 'package:tensiongrid/domain/entities/events/event_quantity.dart';
import 'package:tensiongrid/domain/entities/events/event_sequence.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_align.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_bomb.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_chest.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_coin.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_countdown.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_directional.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_matching.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_quantity.dart';
import 'package:tensiongrid/domain/entities/tiles/tile_sequence.dart';
import 'package:tensiongrid/domain/types/category.dart';
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
        /*generator.eventCoin(
          id: 'e0',
          timestamp: 2,
        ),*/
        /*generator.eventDirectional(
          id: 'e0',
          timestamp: 2,
        ),*/
        /*generator.eventCountdown(
          id: 'e0',
          timestamp: 2,
        ),*/
        /*generator.eventChest(
          id: 'e0',
          timestamp: 2,
        ),*/
        /*generator.eventBomb(
          id: 'e0',
          timestamp: 2,
        ),*/
        /*generator.eventQuantity(
          id: 'e0',
          timestamp: 2,
        ),*/
        /*generator.eventSequence(
          id: 'e0',
          timestamp: 2,
        ),*/
        /*generator.eventMatching(
          id: 'e0',
          timestamp: 2,
        ),*/
        generator.eventAlign(
          id: 'e0',
          timestamp: 2,
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
    required double timestamp,
  }) {
    final Event event = EventCoin(
      id: id,
      timestamp: timestamp,
      timeout: Timeout.short.time.toDouble(),
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
          color: Palette.TILE_YELLOW,
          event: event,
        ),
      );
    }

    return event;
  }

  Event eventDirectional({
    required String id,
    required double timestamp,
  }) {
    final Event event = EventDirectional(
      id: id,
      timestamp: timestamp,
      timeout: Timeout.short.time.toDouble(),
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

  Event eventCountdown({
    required String id,
    required double timestamp,
  }) {
    final int timeout = Random().nextInt(5) + 5;
    final Event event = EventCountdown(
      id: id,
      timestamp: timestamp,
      timeout: timeout.toDouble(),
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
        TileCountdown(
          x: coord.x,
          y: coord.y,
          color: Palette.TILE_WHITE,
          event: event,
          timeout: timeout.toDouble(),
        ),
      );
    }

    return event;
  }

  Event eventChest({
    required String id,
    required double timestamp,
  }) {
    final Event event = EventChest(
      id: id,
      timestamp: timestamp,
      timeout: Timeout.medium.time.toDouble(),
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
        TileChest(
          x: coord.x,
          y: coord.y,
          color: Palette.TILE_YELLOW,
          event: event,
        ),
      );
    }

    return event;
  }

  Event eventBomb({
    required String id,
    required double timestamp,
  }) {
    final Event event = EventBomb(
      id: id,
      timestamp: timestamp,
      timeout: Timeout.medium.time.toDouble(),
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
        TileBomb(
          x: coord.x,
          y: coord.y,
          color: Palette.TILE_RED,
          event: event,
        ),
      );
    }

    return event;
  }

  Event eventQuantity({
    required String id,
    required double timestamp,
  }) {
    final int quantity = Random().nextInt(6) + 1;
    final Event event = EventQuantity(
      id: id,
      timestamp: timestamp,
      timeout: Timeout.medium.time.toDouble(),
      tiles: [],
      quantity: quantity,
    );

    final List<Coordinates> coordinates = _generateCoordinates(
      width: width,
      height: height,
      length: 1,
    );

    for (int i = 0; i < coordinates.length; i++) {
      final Coordinates coord = coordinates[i];

      event.addTile(
        TileQuantity(
          x: coord.x,
          y: coord.y,
          color: Palette.TILE_WHITE,
          event: event,
          quantity: quantity,
        ),
      );
    }

    return event;
  }

  Event eventSequence({
    required String id,
    required double timestamp,
  }) {
    final int length = Random().nextInt(3) + 3;
    final Event event = EventSequence(
      id: id,
      timestamp: timestamp,
      timeout: (Timeout.short.time * length).toDouble(),
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

  Event eventMatching({
    required String id,
    required double timestamp,
  }) {
    final Category validCategory =
        Category.values[Random().nextInt(Category.values.length)];
    final int validTiles = Random().nextInt(3) + 3;
    final int invalidTiles = validTiles ~/ 2;
    final Event event = EventMatching(
      id: id,
      timestamp: timestamp,
      timeout: (Timeout.short.time * validTiles).toDouble(),
      tiles: [],
      category: validCategory,
      validTiles: validTiles,
    );

    final List<Coordinates> coordinates = _generateCoordinates(
      width: width,
      height: height,
      length: validTiles + invalidTiles,
    );

    final List<String> goodValues = List.from(validCategory.list);
    goodValues.shuffle();
    final List<(String, Category)> values = goodValues
        .sublist(0, validTiles)
        .map(
          (String value) => (value, validCategory),
        )
        .toList();

    for (final Category category in Category.values) {
      if (category != validCategory) {
        final List<String> categoryValues = List.from(category.list);
        categoryValues.shuffle();
        values.add((categoryValues[0], category));
      }
    }

    for (int i = 0; i < coordinates.length; i++) {
      final Coordinates coord = coordinates[i];

      event.addTile(
        TileMatching(
          x: coord.x,
          y: coord.y,
          color: Palette.TILE_WHITE,
          event: event,
          category: values[i].$2,
          value: values[i].$1,
        ),
      );
    }

    return event;
  }

  Event eventAlign({
    required String id,
    required double timestamp,
  }) {
    final int length = Random().nextInt(3) + 3;
    final Direction direction =
        Direction.values[Random().nextInt(Direction.values.length)];
    final Event event = EventAlign(
      id: id,
      timestamp: timestamp,
      timeout: (Timeout.short.time * length).toDouble(),
      tiles: [],
      direction: direction,
    );

    final List<Coordinates> coordinates = _generateCoordinates(
      width: width,
      height: height,
      length: length,
    );

    for (int i = 0; i < coordinates.length; i++) {
      final Coordinates coord = coordinates[i];
      final Direction direction =
          Direction.values[Random().nextInt(Direction.values.length)];

      event.addTile(
        TileAlign(
          x: coord.x,
          y: coord.y,
          color: Palette.TILE_WHITE,
          event: event,
          direction: direction,
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
