class AudioSpec {
  final String path;
  final bool loop;
  final double volume;

  const AudioSpec({
    required this.path,
    this.loop = false,
    this.volume = 1.0,
  });
}
