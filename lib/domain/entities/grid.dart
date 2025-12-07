import 'package:cloud_functions/cloud_functions.dart';
import 'package:tensiongrid/domain/entities/events/event.dart';
import 'package:tensiongrid/domain/entities/size.dart';

class Grid {
  final String id;
  final DateTime createdAt;
  final Size size;
  final List<Event> events;
  final String? winnerId;
  final List<String> playerIds;
  final List<Result> results;

  const Grid({
    required this.id,
    required this.createdAt,
    required this.size,
    required this.events,
    required this.winnerId,
    required this.playerIds,
    required this.results,
  });
}
