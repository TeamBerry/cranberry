import { ACLConfig, QueueItem } from '@teamberry/muscadine';

class Box {
    _id: string

    creator: {
        _id: string,
        name: string
        settings?: {
            picture: string
        }
    }

    description: string

    lang: string

    name: string

    playlist: Array<QueueItem>

    open: boolean

    private: boolean

    createdAt: Date

    updatedAt: Date

    users?: number

    options: {
        random: boolean,
        loop: boolean,
        berries: boolean,
        videoMaxDurationLimit: number
    }

    acl: ACLConfig

    featured: Date
}

export default Box;
