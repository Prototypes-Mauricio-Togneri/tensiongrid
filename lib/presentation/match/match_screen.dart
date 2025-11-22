import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/state/match/match_state.dart';
import 'package:tensiongrid/widgets/game_container.dart';

class MatchScreen extends StatelessWidget {
  final MatchState state;

  const MatchScreen._(this.state);

  factory MatchScreen.instance() => MatchScreen._(MatchState());

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
    return Container(
      height: 50,
      color: Colors.red,
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
        color: Colors.green,
      ),
    );
  }
}

class Info extends StatelessWidget {
  final MatchState state;

  const Info(this.state);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 150,
      color: Colors.amber,
    );
  }
}
