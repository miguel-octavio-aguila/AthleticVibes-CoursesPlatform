export class Sale {
  constructor(
    public id: number,
    public user_id: number,
    public course_id: number,
    public video: number,
    public progress: number
  ) {}
}