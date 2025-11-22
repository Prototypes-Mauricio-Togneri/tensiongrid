import 'package:chronochicken/domain/state/home/home_state.dart';
import 'package:chronochicken/utils/palette.dart';
import 'package:chronochicken/widgets/game_container.dart';
import 'package:flutter/material.dart';

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
        'Chrono Chicken',
        style: TextStyle(
          color: Palette.TEXT_COLOR_PRIMARY,
        ),
      ),
    );
  }
}
