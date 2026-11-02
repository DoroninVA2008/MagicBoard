import { View, TouchableOpacity } from "react-native"
import { useState } from 'react';
// Icons
import FavoritesUnActive from "@/shared/images/favorites.svg"
import FavoritesActive from "@/shared/images/favorites-active.svg"

export const FavoritesIcon = () => {
    const [isFavorite, setFavorite] = useState(false)

    return (
        <TouchableOpacity onPress={() => setFavorite(!isFavorite) }>
            {isFavorite ? <FavoritesActive/> : <FavoritesUnActive/>}
        </TouchableOpacity>
    )
}