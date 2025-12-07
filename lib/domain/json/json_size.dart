import 'package:json_annotation/json_annotation.dart';

part 'json_size.g.dart';

@JsonSerializable()
class JsonSize {
  @JsonKey(name: 'width')
  final int width;

  @JsonKey(name: 'height')
  final int height;

  const JsonSize({
    required this.width,
    required this.height,
  });

  factory JsonSize.fromJson(Map<String, dynamic> json) =>
      _$JsonSizeFromJson(json);

  Map<String, dynamic> toJson() => _$JsonSizeToJson(this);
}
