export class Video {
    constructor(
        public id: number,
        public user_id: number,
        public course_id: number,
        public title: string,
        public content: string,
        public url: string,
        public file: string,
        public section: number,
        public accordion_title: string,
    ){}
}