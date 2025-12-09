import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/entities/result.dart';
import 'package:tensiongrid/domain/entities/size.dart';
import 'package:tensiongrid/domain/json/json_grid.dart';

class Grid {
  final String id;
  final DateTime createdAt;
  final Size size;
  final int timeout;
  final List<Event> events;
  final String winnerId;
  final int winnerScore;
  final List<String> playerIds;
  final List<Result> results;

  const Grid({
    required this.id,
    required this.createdAt,
    required this.size,
    required this.timeout,
    required this.events,
    required this.winnerId,
    required this.winnerScore,
    required this.playerIds,
    required this.results,
  });

  List<Player> get _players {
    final List<Player> playersSet = [];

    for (final Result result in results) {
      if (!result.player1.isBot && result.player1.score > 0) {
        playersSet.add(result.player1);
      }
      if (!result.player2.isBot && result.player2.score > 0) {
        playersSet.add(result.player2);
      }
    }

    return playersSet.toList();
  }

  int _averageScore(List<Player> players) {
    int sum = 0;
    int count = 0;

    for (final Player player in players) {
      sum += player.score;
      count++;
    }

    return (count == 0) ? 0 : (sum / count).round();
  }

  Result resultAsNewPlayer({
    required String userId,
    required String userName,
  }) {
    final List<Player> players = _players;
    final int averageScore = _averageScore(players);
    Player? opponent;
    int opponentScore = 0;

    for (final Player player in players) {
      final int opponentDiff = (opponentScore - averageScore).abs();
      final int playerDiff = (player.score - averageScore).abs();

      if (playerDiff < opponentDiff) {
        opponent = player;
        opponentScore = player.score;
      }
    }

    return Result.withOpponent(
      userId: userId,
      userName: userName,
      opponent: opponent,
    );
  }

  Result resultAsExistingPlayer({
    required String userId,
    required String userName,
  }) {
    final List<Player> players = _players;
    final Iterable<Player> opponents = players.where((p) => p.id != userId);
    final Iterable<Player> self = players.where((p) => p.id == userId);
    final int selfAverageScore = _averageScore(self.toList());
    Player? opponent;
    int opponentScore = 0;

    for (final Player player in opponents) {
      final int opponentDiff = (opponentScore - selfAverageScore).abs();
      final int playerDiff = (player.score - selfAverageScore).abs();

      if ((player.score > selfAverageScore) && (playerDiff < opponentDiff)) {
        opponent = player;
        opponentScore = player.score;
      }
    }

    return Result.withOpponent(
      userId: userId,
      userName: userName,
      opponent: opponent,
    );
  }

  Grid withResult(Result result) {
    final List<Result> newResults = [];
    bool found = false;

    for (final Result element in results) {
      if (element.id == result.id) {
        newResults.add(result);
        found = true;
      } else {
        newResults.add(element);
      }
    }

    if (!found) {
      newResults.add(result);
    }

    final bool newWinner = result.winnerScore > winnerScore;

    return Grid(
      id: id,
      createdAt: createdAt,
      size: size,
      timeout: timeout,
      events: events,
      winnerId: newWinner ? result.winnerId : winnerId,
      winnerScore: newWinner ? result.winnerScore : winnerScore,
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
    winnerScore: winnerScore,
    playerIds: playerIds,
    results: results.map((r) => r.json).toList(),
  );
}
