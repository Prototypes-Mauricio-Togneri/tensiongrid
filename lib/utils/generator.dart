import 'dart:math';
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
import 'package:tensiongrid/domain/entities/grid.dart';
import 'package:tensiongrid/domain/entities/location.dart';
import 'package:tensiongrid/domain/entities/result.dart';
import 'package:tensiongrid/domain/entities/size.dart';
import 'package:tensiongrid/domain/types/category.dart';
import 'package:tensiongrid/domain/types/event_type.dart';

class GridGenerator {
  static Grid create({
    required String id,
    required Result result,
  }) {
    const Size size = Size(5, 5);
    const int timeout = 60;

    const EventGenerator generator = EventGenerator(
      size: size,
      timeout: timeout,
      minActiveTiles: 7,
      actionRate: 0.2,
    );

    return Grid(
      id: id,
      createdAt: DateTime.now(),
      size: size,
      timeout: timeout,
      events: generator.events,
      winnerId: result.winnerId,
      winnerScore: result.winnerScore,
      playerIds: [
        if (result.player1.id.isNotEmpty) result.player1.id,
        if (result.player2.id.isNotEmpty) result.player2.id,
      ],
      results: [result],
    );
  }

  static Grid tutorial() => Grid(
    id: 'tutorial',
    createdAt: DateTime.now(),
    size: const Size(5, 5),
    timeout: 60,
    events: [
      /*EventCoin.create(
        trigger: 1,
        locations: [const Location(2, 2)],
      ),
      EventDirectional.create(
        trigger: 3,
        locations: [const Location(1, 1)],
      ),
      EventCountdown.create(
        trigger: 5,
        timeout: 3,
        locations: [const Location(3, 3)],
      ),
      EventChest.create(
        trigger: 8,
        locations: [const Location(3, 1)],
      ),
      EventQuantity.create(
        trigger: 16,
        quantity: 5,
        locations: [const Location(1, 3)],
      ),
      EventBomb.create(
        trigger: 20,
        locations: [const Location(2, 0)],
      ),
      EventSequence.create(
        trigger: 28,
        timeout: 10,
        locations: [
          const Location(2, 3),
          const Location(3, 0),
          const Location(0, 4),
          const Location(4, 2),
          const Location(1, 1),
        ],
      ),
      EventMatching.create(
        trigger: 33,
        timeout: 10,
        values: [
          ('😀', Category.face),
          ('😂', Category.face),
          ('😁', Category.face),
          ('🐎', Category.animal),
          ('☘️', Category.plant),
        ],
        locations: [
          const Location(1, 0),
          const Location(3, 4),
          const Location(4, 1),
          const Location(0, 3),
          const Location(2, 2),
        ],
      ),
      EventAlign.create(
        trigger: 38,
        timeout: 8,
        locations: [
          const Location(1, 3),
          const Location(2, 0),
          const Location(3, 2),
          const Location(4, 4),
        ],
      ),*/
      EventCountdown.create(
        trigger: 42,
        timeout: 6,
        locations: [const Location(2, 2)],
      ),
      EventCoin.create(
        trigger: 42.5,
        locations: [const Location(2, 0)],
      ),
      EventDirectional.create(
        trigger: 43,
        locations: [const Location(1, 4)],
      ),
      EventCoin.create(
        trigger: 43.5,
        locations: [const Location(4, 3)],
      ),
      EventDirectional.create(
        trigger: 44,
        locations: [const Location(0, 1)],
      ),
      EventDirectional.create(
        trigger: 44.5,
        locations: [const Location(3, 1)],
      ),
      EventChest.create(
        trigger: 45,
        locations: [const Location(1, 3)],
      ),
      EventQuantity.create(
        trigger: 46,
        quantity: 5,
        locations: [const Location(1, 0)],
      ),
      EventQuantity.create(
        trigger: 47,
        quantity: 5,
        locations: [const Location(0, 2)],
      ),
      EventCoin.create(
        trigger: 48,
        locations: [const Location(4, 1)],
      ),
      EventQuantity.create(
        trigger: 49,
        quantity: 5,
        locations: [const Location(3, 3)],
      ),
    ],
    winnerId: '',
    winnerScore: 100,
    playerIds: [],
    results: [],
  );
}

