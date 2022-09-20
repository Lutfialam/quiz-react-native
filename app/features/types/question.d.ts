export interface QuestionType {
  id?: number;
  index?: number;
  question: string;
  first_choice: string;
  second_choice: string;
  third_choice: string;
  fourth_choice: string;
  answer: string;
  errors?: {
    question?: string;
    first_choice?: string;
    second_choice?: string;
    third_choice?: string;
    fourth_choice?: string;
  };
}
