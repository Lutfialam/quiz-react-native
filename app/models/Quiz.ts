import {CategoryType} from '@/types/category';
import {QuestionType} from '@/types/question';
import {addQuiz, getQuiz, getQuizById} from '@/services/quiz';
import {QuizType} from '@/types/quiz';

/**
 * Quiz class
 * @param id is a quiz id
 * @param name is a quiz name
 * @param time is a quiz time
 * @param delete is a flag for deleting quiz
 * @param description is a quiz description
 * @param category_id is a id of category for quiz (use this field when create quiz)
 * @param image is a quiz image
 * @param questions is a list question of quiz
 * @param categories is a categories for quiz
 * @param created_at is a time when quiz is created
 * @param updated_at is a time when quiz is updated
 */
class Quiz {
  public id?: number;
  public name?: string;
  public time?: number;
  public description?: string;
  public category_id?: number;
  public image?: File | string;
  public questions?: QuestionType[];
  public categories?: CategoryType;
  public created_at?: string;
  public updated_at?: string;

  constructor(quiz?: Quiz) {
    this.id = quiz?.id;
    this.name = quiz?.name;
    this.time = quiz?.time;
    this.image = quiz?.image;
    this.questions = quiz?.questions;
    this.categories = quiz?.categories;
    this.description = quiz?.description;
    this.category_id = quiz?.category_id;
    this.created_at = quiz?.created_at;
    this.updated_at = quiz?.updated_at;
  }

  public toFormData(quiz: QuizType) {
    const {name, time, description, image, questions} = quiz;

    const form = new FormData();
    form.append('name', name as string);
    form.append('time', (time as number).toString());
    form.append('questions', JSON.stringify(questions));
    form.append('category_id', (quiz.category_id ?? 0).toString());

    image && typeof image != 'string' && form.append('image', image);
    description && form.append('description', description);

    return form;
  }
}

export default Quiz;
