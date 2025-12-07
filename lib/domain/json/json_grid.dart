import 'package:json_annotation/json_annotation.dart';
import 'package:tensiongrid/domain/entities/grid.dart';

part 'json_grid.g.dart';

@JsonSerializable()
class JsonGrid {
  @JsonKey(name: 'id')
  final String id;

  const JsonGrid({
    required this.id,
  });

  Grid get object => Grid(id: id);

  factory JsonGrid.fromJson(Map<String, dynamic> json) =>
      _$JsonGridFromJson(json);

  Map<String, dynamic> toJson() => _$JsonGridToJson(this);
}
