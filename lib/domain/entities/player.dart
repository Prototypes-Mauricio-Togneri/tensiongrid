import 'dart:ui';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/json/json_player.dart';
import 'package:tensiongrid/utils/palette.dart';

class Player {
  final String id;
  final bool isSelf;
  final int index;
  final String name;
  final int score;

  static const Player BOT = Player(
    id: 'bot',
    isSelf: false,
    index: 1,
    name: 'Bot',
    score: 10,
  );

  const Player({
    required this.id,
    required this.isSelf,
    required this.index,
    required this.name,
    required this.score,
  });

  Color get color {
    if (index == Constants.PLAYER_1) {
      return Palette.PLAYER_1;
    } else if (index == Constants.PLAYER_2) {
      return Palette.PLAYER_2;
    }
    {
      return Palette.TRANSPARENT;
    }
  }

  JsonPlayer get json => JsonPlayer(
    id: id,
    index: index,
    name: name,
    score: score,
  );
}
