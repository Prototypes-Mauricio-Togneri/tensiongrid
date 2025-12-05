import 'dart:math';
import 'package:tensiongrid/app/constants.dart';
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
import 'package:tensiongrid/domain/entities/location.dart';
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

class MatchGenerator {
  static Match test() {
    const int width = 5;
    const int height = 5;
    const int timeout = 60;

    const EventGenerator generator = EventGenerator(
      width: width,
      height: height,
      timeout: timeout,
    );

    return Match(
      id: 'match1',
      width: width,
      height: height,
      timeout: timeout,
      player1: const Player(
        id: 'user1',
        isSelf: false,
        index: Constants.PLAYER_1,
        name: 'Alice',
        score: 50,
      ),
      player2: const Player(
        id: 'user2',
        isSelf: true,
        index: Constants.PLAYER_2,
        name: 'Bob',
        score: 75,
      ),
      events: generator.events,
    );
  }
}

class EventGenerator {
  final int width;
  final int height;
  final int timeout;

  const EventGenerator({
    required this.width,
    required this.height,
    required this.timeout,
  });

  List<Event> get events {
    final List<Event> result = [];
    final Grid grid = Grid.create(
      width: width,
      height: height,
    );
    int time = 0;

    for (int i = 0; i < timeout; i++) {
      final int ratio = grid.ratio;

      if (ratio < time) {
        final Event event = _eventCoin(
          grid: grid,
          timestamp: time.toDouble(),
        );
        result.add(event);
      }

      time++;
    }

    /*result.add(
      eventCoin(
        timestamp: 2,
      ),
    );

    result.add(
      eventDirectional(
        timestamp: 2,
      ),
    );

    result.add(
      eventCountdown(
        timestamp: 2,
      ),
    );

    result.add(
      eventChest(
        timestamp: 5,
      ),
    );

    result.add(
      eventBomb(
        timestamp: 8,
      ),
    );

    result.add(
      eventQuantity(
        timestamp: 12,
      ),
    );

    result.add(
      eventSequence(
        timestamp: 16,
      ),
    );

    result.add(
      eventMatching(
        timestamp: 20,
      ),
    );

    result.add(
      eventAlign(
        timestamp: 25,
      ),
    );*/

    return result;
  }

  Event _eventCoin({
    required Grid grid,
    required double timestamp,
  }) {
    final Event event = EventCoin(
      timestamp: timestamp,
      timeout: Timeout.short.time.toDouble(),
      tiles: [],
    );

    final List<Location> locations = grid.locations(1);

    for (final Location location in locations) {
      event.addTile(
        TileCoin(
          location: location,
          event: event,
        ),
      );
    }

    return event;
  }

  Event eventDirectional({
    required double timestamp,
  }) {
    final Event event = EventDirectional(
      timestamp: timestamp,
      timeout: Timeout.short.time.toDouble(),
      tiles: [],
    );

    final List<Location> locations = _generateLocations(
      width: width,
      height: height,
      length: 1,
    );

    for (final Location location in locations) {
      final Direction direction = _randomEnum(Direction.values);

      event.addTile(
        TileDirectional(
          location: location,
          event: event,
          direction: direction,
        ),
      );
    }

    return event;
  }

  Event eventCountdown({
    required double timestamp,
  }) {
    final int timeout = _randomInt(5, 9);
    final Event event = EventCountdown(
      timestamp: timestamp,
      timeout: timeout.toDouble(),
      tiles: [],
    );

    final List<Location> locations = _generateLocations(
      width: width,
      height: height,
      length: 1,
    );

    for (final Location location in locations) {
      event.addTile(
        TileCountdown(
          location: location,
          event: event,
          timeout: timeout.toDouble(),
        ),
      );
    }

    return event;
  }

  Event eventChest({
    required double timestamp,
  }) {
    final Event event = EventChest(
      timestamp: timestamp,
      timeout: Timeout.medium.time.toDouble(),
      tiles: [],
    );

    final List<Location> locations = _generateLocations(
      width: width,
      height: height,
      length: 1,
    );

    for (final Location location in locations) {
      event.addTile(
        TileChest(
          location: location,
          event: event,
        ),
      );
    }

    return event;
  }

