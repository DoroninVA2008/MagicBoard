import { Image, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native' // Shared
import { COLORS } from '@/constant' // Backgrounds
import { BackgroundSun } from '@/views/background/Sun'
import { BackgroundMoon } from '@/views/background/Moon' // Icons
import { FavoritesIcon } from '@/views/favorites'
import GoBackBlack from '#/images/goBack-black.svg'
import GoBackWhite from '#/images/goBack-white.svg'
import type { taleListProps } from '@/pages/screen-of-tale/ui'
import { styles } from '@/pages/screen-of-tale/ui/styles'

export const ScreenOfTale = ({ route }: taleListProps) => {
    const { id, inDev, imageUrl, name, author } = route.params
    const navigation: any = useNavigation()
    const dateLogin = new Date().getHours()

    return (
        <View style={{ flex: 1, 
            backgroundColor: 
                (dateLogin < 19 && dateLogin > 7) 
                    ? COLORS.HOME_BACKGROUND_SUN 
                    : COLORS.HOME_BACKGROUND_MOON }}>
        {(dateLogin < 19 && dateLogin > 7) ? <BackgroundSun/> : <BackgroundMoon/>}
            <View style={styles.topPanel}>
                <TouchableOpacity 
                    style={{width: "50%"}}
                    onPress={() => {navigation.goBack()}}
                >
                    {(dateLogin < 19 && dateLogin > 7) ? <GoBackBlack/> : <GoBackWhite/> }
                </TouchableOpacity>
                <FavoritesIcon/>
            </View>

            <View style={{alignItems: 'center', marginTop: 20}}>
                <Image
                    source={{uri: imageUrl}}
                    style={styles.image}
                />
                <Text style={{fontSize: 16, color: COLORS.TEXT, fontWeight: 500, marginTop: 17}}>{name}</Text>
                <Text style={{fontSize: 12, color: COLORS.AUTOR_TEXT, marginTop: 11}}>{author}</Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.long}>
                    30 минут
                </Text>
                <View style={{flex: 1, paddingHorizontal: "6%"}}>
                    <Text style={styles.about}>
                        О сказке
                    </Text>
                    <Text 
                        style={{fontSize: 16, color: COLORS.BLACK_TEXT}}
                        numberOfLines={7}>
                        В одной деревушке жила маленькая добрая девочка, которую очень любили её мама и бабушка. Ко дню рождения бабушка подарила ей красную шапочку, которая так понравилась девочке, что та повсюду в ней ходила и никогда не снимала. С тех пор все стали звать её Красной Шапочкой. 
                    </Text>
                    <TouchableOpacity style={{flex: 1}}>
                        <Text style={{color: "#666666", fontSize: 14}}>
                            Далее
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={
                    () => navigation.navigate("ManagementScreen", { 
                        id: id,
                        imageUrl: imageUrl,
                        name: name,
                        author: author })
                    }>
                    <Text style={{fontSize: 16, fontWeight: 700, color: COLORS.BUTTON_TEXT}}>Начать</Text>
                </TouchableOpacity>
            </View>
        </View>      
    )
}