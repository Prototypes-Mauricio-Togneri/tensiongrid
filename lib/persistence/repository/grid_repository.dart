import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:tensiongrid/app/constants.dart';
import 'package:tensiongrid/domain/entities/grid.dart';
import 'package:tensiongrid/domain/json/json_grid.dart';
import 'package:tensiongrid/domain/json/json_player.dart';
import 'package:tensiongrid/domain/json/json_result.dart';
import 'package:tensiongrid/domain/json/json_size.dart';
import 'package:tensiongrid/extensions/document_snapshot_extension.dart';
import 'package:tensiongrid/persistence/storage/settings_storage.dart';
import 'package:tensiongrid/utils/authentication.dart';
import 'package:uuid/uuid.dart';

class GridRepository {
  final String userId;
  final String userName;

  const GridRepository._({
    required this.userId,
    required this.userName,
  });

  static Future<GridRepository> instance() async {
    final String name = await SettingsStorage.loadName();

    return GridRepository._(
      userId: Authentication.userId,
      userName: name,
    );
  }

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

    final DocumentReference docRef = FirebaseFirestore.instance
        .collection('grid')
        .doc();

    final JsonGrid jsonGrid = JsonGrid(
      id: docRef.id,
      createdAt: DateTime.now(),
      size: const JsonSize(width: 5, height: 5),
      events: [],
      winnerId: null,
      playerIds: [userId],
      results: [
        JsonResult(
          id: const Uuid().v4(),
          createdAt: DateTime.now(),
          player1: const JsonPlayer(
            id: Constants.BOT_ID,
            index: 1,
            name: Constants.BOT_NAME,
            score: Constants.BOT_SCORE,
          ),
          player2: JsonPlayer(
            id: userId,
            index: 2,
            name: userName,
            score: 0,
          ),
        ),
      ],
    );

    await docRef.set(jsonGrid.toJson());

    return jsonGrid.object;
  }
}
