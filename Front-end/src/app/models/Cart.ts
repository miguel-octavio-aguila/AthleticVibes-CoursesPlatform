export class Cart {
    constructor (
        public id: number,
        public user_id: number,
        public course_id: number,
        public quantity: number,
    ) {}
}