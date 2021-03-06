import { ACLConfig } from '@teamberry/muscadine';

class User {
    _id: string;

    name: string;

    token: string;

    mail: string;

    settings: {
        theme: 'light' | 'dark',
        picture: string,
        color: string,
        isColorblind: boolean
        badge: string
    };

    acl: ACLConfig;

    badges: Array<{
        badge: string
        unlockedAt: Date
    }>;
}

export default User;
