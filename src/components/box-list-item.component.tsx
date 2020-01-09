import React from "react"
import { Text } from "react-native"
import { Box } from "../models/box.model"

export class BoxListItem extends React.Component {
    private box: Box = {
        _id: '5cd357ds3fd',
        name: 'BOX WITH A NAME',
        creator: {
            _id: '4d6sf54dscdsf',
            name: 'AngelZatch'
        },
        description: null,
        lang: 'en',
        playlist: [],
        open: true,
        options: {
            random: false
        },
        createdAt: new Date('2020-01-05T17:34:16Z'),
        updatedAt: new Date('2020-01-05T17:34:16Z')
    }

    render() {
        return (
            <Text><p>{this.box.name}</p></Text>
        )
    }
}