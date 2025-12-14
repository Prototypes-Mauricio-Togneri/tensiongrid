import 'package:just_audio/just_audio.dart';
import 'package:tensiongrid/presentation/audio/audio.dart';
import 'package:tensiongrid/presentation/audio/audio_spec.dart';
import 'package:tensiongrid/utils/assets.dart';

mixin Music {
  final Map<String, AudioPlayer> _musicPlayers = {};
  AudioPlayer? _playerToResume;

  static const AudioSpec MUSIC = AudioSpec(
    path: Assets.AUDIO_MUSIC_MUSIC,
    loop: true,
    volume: 0.2,
  );

  Future<AudioPlayer> _getPlayer(AudioSpec spec) async {
    final AudioPlayer player = AudioPlayer();
    await player.setAsset(spec.path);
    await player.setLoopMode(spec.loop ? LoopMode.all : LoopMode.off);
    await player.setVolume(spec.volume);

    return player;
  }

  Future playMusic(AudioSpec audioSpec) async {
    if (Audio.get.enabled) {
      await stopMusic();
      await _musicPlayers[audioSpec.path]?.seek(Duration.zero);
      await _musicPlayers[audioSpec.path]?.play();
    }
  }

  Future pauseMusic() async {
    for (final AudioPlayer player in _musicPlayers.values) {
      if (player.playing) {
        _playerToResume = player;
        break;
      }
    }

    await _playerToResume?.pause();
  }

  void resumeMusic() {
    _playerToResume?.play();
    _playerToResume = null;
  }

  Future stopMusic() =>
      Future.wait(_musicPlayers.values.map((player) => player.stop()));

  Future loadMusic() async {
    _musicPlayers[MUSIC.path] = await _getPlayer(MUSIC);
  }

  void musicSpeed(double value) {
    _musicPlayers.forEach((key, player) => player.setSpeed(value));
  }

  void disposeMusic() {
    _musicPlayers.forEach((key, player) => player.dispose());
  }
}
