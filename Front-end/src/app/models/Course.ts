export class Course {
    constructor(
        public id: number,
        public name: string,
        public category_id: number,
        public detail: string,
        public image: string,
        public url: string,
        public accordion: number,
        public current_price: number,
        public previous_price: number,
        public num_sales: number,
    ){}
}