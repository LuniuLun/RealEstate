package apidemo.models;

public class ToxicityResponse {
  public enum ToxicityLabel {
    TOXIC,
    NON_TOXIC
  }

  private boolean isToxicContent;
  private double toxicScore;
  private double nonToxicScore;
  private ToxicityLabel label;

  public ToxicityResponse() {
  }

  public ToxicityResponse(boolean isToxicContent, double toxicScore, double nonToxicScore, ToxicityLabel label) {
    this.isToxicContent = isToxicContent;
    this.toxicScore = toxicScore;
    this.nonToxicScore = nonToxicScore;
    this.label = label;
  }

  public boolean isToxicContent() {
    return isToxicContent;
  }

  public void setToxicContent(boolean isToxicContent) {
    this.isToxicContent = isToxicContent;
  }

  public double getToxicScore() {
    return toxicScore;
  }

  public void setToxicScore(double toxicScore) {
    this.toxicScore = toxicScore;
  }

  public double getNonToxicScore() {
    return nonToxicScore;
  }

  public void setNonToxicScore(double nonToxicScore) {
    this.nonToxicScore = nonToxicScore;
  }

  public ToxicityLabel getLabel() {
    return label;
  }

  public void setLabel(ToxicityLabel label) {
    this.label = label;
  }
}
