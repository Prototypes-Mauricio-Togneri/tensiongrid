import 'package:dafluta/dafluta.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/entities/result.dart';
import 'package:tensiongrid/domain/state/result/result_state.dart';
import 'package:tensiongrid/extensions/string_extension.dart';
import 'package:tensiongrid/presentation/common/buttons/primary_button.dart';
import 'package:tensiongrid/presentation/common/containers/game_container.dart';
import 'package:tensiongrid/presentation/common/text/neon_label.dart';
import 'package:tensiongrid/utils/palette.dart';

class ResultScreen extends StatelessWidget {
  final ResultState state;

  const ResultScreen._(this.state);

  factory ResultScreen.instance(Match match) =>
      ResultScreen._(ResultState(match));

  @override
  Widget build(BuildContext context) {
    return GameContainer(
      child: Content(
        state: state,
        result: state.match.result,
      ),
    );
  }
}

class Content extends StatelessWidget {
  final ResultState state;
  final Result result;

  const Content({
    required this.state,
    required this.result,
  });

  @override
  Widget build(BuildContext context) {
    final Player player1 = result.player1;
    final Player player2 = result.player2;

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        PlayerRow(player1),
        const VBox(20),
        PlayerRow(player2),
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

class PlayerRow extends StatelessWidget {
  final Player player;

  const PlayerRow(this.player);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        NeonLabel(
          text: player.name.short.toUpperCase(),
          size: 28,
          color: player.color,
        ),
        const HBox(20),
        NeonLabel(
          text: player.score.toString(),
          size: 28,
          color: Palette.TEXT_COLOR_PRIMARY,
        ),
      ],
    );
  }
}
