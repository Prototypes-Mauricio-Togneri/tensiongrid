import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/result.dart';
import 'package:tensiongrid/domain/entities/size.dart';
import 'package:tensiongrid/domain/json/json_grid.dart';

class Grid {
  final String id;
  final DateTime createdAt;
  final Size size;
  final List<Event> events;
  final String? winnerId;
  final List<String> playerIds;
  final List<Result> results;

  const Grid({
    required this.id,
    required this.createdAt,
    required this.size,
    required this.events,
    required this.winnerId,
    required this.playerIds,
    required this.results,
  });

  Grid withResult(Result result) {
    final String userId = result.player2.id;
    final List<Result> newResults = [];

    for (final Result element in results) {
      if (element.id == result.id) {
        newResults.add(result);
      } else {
        newResults.add(element);
      }
    }

    return Grid(
      id: id,
      createdAt: createdAt,
      size: size,
      events: events,
      winnerId: null,
      playerIds: [
        ...playerIds,
        if (!playerIds.contains(userId)) userId,
      ],
      results: newResults,
    );
  }

  JsonGrid get json => JsonGrid(
    id: id,
    createdAt: createdAt,
    size: size.json,
    events: events.map((e) => e.json).toList(),
    winnerId: winnerId,
    playerIds: playerIds,
    results: results.map((r) => r.json).toList(),
  );
}
