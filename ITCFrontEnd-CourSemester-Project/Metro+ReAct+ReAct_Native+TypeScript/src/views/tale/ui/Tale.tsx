import { Image, Text, View } from 'react-native'
import { COLORS } from '@/shared/constant'
import { style } from './styles'

interface ITaleListProps {
    inDev: string
    imageUrl: string
    name: string
    author: string
}

export const Tale = ( { inDev, imageUrl, name, author}: ITaleListProps ) => {
    return (
        <View style={style.container}>
            <Text
                style={{flex: 1, width: '100%', color: COLORS.TEXT}}>
                {inDev}
            </Text>
            <Image
                source={{ uri: imageUrl }}
                style={style.image}
            />
            <Text
                style={{flex: 1, width: '100%', color: COLORS.TEXT}}>
                {name}
            </Text>
            <Text
                style={{width: '100%', color: COLORS.AUTOR_TEXT}}>
                {author}
            </Text>
        </View>
    )
}