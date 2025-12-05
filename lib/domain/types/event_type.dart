enum EventType {
  coin(probability: 16),
  directional(probability: 16),
  countdown(probability: 10),
  chest(probability: 5),
  bomb(probability: 5),
  quantity(probability: 15),
  sequence(probability: 11),
  matching(probability: 11),
  align(probability: 11);

  final int probability;

  const EventType({required this.probability});
}
