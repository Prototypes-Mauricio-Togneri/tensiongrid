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

  factory Result.withBot({
    required String userId,
    required String userName,
  }) => Result(
    id: const Uuid().v4(),
    createdAt: DateTime.now(),
    player1: Player.BOT,
    player2: Player(
      id: userId,
      index: 2,
      name: userName,
      score: 0,
      isSelf: true,
    ),
  );

  JsonResult get json => JsonResult(
    id: id,
    createdAt: createdAt,
    player1: player1.json,
    player2: player2.json,
  );
}
