import { StyleSheet } from 'react-native'
import { COLORS } from '@/shared/constant'

export const style = StyleSheet.create({
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