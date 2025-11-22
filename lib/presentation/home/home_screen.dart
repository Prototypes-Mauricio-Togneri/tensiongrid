import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/state/home/home_state.dart';
import 'package:tensiongrid/utils/palette.dart';
import 'package:tensiongrid/widgets/game_container.dart';

class HomeScreen extends StatelessWidget {
  final HomeState state;

  const HomeScreen._(this.state);

  factory HomeScreen.instance() => HomeScreen._(HomeState());

  @override
  Widget build(BuildContext context) {
    return GameContainer(
      child: Content(state),
    );
  }
}

class Content extends StatelessWidget {
  final HomeState state;

  const Content(this.state);

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text(
        'Tension Grid',
        style: TextStyle(
          color: Palette.TEXT_COLOR_PRIMARY,
        ),
      ),
    );
  }
}
