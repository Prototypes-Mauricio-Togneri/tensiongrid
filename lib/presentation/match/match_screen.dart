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
    return const Center(
      child: Text('MATCH', style: TextStyle(color: Colors.amber)),
    );
  }
}
