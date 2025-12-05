import 'package:dafluta/dafluta.dart';
import 'package:tensiongrid/domain/entities/match.dart';
import 'package:tensiongrid/utils/navigation.dart';

class ResultState extends BaseState {
  final Match match;

  ResultState(this.match);

  void onClose() => Navigation.pop();
}
