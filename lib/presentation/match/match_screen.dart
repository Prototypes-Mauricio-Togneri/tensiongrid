import 'package:dafluta/dafluta.dart';
import 'package:flame/game.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/components/game_component.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/state/match/match_state.dart';
import 'package:tensiongrid/presentation/common/containers/game_container.dart';
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
        Column(
          children: [
            TopBar(state),
            Grid(state),
            Info(state),
          ],
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
          height: 50,
          child: Row(
            children: [
              PlayerSection(
                player: state.match.player1,
                alignment: Alignment.centerLeft,
                color: Palette.PLAYER_1,
              ),
              MiddleSection(state),
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
        padding: const EdgeInsets.symmetric(horizontal: 20),
        height: 50,
        color: color,
        child: Align(
          alignment: alignment,
          child: Text(
            player.name.toUpperCase(),
            style: const TextStyle(
              fontSize: 22,
              color: Palette.PLAYER_NAME,
            ),
          ),
        ),
      ),
    );
  }
}

class MiddleSection extends StatelessWidget {
  final MatchState state;

  const MiddleSection(this.state);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 150,
      height: 50,
      color: Palette.TOPBAR_MIDDLE,
      child: Center(
        child: Text(
          'STAGE ${state.match.stageIndex + 1}/${state.match.stages.length}',
          style: const TextStyle(
            fontSize: 18,
            color: Palette.TOPBAR_TEXT,
          ),
        ),
      ),
    );
  }
}

class Grid extends StatelessWidget {
  final MatchState state;

  const Grid(this.state);

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(10),
        child: GameWidget(
          game: GameComponent(
            match: state.match,
            matchState: state,
          ),
        ),
      ),
    );
  }
}

class Info extends StatelessWidget {
  final MatchState state;

  const Info(this.state);

  @override
  Widget build(BuildContext context) {
    return StateProvider<MatchState>(
      state: state,
      builder: (context, state) {
        return Container(
          height: 150,
          color: Colors.amber,
          child: Center(
            child: Text(
              state.match.stage.info.toUpperCase(),
              style: const TextStyle(fontSize: 24),
            ),
          ),
        );
      },
    );
  }
}
