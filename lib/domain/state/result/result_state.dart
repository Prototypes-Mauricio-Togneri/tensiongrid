import 'package:dafluta/dafluta.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/persistence/repository/grid_repository.dart';
import 'package:tensiongrid/utils/navigation.dart';

class ResultState extends BaseState {
  final Match match;

  ResultState(this.match);

  @override
  Future onLoad() async {
    final GridRepository repository = await GridRepository.instance();
    await repository.setResult(
      gridId: match.gridId,
      result: match.result,
    );
  }

  void onClose() => Navigation.pop();
}
