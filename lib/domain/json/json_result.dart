import 'package:json_annotation/json_annotation.dart';
import 'package:tensiongrid/domain/entities/result.dart';
import 'json_player.dart';

part 'json_result.g.dart';

@JsonSerializable()
class JsonResult {
  @JsonKey(name: 'id')
  final String id;

  @JsonKey(name: 'createdAt')
  final DateTime createdAt;

  @JsonKey(name: 'player1')
  final JsonPlayer player1;

  @JsonKey(name: 'player2')
  final JsonPlayer player2;

  const JsonResult({
    required this.id,
    required this.createdAt,
    required this.player1,
    required this.player2,
  });

  Result object(String userId) => Result(
    id: id,
    createdAt: createdAt,
    player1: player1.object(player1.id == userId),
    player2: player2.object(player2.id == userId),
  );

  factory JsonResult.fromJson(Map<String, dynamic> json) =>
      _$JsonResultFromJson(json);

  Map<String, dynamic> toJson() => _$JsonResultToJson(this);
}
