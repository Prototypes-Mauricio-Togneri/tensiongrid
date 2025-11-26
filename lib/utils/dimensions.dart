import 'package:flame/components.dart';
import 'package:tensiongrid/app/constants.dart';

class Dimensions {
  static Vector2 cameraResolution(Vector2 canvasSize) => Vector2(
    Constants.UI_WIDTH.toDouble(),
    (canvasSize.y / canvasSize.x) * Constants.UI_WIDTH,
  );
}
