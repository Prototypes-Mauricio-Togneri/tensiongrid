import 'package:json_annotation/json_annotation.dart';
import 'package:tensiongrid/domain/entities/player.dart';

part 'json_player.g.dart';

@JsonSerializable()
class JsonPlayer {
  @JsonKey(name: 'id')
  final String id;

  @JsonKey(name: 'index')
  final int index;

  @JsonKey(name: 'name')
  final String name;

  @JsonKey(name: 'score')
  final int score;

  const JsonPlayer({
    required this.id,
    required this.index,
    required this.name,
    required this.score,
  });

  Player object(bool isSelf) => Player(
    id: id,
    index: index,
    name: name,
    score: score,
    isSelf: isSelf,
  );

  factory JsonPlayer.fromJson(Map<String, dynamic> json) =>
      _$JsonPlayerFromJson(json);

  Map<String, dynamic> toJson() => _$JsonPlayerToJson(this);
}
