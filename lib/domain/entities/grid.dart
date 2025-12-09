import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/entities/result.dart';
import 'package:tensiongrid/domain/entities/size.dart';
import 'package:tensiongrid/domain/json/json_grid.dart';
import 'package:uuid/uuid.dart';

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

  Result resultFor(String userId) {
    // Search for results where the player lost
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

    // Search any result where the player participated
    for (final Result result in results) {
      if (result.player1.id == userId || result.player2.id == userId) {
        return result;
      }
    }

    throw Exception('No result found for userId: $userId');
  }

  List<Player> get _players {
    final List<Player> playersSet = [];

    for (final Result result in results) {
      if (!result.player1.isBot) {
        playersSet.add(result.player1);
      }
      if (!result.player2.isBot) {
        playersSet.add(result.player2);
      }
    }

    return playersSet.toList();
  }

  int _averageScore(List<Player> players) {
    int sum = 0;
    int count = 0;

    for (final Player player in players) {
      if (player.score > 0) {
        sum += player.score;
        count++;
      }
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

    for (final Player player in players) {
      if (opponent == null) {
        opponent = player;
      } else {
        final int opponentDiff = (opponent.score - averageScore).abs();
        final int playerDiff = (player.score - averageScore).abs();

        if (playerDiff < opponentDiff) {
          opponent = player;
        }
      }
    }

    return Result(
      id: const Uuid().v4(),
      createdAt: DateTime.now(),
      player1: opponent ?? Player.BOT,
      player2: Player(
        id: userId,
        index: 2,
        name: userName,
        score: averageScore,
        isSelf: true,
      ),
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
