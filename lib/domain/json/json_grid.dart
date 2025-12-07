import 'package:json_annotation/json_annotation.dart';
import 'package:tensiongrid/domain/json/json_event.dart';
import 'package:tensiongrid/domain/json/json_match.dart';
import 'package:tensiongrid/domain/json/json_size.dart';

part 'json_grid.g.dart';

@JsonSerializable()
class JsonGrid {
  @JsonKey(name: 'id')
  final String id;

  @JsonKey(name: 'createdAt')
  final DateTime createdAt;

  @JsonKey(name: 'size')
  final JsonSize size;

  @JsonKey(name: 'events')
  final List<JsonEvent> events;

  @JsonKey(name: 'winnerId')
  final String? winnerId;

  @JsonKey(name: 'playerIds')
  final List<String> playerIds;

  @JsonKey(name: 'matches')
  final List<JsonMatch> matches;

  const JsonGrid({
    required this.id,
    required this.createdAt,
    required this.size,
    required this.events,
    required this.winnerId,
    required this.playerIds,
    required this.matches,
  });

  factory JsonGrid.fromJson(Map<String, dynamic> json) =>
      _$JsonGridFromJson(json);

  Map<String, dynamic> toJson() => _$JsonGridToJson(this);
}
