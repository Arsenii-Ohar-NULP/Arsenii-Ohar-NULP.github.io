export default class InvalidCredentials extends Error{
    constructor(message: string){
        super(message);
        this.name = InvalidCredentials.name;
    }
}