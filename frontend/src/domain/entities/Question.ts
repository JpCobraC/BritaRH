export interface Question {
  id?: string;
  text: string;
  options: [string, string, string, string];
  correctIndex: number;
}
