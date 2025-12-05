import 'dart:ui';

class Player {
  final String id;
  final bool isSelf;
  final int index;
  final String name;
  final Color color;
  final int score;

  const Player({
    required this.id,
    required this.isSelf,
    required this.index,
    required this.name,
    required this.color,
    required this.score,
  });
}
