export class Box {
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
    options: {
        random: boolean
    }
}