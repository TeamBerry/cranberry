class Box {
    _id: string

    creator: {
        _id: string,
        name: string
    }

    description: string

    lang: string

    name: string

    playlist: Array<any>

    open: boolean

    createdAt: Date

    updatedAt: Date

    users: number

    options: {
        random: boolean,
        loop: boolean,
        berries: boolean
    }
}

export default Box;
