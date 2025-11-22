import 'package:chronochicken/domain/state/splash/splash_state.dart';
import 'package:chronochicken/utils/palette.dart';
import 'package:chronochicken/widgets/game_container.dart';
import 'package:dafluta/dafluta.dart';
import 'package:flutter/material.dart';

class SplashScreen extends StatelessWidget {
  final SplashState state;

  const SplashScreen._(this.state);

  factory SplashScreen.instance() => SplashScreen._(SplashState());

  @override
  Widget build(BuildContext context) {
    return GameContainer(child: Content(state));
  }
}

class Content extends StatelessWidget {
  final SplashState state;

  const Content(this.state);

  @override
  Widget build(BuildContext context) {
    return StateProvider<SplashState>(
      state: state,
      builder: (context, state) => const Center(
        child: CircularProgressIndicator(
          color: Palette.PRIMARY,
        ),
      ),
    );
  }
}
