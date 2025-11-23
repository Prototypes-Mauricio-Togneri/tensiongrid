import 'package:flame/components.dart';
import 'package:tensiongrid/domain/components/game_component.dart';
import 'package:tensiongrid/domain/components/match_component.dart';

extension ComponentExtension on Component {
  GameComponent get game => GameComponentRef.instance;

  MatchComponent get match => MatchComponentRef.instance;
}
