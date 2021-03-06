import {Client, Room} from 'colyseus';
import {authenticate, SocialColyseusApp} from '@social-colyseus/server';

export class PrivateRoom extends Room {
    protected app: SocialColyseusApp;

    onCreate(options: any): void | Promise<any> {
        if (!options.app) {
            return Promise.reject();
        }
        this.app = options.app;
        this.setPrivate(true).finally();
    }

    onAuth(client: Client, options: any): any {
        return authenticate(this.app, {token: options?.token});
    }
}
