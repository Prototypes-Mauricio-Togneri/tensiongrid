import 'package:dafluta/dafluta.dart';
import 'package:flame/game.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/components/game_component.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/state/match/match_state.dart';
import 'package:tensiongrid/presentation/common/containers/game_container.dart';
import 'package:tensiongrid/presentation/common/text/neon_text.dart';
import 'package:tensiongrid/utils/assets.dart';
import 'package:tensiongrid/utils/palette.dart';

class MatchScreen extends StatelessWidget {
  final MatchState state;

  const MatchScreen._(this.state);

  factory MatchScreen.instance(Match match) => MatchScreen._(MatchState(match));

  @override
  Widget build(BuildContext context) {
    return GameContainer(
      child: Content(state),
    );
  }
}

class Content extends StatelessWidget {
  final MatchState state;

  const Content(this.state);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Container(
          decoration: const BoxDecoration(
            image: DecorationImage(
              image: AssetImage('assets/images/${Assets.IMAGES_BACKGROUND}'),
              fit: BoxFit.cover,
            ),
          ),
        ),
        GameWidget(
          game: GameComponent(
            match: state.match,
            state: state,
          ),
        ),
      ],
    );
  }
}

class TopBar extends StatelessWidget {
  final MatchState state;

  const TopBar(this.state);

  @override
  Widget build(BuildContext context) {
    return StateProvider<MatchState>(
      state: state,
      builder: (context, state) {
        return SizedBox(
          height: 40,
          child: Row(
            children: [
              PlayerSection(
                player: state.match.player1,
                alignment: Alignment.centerLeft,
                color: Palette.PLAYER_1,
              ),
              PlayerSection(
                player: state.match.player2,
                alignment: Alignment.centerRight,
                color: Palette.PLAYER_2,
              ),
            ],
          ),
        );
      },
    );
  }
}

class PlayerSection extends StatelessWidget {
  final Player player;
  final Alignment alignment;
  final Color color;

  const PlayerSection({
    required this.player,
    required this.alignment,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        margin: EdgeInsets.only(
          top: 0,
          left: alignment == Alignment.centerLeft ? 1 : 0,
          right: alignment == Alignment.centerLeft ? 0 : 1,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 10),
        decoration: BoxDecoration(
          border: Border.all(
            color: color,
            width: 2.5,
          ),
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(0),
            bottomLeft: Radius.circular(
              alignment == Alignment.centerLeft ? 0 : 20,
            ),
            topRight: const Radius.circular(0),
            bottomRight: Radius.circular(
              alignment == Alignment.centerRight ? 0 : 20,
            ),
          ),
          boxShadow: [
            BoxShadow(
              color: color.withAlpha(100),
              blurRadius: 2,
              spreadRadius: 2,
              offset: Offset.zero,
            ),
          ],
        ),
        child: Align(
          alignment: alignment,
          child: NeonText(
            text: player.name.toUpperCase(),
            size: 18,
            color: Palette.PLAYER_NAME,
          ),
        ),
      ),
    );
  }
}
