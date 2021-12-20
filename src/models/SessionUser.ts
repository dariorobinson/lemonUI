
export default class SessionUser {
    id: string;
    username: string;
    discriminator: string;

    constructor(id: string, username: string, discriminator: string) {
        this.id = id;
        this.username = username;
        this.discriminator = discriminator;
    }
}