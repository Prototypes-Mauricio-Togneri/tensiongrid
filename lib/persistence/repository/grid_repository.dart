import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:tensiongrid/domain/entities/grid.dart';
import 'package:tensiongrid/domain/json/json_grid.dart';
import 'package:tensiongrid/extensions/document_snapshot_extension.dart';

class GridRepository {
  final String userId;

  const GridRepository(this.userId);

  static Future<List<Grid>> _grids() async {
    final Query query = FirebaseFirestore.instance.collection('grid');

    final QuerySnapshot snapshot = await query.get();
    final List<Grid> result = [];

    for (final QueryDocumentSnapshot document in snapshot.docs) {
      final JsonGrid jsonGrid = JsonGrid.fromJson(document.json);
      result.add(jsonGrid.object);
    }

    return result;
  }

  Future<Grid> search() async {
    final List<Grid> allGrids = await _grids();

    // Never played
    for (final Grid grid in allGrids) {
      if (!grid.playerIds.contains(userId)) {
        return grid;
      }
    }

    // Played but not winner
    for (final Grid grid in allGrids) {
      if ((grid.winnerId != null) && (grid.winnerId != userId)) {
        return grid;
      }
    }

    // Create new grid
    throw UnimplementedError('Grid creation not implemented yet');
  }
}
