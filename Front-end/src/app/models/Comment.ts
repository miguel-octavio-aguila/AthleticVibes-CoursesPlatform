export class Comment{
    constructor(
        public id: number,
        public user_id: number,
        public video_id: number,
        public title: string,
        public comment: string,
        public image: string,
    ){}
}