class EventGenerator {
  final Size size;
  final int timeout;
  final int minActiveTiles;
  final double actionRate;

  const EventGenerator({
    required this.size,
    required this.timeout,
    required this.minActiveTiles,
    required this.actionRate,
  });

  List<Event> get events {
    final List<Event> result = [];
    final Tiles tiles = Tiles.create(
      width: size.width,
      height: size.height,
    );
    double time = 0;
    double currentOccupancy = 0;

    for (int i = 0; i < timeout * 10; i++) {
      tiles.clean(time);

      if (currentOccupancy < minActiveTiles) {
        final List<EventType> presentTypes = result
            .where((e) => (e.trigger + e.timeout) >= time)
            .map((e) => e.type)
            .toSet()
            .toList();
        final Event event = _newEvent(
          tiles: tiles,
          trigger: time,
          presentTypes: presentTypes,
        );
        result.add(event);
        currentOccupancy = tiles.occupancy.toDouble();
        print(
          'e=${event.type}, t=${time.toStringAsFixed(1)}, o=${tiles.occupancy}',
        );
      }

      currentOccupancy -= actionRate;
      time += 0.1;
    }

    return result;
  }

  Event _newEvent({
    required Tiles tiles,
    required double trigger,
    required List<EventType> presentTypes,
  }) {
    final EventType eventType = _nextEventType(presentTypes);

    switch (eventType) {
      case EventType.coin:
        return _eventCoin(
          tiles: tiles,
          trigger: trigger,
        );
      case EventType.directional:
        return _eventDirectional(
          tiles: tiles,
          trigger: trigger,
        );
      case EventType.countdown:
        return _eventCountdown(
          tiles: tiles,
          trigger: trigger,
        );
      case EventType.chest:
        return _eventChest(
          tiles: tiles,
          trigger: trigger,
        );
      case EventType.bomb:
        return _eventBomb(
          tiles: tiles,
          trigger: trigger,
        );
      case EventType.quantity:
        return _eventQuantity(
          tiles: tiles,
          trigger: trigger,
        );
      case EventType.sequence:
        return _eventSequence(
          tiles: tiles,
          trigger: trigger,
        );
      case EventType.matching:
        return _eventMatching(
          tiles: tiles,
          trigger: trigger,
        );
      case EventType.align:
        return _eventAlign(
          tiles: tiles,
          trigger: trigger,
        );
    }
  }

  EventType _nextEventType(List<EventType> presentTypes) {
    final List<EventType> availableTypes = [];

    for (final EventType type in EventType.values) {
      final bool canBeUsed = !type.isUnique || !presentTypes.contains(type);

      if (canBeUsed) {
        availableTypes.add(type);
      }
    }

    return _randomEventType(
      availableTypes.isEmpty ? EventType.values : availableTypes,
    );
  }

  EventType _randomEventType(List<EventType> types) {
    final Random random = Random();

    // 1. Calculate the total weight (sum of all probabilities)
    final int totalWeight = types
        .map((type) => type.probability)
        .reduce((a, b) => a + b);

    // 2. Pick a random number between 0 (inclusive) and totalWeight (exclusive)
    final int randomNumber = random.nextInt(totalWeight);

    // 3. Iterate through the events, accumulating weights to find the selection
    int cumulativeWeight = 0;

    for (final EventType type in types) {
      cumulativeWeight += type.probability;

      // If the random number is less than the current cumulative weight,
      // this is the selected event.
      if (randomNumber < cumulativeWeight) {
        return type;
      }
    }

    // This part should technically be unreachable if the logic is correct
    return types.first;
  }

  Event _eventCoin({
    required Tiles tiles,
    required double trigger,
  }) => EventCoin.create(
    trigger: trigger,
    locations: tiles.locations(
      amount: 1,
      removeTime: trigger + EventCoin.duration,
    ),
  );

