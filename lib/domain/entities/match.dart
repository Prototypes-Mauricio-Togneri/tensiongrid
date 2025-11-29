import 'package:flutter/material.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/number_type.dart';
import 'package:tensiongrid/utils/formatter.dart';
import 'package:tensiongrid/utils/generator.dart';

class Match {
  final String id;
  final int width;
  final int height;
  final Player player1;
  final Player player2;
  final List<Event> futureEvents;
  final List<Event> currentEvents = [];
  final List<Event> pastEvents = [];
  double elapsedTime = 0;
  int score = 0;

  Match({
    required this.id,
    required this.width,
    required this.height,
    required this.player1,
    required this.player2,
    required this.futureEvents,
  });

  String get elapsedTimeFormatted =>
      Formatter.hoursMinutes(elapsedTime.floor());

  List<Event> update(double dt) {
    elapsedTime += dt;

    for (final Event event in currentEvents) {
      if (event.isTimedOut(elapsedTime)) {
        currentEvents.remove(event);
        pastEvents.add(event);
      }
    }

    final List<Event> newEvents = [];

    for (final Event event in futureEvents) {
      if (event.isBefore(elapsedTime)) {
        futureEvents.remove(event);
        newEvents.add(event);
      }
    }

    currentEvents.addAll(newEvents);

    return newEvents;
  }

  ActionResult onTileTapped(Tile tile) {
    /*inal ActionResult result = stage.onTileTapped(tile);

    if (result.nextStage) {
      stageIndex++;
    }

    return result;*/
    return const ActionResult();
  }

  factory Match.test() {
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
      futureEvents: [
        generator.eventSequence(
          id: 's0',
          timestamp: 3,
          timeout: 5,
          length: 3,
          type: NumberType.arabic,
        ),
      ],
    );
  }
}
