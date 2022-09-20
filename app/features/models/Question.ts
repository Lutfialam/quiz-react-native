/**
 * Question class
 * @param id is a quiz id
 * @param questions is a question
 * @param firstChoice is a first choice of question
 * @param secondChoice is a second choice of question
 * @param thirdChoice is a third choice of question
 * @param fourthChoice is a fourth choice of question
 * @param answer is a answer of question
 * @param deleted is a flag if question is want to delete when update
 * @param created_at is a time when quiz is created
 * @param updated_at is a time when quiz is updated
 */
export default class Question {
  public id?: number;
  public question?: string;
  public firstChoice?: string;
  public secondChoice?: string;
  public thirdChoice?: string;
  public fourthChoice?: string;
  public answer?: string;
  public deleted?: boolean;
  public created_at?: Date | string;
  public updated_at?: Date | string;

  constructor(question?: Question) {
    this.id = question?.id;
    this.question = question?.question;
    this.firstChoice = question?.firstChoice;
    this.secondChoice = question?.secondChoice;
    this.thirdChoice = question?.thirdChoice;
    this.fourthChoice = question?.fourthChoice;
    this.answer = question?.answer;
    this.deleted = question?.deleted;
  }
}
