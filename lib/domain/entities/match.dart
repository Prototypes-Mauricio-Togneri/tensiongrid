import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';

class Match {
  final String id;
  final int width;
  final int height;
  final Player player1;
  final Player player2;
  final List<Event> pastEvents = [];
  final List<Event> currentEvents = [];
  final List<Event> futureEvents = [];
  double elapsedTime = 0;
  int score = 0;

  Match({
    required this.id,
    required this.width,
    required this.height,
    required this.player1,
    required this.player2,
    required List<Event> events,
  }) {
    futureEvents.addAll(events);
  }

  List<Event> update(double dt) {
    elapsedTime += dt;

    for (final Event event in currentEvents) {
      if (event.update(elapsedTime)) {
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
    for (final Event event in currentEvents) {
      if (event.containsTile(tile)) {
        return event.onTileTapped(tile);
      }
    }

    return const ActionResult(
      score: -10,
      soundError: true,
    );
  }
}
