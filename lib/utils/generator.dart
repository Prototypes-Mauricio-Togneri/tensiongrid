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
import 'package:tensiongrid/domain/types/event_type.dart';

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
    double time = 0;

    for (int i = 0; i < timeout; i++) {
      grid.clean(time);

      while (grid.ratio < time) {
        final List<EventType> presentTypes = result
            .map((e) => e.type)
            .toSet()
            .toList();

        final Event event = _newEvent(
          grid: grid,
          trigger: time,
          presentTypes: presentTypes,
        );
        result.add(event);
        print('Event: ${event.type}, time $time, ratio ${grid.ratio}%');
      }

      time++;
    }

    return result;
  }

  Event _newEvent({
    required Grid grid,
    required double trigger,
    required List<EventType> presentTypes,
  }) {
    // TODO(momo): use weightes probabilities
    final EventType eventType = _randomEnum(EventType.values);

    switch (eventType) {
      case EventType.coin:
        return _eventCoin(
          grid: grid,
          trigger: trigger,
        );
      case EventType.directional:
        return _eventDirectional(
          grid: grid,
          trigger: trigger,
        );
      case EventType.countdown:
        return _eventCountdown(
          grid: grid,
          trigger: trigger,
        );
      case EventType.chest:
        return _eventChest(
          grid: grid,
          trigger: trigger,
        );
      case EventType.bomb:
        return _eventBomb(
          grid: grid,
          trigger: trigger,
        );
      case EventType.quantity:
        return _eventQuantity(
          grid: grid,
          trigger: trigger,
        );
      case EventType.sequence:
        return _eventSequence(
          grid: grid,
          trigger: trigger,
        );
      case EventType.matching:
        return _eventMatching(
          grid: grid,
          trigger: trigger,
        );
      case EventType.align:
        return _eventAlign(
          grid: grid,
          trigger: trigger,
        );
    }
  }

  Event _eventCoin({
    required Grid grid,
    required double trigger,
  }) {
    const double timeout = 3;
    final double removeTime = trigger + timeout;

    final Event event = EventCoin(
      trigger: trigger,
      timeout: timeout,
      tiles: [],
    );

    final List<Location> locations = grid.locations(
      amount: 1,
      removeTime: removeTime,
    );

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

  Event _eventDirectional({
    required Grid grid,
    required double trigger,
  }) {
    const double timeout = 3;
    final double removeTime = trigger + timeout;

    final Event event = EventDirectional(
      trigger: trigger,
      timeout: timeout,
      tiles: [],
    );

    final List<Location> locations = grid.locations(
      amount: 1,
      removeTime: removeTime,
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

  Event _eventCountdown({
    required Grid grid,
    required double trigger,
  }) {
    final double timeout = _randomInt(3, 9).toDouble();
    final double removeTime = trigger + timeout;

    final Event event = EventCountdown(
      trigger: trigger,
      timeout: timeout,
      tiles: [],
    );

    final List<Location> locations = grid.locations(
      amount: 1,
      removeTime: removeTime,
    );

    for (final Location location in locations) {
      event.addTile(
        TileCountdown(
          location: location,
          event: event,
          timeout: timeout,
        ),
      );
    }

    return event;
  }

  Event _eventChest({
    required Grid grid,
    required double trigger,
  }) {
    const double timeout = 5;
    final double removeTime = trigger + timeout;

    final Event event = EventChest(
      trigger: trigger,
      timeout: timeout,
      tiles: [],
    );

    final List<Location> locations = grid.locations(
      amount: 1,
      removeTime: removeTime,
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

  Event _eventBomb({
    required Grid grid,
    required double trigger,
  }) {
    const double timeout = 5;
    final double removeTime = trigger + timeout;

    final Event event = EventBomb(
      trigger: trigger,
      timeout: timeout,
      tiles: [],
    );

    final List<Location> locations = grid.locations(
      amount: 1,
      removeTime: removeTime,
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

  Event _eventQuantity({
    required Grid grid,
    required double trigger,
  }) {
    final int quantity = _randomInt(3, 6);
    const double timeout = 5;
    final double removeTime = trigger + timeout;

    final Event event = EventQuantity(
      trigger: trigger,
      timeout: timeout,
      tiles: [],
      quantity: quantity,
    );

    final List<Location> locations = grid.locations(
      amount: 1,
      removeTime: removeTime,
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

  Event _eventSequence({
    required Grid grid,
    required double trigger,
  }) {
    final int length = _randomInt(3, 6);
    final double timeout = (2 * length).toDouble();
    final double removeTime = trigger + timeout;

    final Event event = EventSequence(
      trigger: trigger,
      timeout: timeout,
      tiles: [],
    );

    final List<Location> locations = grid.locations(
      amount: length,
      removeTime: removeTime,
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

  Event _eventMatching({
    required Grid grid,
    required double trigger,
  }) {
    final Category validCategory = _randomEnum(Category.values);
    final int validTiles = _randomInt(Category.values.length + 1, 6);
    final int invalidTiles = Category.values.length - 1;

    final double timeout = (2 * validTiles).toDouble();
    final double removeTime = trigger + timeout;

    final Event event = EventMatching(
      trigger: trigger,
      timeout: timeout,
      tiles: [],
      category: validCategory,
      validTiles: validTiles,
    );

    final List<Location> locations = grid.locations(
      amount: validTiles + invalidTiles,
      removeTime: removeTime,
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

  Event _eventAlign({
    required Grid grid,
    required double trigger,
  }) {
    final int length = _randomInt(3, 6);
    final Direction direction = _randomEnum(Direction.values);

    final double timeout = (2 * length).toDouble();
    final double removeTime = trigger + timeout;

    final Event event = EventAlign(
      trigger: trigger,
      timeout: timeout,
      tiles: [],
      direction: direction,
    );

    final List<Location> locations = grid.locations(
      amount: length,
      removeTime: removeTime,
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

  static int _randomInt(int min, int max) {
    final Random random = Random();

    return min + random.nextInt(max - min + 1);
  }

  static T _randomEnum<T>(List<T> values) =>
      values[_randomInt(0, values.length - 1)];
}

class Grid {
  final int width;
  final int height;
  final List<List<double>> grid;

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

  double get(int x, int y) => grid[y][x];

  void set(int x, int y, double value) {
    grid[y][x] = value;
  }

  void clean(double time) {
    for (int y = 0; y < height; y++) {
      for (int x = 0; x < width; x++) {
        final double value = grid[y][x];

        if (value != 0 && value <= time) {
          set(x, y, 0);
        }
      }
    }
  }

  int get occupancy {
    int result = 0;

    for (final List<double> row in grid) {
      for (final double value in row) {
        if (value != 0) {
          result++;
        }
      }
    }

    return result;
  }

  int get ratio => ((occupancy / (width * height)) * 100).round();

  List<Location> locations({
    required int amount,
    required double removeTime,
  }) {
    final Random random = Random();
    final Set<Location> locations = {};

    while (locations.length < amount) {
      final int x = random.nextInt(width);
      final int y = random.nextInt(height);
      final double value = get(x, y);

      if (value == 0) {
        final Location coord = Location(x, y);
        locations.add(coord);
        set(x, y, removeTime);
      }
    }

    return locations.toList();
  }
}
