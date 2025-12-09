import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/json/json_result.dart';
import 'package:uuid/uuid.dart';

class Result {
  final String id;
  final DateTime createdAt;
  final Player player1;
  final Player player2;

  const Result({
    required this.id,
    required this.createdAt,
    required this.player1,
    required this.player2,
  });

  String get winnerId {
    if (player1.score >= player2.score) {
      return player1.id;
    } else if (player2.score > player1.score) {
      return player2.id;
    } else {
      throw Exception('No winner in a draw');
    }
  }

  int get winnerScore {
    if (player1.score >= player2.score) {
      return player1.score;
    } else if (player2.score > player1.score) {
      return player2.score;
    } else {
      throw Exception('No winner in a draw');
    }
  }

  factory Result.withOpponent({
    required String userId,
    required String userName,
    required Player? opponent,
  }) => Result(
    id: const Uuid().v4(),
    createdAt: DateTime.now(),
    player1: opponent ?? Player.BOT,
    player2: Player(
      id: userId,
      index: 2,
      name: userName,
      score: 0,
      isSelf: true,
    ),
  );

  factory Result.withBot({
    required String userId,
    required String userName,
  }) => Result.withOpponent(
    userId: userId,
    userName: userName,
    opponent: Player.BOT,
  );

  JsonResult get json => JsonResult(
    id: id,
    createdAt: createdAt,
    player1: player1.json,
    player2: player2.json,
  );
}
