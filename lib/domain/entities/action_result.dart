class ActionResult {
  final bool success;
  final bool soundTap;
  final bool soundError;
  final bool removeTile;
  final bool eventCompleted;

  const ActionResult({
    this.success = false,
    this.soundTap = false,
    this.soundError = false,
    this.removeTile = false,
    this.eventCompleted = false,
  });
}
