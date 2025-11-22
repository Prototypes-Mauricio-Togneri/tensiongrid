import 'package:tensiongrid/domain/entities/player.dart';

class Match {
  final String id;
  final Player player1;
  final Player player2;

  Match({
    required this.id,
    required this.player1,
    required this.player2,
  });

  factory Match.test() => Match(
    id: '123',
    player1: const Player(id: '1', name: 'Alice'),
    player2: const Player(id: '2', name: 'Bob'),
  );
}
