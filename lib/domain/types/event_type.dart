enum EventType {
  coin(
    probability: 16,
    isUnique: false,
  ),
  directional(
    probability: 16,
    isUnique: false,
  ),
  countdown(
    probability: 10,
    isUnique: true,
  ),
  chest(
    probability: 5,
    isUnique: true,
  ),
  bomb(
    probability: 5,
    isUnique: true,
  ),
  quantity(
    probability: 15,
    isUnique: false,
  ),
  sequence(
    probability: 11,
    isUnique: true,
  ),
  matching(
    probability: 11,
    isUnique: true,
  ),
  align(
    probability: 11,
    isUnique: true,
  );

  final int probability;
  final bool isUnique;

  const EventType({
    required this.probability,
    required this.isUnique,
  });
}
