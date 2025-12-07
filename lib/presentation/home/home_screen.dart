import 'package:dafluta/dafluta.dart';
import 'package:flutter/material.dart';
import 'package:tensiongrid/domain/state/home/home_state.dart';
import 'package:tensiongrid/presentation/common/buttons/primary_button.dart';
import 'package:tensiongrid/presentation/common/containers/game_container.dart';
import 'package:tensiongrid/utils/palette.dart';

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
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          PrimaryButton(
            label: 'Play',
            enabled: true,
            backgroundColor: Palette.PRIMARY,
            onPressed: state.onPlay,
          ),
          const VBox(50),
          PrimaryButton(
            label: 'Settings',
            enabled: true,
            backgroundColor: Palette.PRIMARY,
            onPressed: state.onSettings,
          ),
        ],
      ),
    );
  }
}
