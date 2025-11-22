import 'package:dafluta/dafluta.dart';
import 'package:flame/game.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/components/game_component.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/entities/player.dart';
import 'package:tensiongrid/domain/state/match/match_state.dart';
import 'package:tensiongrid/widgets/game_container.dart';

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
    return Column(
      children: [
        TopBar(state),
        Grid(state),
        Info(state),
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
        return Container(
          height: 50,
          color: Colors.blue,
          child: Row(
            children: [
              PlayerSection(
                player: state.match.player1,
                alignment: Alignment.centerLeft,
                color: Colors.blue,
              ),
              MiddleSection(state),
              PlayerSection(
                player: state.match.player2,
                alignment: Alignment.centerRight,
                color: Colors.red,
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
    this.color = Colors.red,
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
              fontSize: 18,
              color: Colors.white,
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
      width: 100,
      height: 50,
      color: Colors.grey,
      child: Center(
        child: Text(
          'STAGE ${state.match.stageIndex + 1}',
          style: const TextStyle(
            fontSize: 18,
            color: Colors.white,
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
