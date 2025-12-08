import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/result.dart';
import 'package:tensiongrid/domain/entities/size.dart';
import 'package:tensiongrid/domain/json/json_grid.dart';

class Grid {
  final String id;
  final DateTime createdAt;
  final Size size;
  final int timeout;
  final List<Event> events;
  final String? winnerId;
  final List<String> playerIds;
  final List<Result> results;

  const Grid({
    required this.id,
    required this.createdAt,
    required this.size,
    required this.timeout,
    required this.events,
    required this.winnerId,
    required this.playerIds,
    required this.results,
  });

  Result resultFor(String userId) {
    for (final Result result in results) {
      if (result.player1.id == userId &&
          result.player1.score < result.player2.score) {
        // Lost as player 1
        return result;
      } else if (result.player2.id == userId &&
          result.player2.score < result.player1.score) {
        // Lost as player 2
        return result;
      }
    }

    throw Exception('No result found for userId: $userId');
  }

  Grid withResult(Result result) {
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
      timeout: timeout,
      events: events,
      winnerId: result.winnerId,
      playerIds: [
        ...playerIds,
        if (!playerIds.contains(result.player1.id)) result.player1.id,
        if (!playerIds.contains(result.player2.id)) result.player2.id,
      ],
      results: newResults,
    );
  }

  JsonGrid get json => JsonGrid(
    id: id,
    createdAt: createdAt,
    size: size.json,
    timeout: timeout,
    events: events.map((e) => e.json).toList(),
    winnerId: winnerId,
    playerIds: playerIds,
    results: results.map((r) => r.json).toList(),
  );
}
