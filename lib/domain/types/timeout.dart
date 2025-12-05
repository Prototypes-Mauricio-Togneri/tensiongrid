// TODO(momo): remove enum
enum Timeout {
  short(time: 3),
  medium(time: 5),
  long(time: 10);

  final int time; // in seconds

  const Timeout({required this.time});
}