  Event eventBomb({
    required double timestamp,
  }) {
    final Event event = EventBomb(
      timestamp: timestamp,
      timeout: Timeout.medium.time.toDouble(),
      tiles: [],
    );

    final List<Location> locations = _generateLocations(
      width: width,
      height: height,
      length: 1,
    );

    for (final Location location in locations) {
      event.addTile(
        TileBomb(
          location: location,
          event: event,
        ),
      );
    }

    return event;
  }

  Event eventQuantity({
    required double timestamp,
  }) {
    final int quantity = _randomInt(3, 6);
    final Event event = EventQuantity(
      timestamp: timestamp,
      timeout: Timeout.medium.time.toDouble(),
      tiles: [],
      quantity: quantity,
    );

    final List<Location> locations = _generateLocations(
      width: width,
      height: height,
      length: 1,
    );

    for (final Location location in locations) {
      event.addTile(
        TileQuantity(
          location: location,
          event: event,
          quantity: quantity,
        ),
      );
    }

    return event;
  }

  Event eventSequence({
    required double timestamp,
  }) {
    final int length = _randomInt(3, 6);
    final Event event = EventSequence(
      timestamp: timestamp,
      timeout: (Timeout.short.time * length).toDouble(),
      tiles: [],
    );

    final List<Location> locations = _generateLocations(
      width: width,
      height: height,
      length: length,
    );

    for (int i = 0; i < locations.length; i++) {
      final Location location = locations[i];

      event.addTile(
        TileSequence(
          location: location,
          event: event,
          number: i + 1,
        ),
      );
    }

    return event;
  }

  Event eventMatching({
    required double timestamp,
  }) {
    final Category validCategory = _randomEnum(Category.values);
    final int validTiles = _randomInt(4, 6);
    final int invalidTiles = validTiles ~/ 2;
    final Event event = EventMatching(
      timestamp: timestamp,
      timeout: (Timeout.short.time * validTiles).toDouble(),
      tiles: [],
      category: validCategory,
      validTiles: validTiles,
    );

    final List<Location> locations = _generateLocations(
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

    for (int i = 0; i < locations.length; i++) {
      final Location location = locations[i];

      event.addTile(
        TileMatching(
          location: location,
          event: event,
          category: values[i].$2,
          value: values[i].$1,
        ),
      );
    }

    return event;
  }

  Event eventAlign({
    required double timestamp,
  }) {
    final int length = _randomInt(3, 6);
    final Direction direction = _randomEnum(Direction.values);
    final Event event = EventAlign(
      timestamp: timestamp,
      timeout: (Timeout.short.time * length).toDouble(),
      tiles: [],
      direction: direction,
    );

    final List<Location> locations = _generateLocations(
      width: width,
      height: height,
      length: length,
    );

    for (final Location location in locations) {
      final Direction direction = _randomEnum(Direction.values);

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

  static List<Location> _generateLocations({
    required int width,
    required int height,
    required int length,
  }) {
    final Random random = Random();
    final Set<Location> locations = {};

    while (locations.length < length) {
      final int x = random.nextInt(width);
      final int y = random.nextInt(height);
      final Location coord = Location(x, y);
      locations.add(coord);
    }

    return locations.toList();
  }

  static int _randomInt(int min, int max) {
    final Random random = Random();

    return min + random.nextInt(max - min + 1);
  }

  static T _randomEnum<T>(List<T> values) =>
      values[_randomInt(0, values.length)];
}

class Grid {
  final int width;
  final int height;
  final List<List<int>> grid;

  const Grid({
    required this.width,
    required this.height,
    required this.grid,
  });

  factory Grid.create({
    required int width,
    required int height,
  }) => Grid(
    width: width,
    height: height,
    grid: List.generate(height, (_) => List.generate(width, (_) => 0)),
  );

  int get(int x, int y) => grid[y][x];

  int get occupancy {
    int result = 0;

    for (final List<int> row in grid) {
      for (final int value in row) {
        if (value != 0) {
          result++;
        }
      }
    }

    return result;
  }

  int get ratio => ((occupancy / (width * height)) * 100).round();

  List<Location> locations(int amount) {
    final Random random = Random();
    final Set<Location> locations = {};

    while (locations.length < amount) {
      final int x = random.nextInt(width);
      final int y = random.nextInt(height);
      final int value = get(x, y);

      if (value == 0) {
        final Location coord = Location(x, y);
        locations.add(coord);
      }
    }

    return locations.toList();
  }
}
