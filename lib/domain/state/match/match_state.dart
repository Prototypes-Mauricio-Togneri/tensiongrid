import 'package:dafluta/dafluta.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/presentation/audio/audio.dart';
import 'package:tensiongrid/presentation/audio/music.dart';

class MatchState extends BaseState {
  final Match match;

  MatchState(this.match);

  @override
  void onLoad() {
    Audio.get.playMusic(Music.MUSIC);
  }

  @override
  void onDestroy() {
    Audio.get.stopMusic();
  }
}
