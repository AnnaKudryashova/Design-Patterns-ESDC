export class CustomException extends Error {
    constructor(message: string, public cause?: Error) {
      super(message);
      this.name = 'CustomException';
    }
  }