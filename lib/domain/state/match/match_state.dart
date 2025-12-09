import 'package:dafluta/dafluta.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/presentation/common/dialogs/confirmation_dialog.dart';
import 'package:tensiongrid/utils/navigation.dart';

class MatchState extends BaseState {
  final Match match;

  MatchState(this.match);

  void onOpenMenu() => ConfirmationDialog.quitMatch(Navigation.pop);

  void onMatchFinished() => Navigation.resultScreen(match);
}
