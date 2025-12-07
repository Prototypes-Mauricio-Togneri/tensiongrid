import 'package:json_annotation/json_annotation.dart';
import 'json_player.dart';

part 'json_match.g.dart';

@JsonSerializable()
class JsonMatch {
  @JsonKey(name: 'id')
  final String id;

  @JsonKey(name: 'createdAt')
  final DateTime createdAt;

  @JsonKey(name: 'player1')
  final JsonPlayer player1;

  @JsonKey(name: 'player2')
  final JsonPlayer player2;

  const JsonMatch({
    required this.id,
    required this.createdAt,
    required this.player1,
    required this.player2,
  });

  factory JsonMatch.fromJson(Map<String, dynamic> json) =>
      _$JsonMatchFromJson(json);

  Map<String, dynamic> toJson() => _$JsonMatchToJson(this);
}
