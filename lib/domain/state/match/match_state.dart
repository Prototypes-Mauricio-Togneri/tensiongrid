import 'package:dafluta/dafluta.dart';
import 'package:tensiongrid/domain/entities/grid.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/utils/navigation.dart';

class MatchState extends BaseState {
  final Grid grid;
  final Match match;

  MatchState(this.grid, this.match);

  void onMatchFinished() => Navigation.resultScreen(match);
}
