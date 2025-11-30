import 'package:tensiongrid/domain/entities/action_result.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/entities/tiles/tile.dart';
import 'package:tensiongrid/domain/types/direction.dart';

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

    final List<Event> timedOutEvents = _timedoutEvents(dt);

    for (final Event event in timedOutEvents) {
      pastEvents.add(event);
      currentEvents.remove(event);
      _removePoints(event.pointsTimeout);
    }

    final List<Event> newEvents = _newEvents(elapsedTime);

    for (final Event event in newEvents) {
      currentEvents.add(event);
      futureEvents.remove(event);
    }

    return (timedOutEvents, newEvents);
  }

  List<Event> _timedoutEvents(double dt) {
    final List<Event> result = [];

    for (final Event event in currentEvents) {
      if (event.update(dt)) {
        result.add(event);
      }
    }

    return result;
  }

  List<Event> _newEvents(double elapsedTime) {
    final List<Event> result = [];

    for (final Event event in futureEvents) {
      if (event.isNew(elapsedTime)) {
        result.add(event);
      }
    }

    return result;
  }

  ActionResult onTilePressed({
    required Tile tile,
    required double time,
  }) {
    final ActionResult result = tile.event.onTilePressed(
      tile: tile,
      time: time,
    );
    _processActionResult(
      result: result,
      event: tile.event,
    );

    return result;
  }

  ActionResult onTileTapped({
    required Tile tile,
    required double time,
  }) {
    final ActionResult result = tile.event.onTileTapped(
      tile: tile,
      time: time,
    );
    _processActionResult(
      result: result,
      event: tile.event,
    );

    return result;
  }

  ActionResult onTileSwiped({
    required Tile tile,
    required Direction direction,
  }) {
    final ActionResult result = tile.event.onTileSwiped(
      tile: tile,
      direction: direction,
    );
    _processActionResult(
      result: result,
      event: tile.event,
    );

    return result;
  }

  void _processActionResult({
    required ActionResult result,
    required Event event,
  }) {
    if (result.score > 0) {
      _addPoints(result.score);
    } else if (result.score < 0) {
      _removePoints(-result.score);
    }

    if (result.eventCompleted) {
      currentEvents.remove(event);
      pastEvents.add(event);
    }
  }

  void onWrongAction() {
    _removePoints(5);
  }
}
