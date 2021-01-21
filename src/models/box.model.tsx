import { ACLConfig, PlayingItem, QueueItem } from '@teamberry/muscadine';

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

    open: boolean

    private: boolean

    createdAt?: Date

    updatedAt?: Date

    options: {
        random: boolean,
        loop: boolean,
        berries: boolean,
        videoMaxDurationLimit: number
    }

    acl?: ACLConfig

    featured?: Date

    users?: number

    currentVideo?: QueueItem | PlayingItem
}

export default Box;
