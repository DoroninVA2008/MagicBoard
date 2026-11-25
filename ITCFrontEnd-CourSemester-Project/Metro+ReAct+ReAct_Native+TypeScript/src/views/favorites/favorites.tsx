import React, { type FC, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import FavoritesUnActive from '#/images/favorites.svg'
import FavoritesActive from '#/images/favorites-active.svg'

export const FavoritesIcon: React.FC = () => {
    const [isFavorite, setFavorite] = useState(false)

    return (
        <TouchableOpacity onPress={() => setFavorite(!isFavorite)}>
            {isFavorite ? <FavoritesActive/> : <FavoritesUnActive/>}
        </TouchableOpacity>
    )
}