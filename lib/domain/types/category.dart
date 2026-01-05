enum Category {
  face(list: ['😀', '😁', '😂', '🤔', '😛', '🙃', '😴', '🤕', '😵', '😯']),
  animal(list: ['🦘', '🐕', '🐈', '🐎', '🐄', '🐖', '🐑', '🪿', '🐒', '🐇']),
  plant(list: ['🌵', '🌷', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🌻'])
  ;

  final List<String> list;

  const Category({required this.list});
}
