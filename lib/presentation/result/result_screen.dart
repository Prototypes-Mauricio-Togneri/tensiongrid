import 'package:dafluta/dafluta.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/entities/result.dart';
import 'package:tensiongrid/domain/state/result/result_state.dart';
import 'package:tensiongrid/presentation/common/buttons/primary_button.dart';
import 'package:tensiongrid/presentation/common/containers/game_container.dart';
import 'package:tensiongrid/presentation/common/text/neon_label.dart';
import 'package:tensiongrid/utils/palette.dart';

class ResultScreen extends StatelessWidget {
  final ResultState state;

  const ResultScreen._(this.state);

  factory ResultScreen.instance({
    required Match match,
    required Result result,
  }) => ResultScreen._(ResultState(match, result));

  @override
  Widget build(BuildContext context) {
    return GameContainer(
      child: Content(state),
    );
  }
}

class Content extends StatelessWidget {
  final ResultState state;

  const Content(this.state);

  @override
  Widget build(BuildContext context) {
    final Player player1 = state.match.player1;
    final Player player2 = state.match.player2;

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        PlayerScore(
          player: player1,
          score: player1.isSelf ? state.match.score : player1.score,
        ),
        const VBox(20),
        PlayerScore(
          player: player2,
          score: player2.isSelf ? state.match.score : player2.score,
        ),
        const VBox(50),
        PrimaryButton(
          label: 'Close',
          enabled: true,
          backgroundColor: Palette.PRIMARY,
          onPressed: state.onClose,
        ),
      ],
    );
  }
}

class PlayerScore extends StatelessWidget {
  final Player player;
  final int score;

  const PlayerScore({
    required this.player,
    required this.score,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        NeonLabel(
          text: player.name.toUpperCase(),
          size: 36,
          color: player.color,
        ),
        const HBox(20),
        NeonLabel(
          text: score.toString(),
          size: 36,
          color: Palette.TEXT_COLOR_PRIMARY,
        ),
      ],
    );
  }
}
