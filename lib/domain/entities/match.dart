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
  int _score = 0;

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

  int get score => _score;

  void _addPoints(int points) {
    _score += points;
  }

  void _removePoints(int points) {
    _score -= points;

    if (_score < 0) {
      _score = 0;
    }
  }

  (List<Event>, List<Event>) update(double dt) {
    elapsedTime += dt;

    final List<Event> timedOutEvents = [];

    for (final Event event in currentEvents) {
      if (event.update(dt)) {
        currentEvents.remove(event);
        pastEvents.add(event);
        timedOutEvents.add(event);
        _removePoints(event.pointsTimeout);
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

    return (newEvents, timedOutEvents);
  }

  ActionResult onTileTapped(Tile tile) {
    for (final Event event in currentEvents) {
      if (event.containsTile(tile)) {
        final ActionResult result = event.onTileTapped(tile);

        if (result.score > 0) {
          _addPoints(result.score);
        } else if (result.score < 0) {
          _removePoints(-result.score);
        }

        return result;
      }
    }

    return const ActionResult(
      score: -10,
      soundError: true,
    );
  }
}
