export type QuizCategoryId = 'proverbs' | 'spelling' | 'knowledge' | 'childhood';
export type QuizQuestionType = 'multiple-choice' | 'fill-blank';
export type ReviewStatus = 'approved' | 'needs-review';

export type QuizQuestion = {
  id: string;
  categoryId: QuizCategoryId;
  type: QuizQuestionType;
  text: string;
  options?: string[];
  wordBank?: string[];
  answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium';
  source: string;
  reviewStatus: ReviewStatus;
};

export type PublicQuizQuestion = Omit<QuizQuestion, 'answer' | 'source' | 'reviewStatus'>;

export type QuizCategory = {
  id: QuizCategoryId;
  name: string;
  englishName: string;
  description: string;
  typeLabel: string;
};
