import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/domain/state/result/result_state.dart';
import 'package:tensiongrid/presentation/common/containers/game_container.dart';

class ResultScreen extends StatelessWidget {
  final ResultState state;

  const ResultScreen._(this.state);

  factory ResultScreen.instance(Match match) =>
      ResultScreen._(ResultState(match));

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
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'Final Score: ${state.match.score}',
          style: const TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 20),
        ElevatedButton(
          onPressed: () {
            // Restart the game or navigate to the main menu
          },
          child: const Text('Close'),
        ),
      ],
    );
  }
}
