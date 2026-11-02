import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
// Shared
import { COLORS } from "@/shared/constant"
// Backgrounds
import { BackgroundSun } from "@/entities/background/Sun";
import { BackgroundMoon } from "@/entities/background/Moon";
//Icons
import { FavoritesIcon } from "@/entities/favorites";
import GoBackBlack from "@/shared/images/goBack-black.svg"
import GoBackWhite from "@/shared/images/goBack-white.svg"

interface taleListProps {
  route: {
    params: {
        imageUrl: string, 
        name: string, 
        author: string,    
    }
  }
}

export const ScreenOfTale = ({ route }: taleListProps) => {
    const {imageUrl, name, author} = route.params
    const navigation: any = useNavigation()
    const dateLogin = new Date().getHours()

    // storage.set( 'imageUrl', imageUrl )
    // storage.set( 'name', name )
    // storage.set( 'author', author )

    return (
        <View style={{ flex: 1, 
            backgroundColor: 
                (dateLogin < 19 && dateLogin > 7) 
                    ? COLORS.HOME_BACKGROUND_SUN 
                    : COLORS.HOME_BACKGROUND_MOON }}>
        {(dateLogin < 19 && dateLogin > 7) ? <BackgroundSun/> : <BackgroundMoon/>}
            <View style={style.topPanel}>
                <TouchableOpacity 
                    style={{width: "50%"}}
                    onPress={() => {navigation.goBack()}}
                >
                    {(dateLogin < 19 && dateLogin > 7) ? <GoBackBlack/> : <GoBackWhite/> }
                </TouchableOpacity>
                {/* <View style={{flexDirection: "row", gap: 20}}> */}
                    {/* <TouchableOpacity onPress={() => {}}>
                        <Text style={{fontSize: 34}}>...</Text>
                    </TouchableOpacity> */}
                <FavoritesIcon/>
                {/* </View> */}
            </View>

            <View style={{alignItems: 'center', marginTop: 20}}>
                <Image
                    source={{uri: imageUrl}}
                    style={style.image}
                />
                <Text style={{fontSize: 16, color: COLORS.TEXT, fontWeight: 500, marginTop: 17}}>{name}</Text>
                <Text style={{fontSize: 12, color: COLORS.AUTOR_TEXT, marginTop: 11}}>{author}</Text>
            </View>
            <View style={style.box}>
                <Text style={style.long}>
                    30 минут
                </Text>
                <View style={{flex: 1, paddingHorizontal: "6%"}}>
                    <Text style={style.about}>
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
                <TouchableOpacity style={style.button} onPress={
                    () => navigation.navigate("ManagementScreen", { 
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

const style = StyleSheet.create({
    image: {
        width: 277,
        height: 335,
        borderRadius: 5,
    },
    button: {
        width: "70%",
        alignSelf: "center",
        backgroundColor: COLORS.BACKGROUND_ACCENT,
        alignItems: "center",
        paddingBottom: 20,
        paddingTop: 14,
        borderRadius: 8,
        marginBottom: 50,
    },
    box: {
        flex: 1,
        backgroundColor: COLORS.TALE_SCREEN_BACKGROUND,
        borderColor: COLORS.BORDER_COLOR,
        borderWidth: 5,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        marginTop: 45,
    },
    long: {
        backgroundColor: COLORS.BACKGROUND_ACCENT,
        fontSize: 16,
        fontWeight: 700,
        width: 125,
        height: 35,
        color: COLORS.BLACK_TEXT,
        borderRadius: 30,
        textAlign: "center",
        alignSelf: "center",
        lineHeight: 35,
        top: -17,
    },
    about: {
        fontSize: 18,
        fontWeight: 700,
        marginBottom: 3,
        color: COLORS.BLACK_TEXT,
    },
    topPanel: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 80,
        marginTop: 50,
    }
})