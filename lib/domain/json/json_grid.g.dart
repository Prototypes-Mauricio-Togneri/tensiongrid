// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'json_grid.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JsonGrid _$JsonGridFromJson(Map<String, dynamic> json) => JsonGrid(
  id: json['id'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  size: JsonSize.fromJson(json['size'] as Map<String, dynamic>),
  events: (json['events'] as List<dynamic>)
      .map((e) => JsonEvent.fromJson(e as Map<String, dynamic>))
      .toList(),
  winnerId: json['winnerId'] as String?,
  playerIds: (json['playerIds'] as List<dynamic>)
      .map((e) => e as String)
      .toList(),
  matches: (json['matches'] as List<dynamic>)
      .map((e) => JsonMatch.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$JsonGridToJson(JsonGrid instance) => <String, dynamic>{
  'id': instance.id,
  'createdAt': instance.createdAt.toIso8601String(),
  'size': instance.size,
  'events': instance.events,
  'winnerId': instance.winnerId,
  'playerIds': instance.playerIds,
  'matches': instance.matches,
};