  Event _eventDirectional({
    required Tiles tiles,
    required double trigger,
  }) => EventDirectional.create(
    trigger: trigger,
    locations: tiles.locations(
      amount: 1,
      removeTime: trigger + EventDirectional.duration,
    ),
  );

  Event _eventCountdown({
    required Tiles tiles,
    required double trigger,
  }) {
    final double timeout = randomInt(3, 9).toDouble();
    final double removeTime = trigger + timeout;

    return EventCountdown.create(
      trigger: trigger,
      timeout: timeout,
      locations: tiles.locations(
        amount: 1,
        removeTime: removeTime,
      ),
    );
  }

  Event _eventChest({
    required Tiles tiles,
    required double trigger,
  }) => EventChest.create(
    trigger: trigger,
    locations: tiles.locations(
      amount: 1,
      removeTime: trigger + EventChest.duration,
    ),
  );

  Event _eventBomb({
    required Tiles tiles,
    required double trigger,
  }) => EventBomb.create(
    trigger: trigger,
    locations: tiles.locations(
      amount: 1,
      removeTime: trigger + EventBomb.duration,
    ),
  );

  Event _eventQuantity({
    required Tiles tiles,
    required double trigger,
  }) => EventQuantity.create(
    trigger: trigger,
    quantity: randomInt(3, 6),
    locations: tiles.locations(
      amount: 1,
      removeTime: trigger + EventQuantity.duration,
    ),
  );

  Event _eventSequence({
    required Tiles tiles,
    required double trigger,
  }) {
    final int length = randomInt(3, 4);
    final double timeout = (EventSequence.durationPerTile * length).toDouble();

    return EventSequence.create(
      trigger: trigger,
      timeout: timeout,
      locations: tiles.locations(
        amount: length,
        removeTime: trigger + timeout,
      ),
    );
  }

  Event _eventMatching({
    required Tiles tiles,
    required double trigger,
  }) {
    final Category validCategory = randomEnum(Category.values);
    final int validTiles = Category.values.length;
    final int invalidTiles = Category.values.length - 1;
    final double timeout = (EventMatching.durationPerTile * validTiles)
        .toDouble();

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

    return EventMatching.create(
      trigger: trigger,
      timeout: timeout,
      values: values,
      locations: tiles.locations(
        amount: validTiles + invalidTiles,
        removeTime: trigger + timeout,
      ),
    );
  }

  Event _eventAlign({
    required Tiles tiles,
    required double trigger,
  }) {
    final int length = randomInt(3, 4);
    final double timeout = (EventAlign.durationPerTile * length).toDouble();

    return EventAlign.create(
      trigger: trigger,
      timeout: timeout,
      locations: tiles.locations(
        amount: length,
        removeTime: trigger + timeout,
      ),
    );
  }
}

int randomInt(int min, int max) {
  final Random random = Random();

  return min + random.nextInt(max - min + 1);
}

T randomEnum<T>(List<T> values) => values[randomInt(0, values.length - 1)];

class Tiles {
  final int width;
  final int height;
  final List<List<double>> _tiles;

  const Tiles({
    required this.width,
    required this.height,
    required List<List<double>> tiles,
  }) : _tiles = tiles;

  factory Tiles.create({
    required int width,
    required int height,
  }) => Tiles(
    width: width,
    height: height,
    tiles: List.generate(height, (_) => List.generate(width, (_) => 0)),
  );

  double get(int x, int y) => _tiles[y][x];

  void set(int x, int y, double value) => _tiles[y][x] = value;

  void clean(double time) {
    for (int y = 0; y < height; y++) {
      for (int x = 0; x < width; x++) {
        final double value = get(x, y);

        if (value != 0 && value <= time) {
          set(x, y, 0);
        }
      }
    }
  }

  int get occupancy {
    int result = 0;

    for (final List<double> row in _tiles) {
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
    final Set<Location> locations = {};

    while (locations.length < amount) {
      final Location location = Location.random(width, height);
      final double value = get(location.x, location.y);

      if (value == 0) {
        locations.add(location);
        set(location.x, location.y, removeTime);
      }
    }

    return locations.toList();
  }
}
