export class Question {
  public readonly id?: string;
  public readonly text: string;
  public readonly options: [string, string, string, string];
  public readonly correctIndex: number;

  constructor(data: {
    id?: string;
    text: string;
    options: [string, string, string, string];
    correctIndex: number;
  }) {
    this.id = data.id;
    this.text = data.text;
    this.options = data.options;
    this.correctIndex = data.correctIndex;

    this.validate();
  }

  private validate() {
    if (!this.text || this.text.trim() === "") {
      throw new Error("O enunciado da questão não pode ser vazio.");
    }
    if (!this.options || this.options.length !== 4) {
      throw new Error("Cada questão deve ter exatamente 4 alternativas.");
    }
    if (this.options.some(opt => !opt || opt.trim() === "")) {
      throw new Error("A alternativa não pode ser vazia.");
    }
    if (this.correctIndex < 0 || this.correctIndex > 3) {
      throw new Error("Índice da resposta correta inválido.");
    }
  }

  isCorrect(answerIndex: number | null): boolean {
    return answerIndex !== null && answerIndex === this.correctIndex;
  }
}

