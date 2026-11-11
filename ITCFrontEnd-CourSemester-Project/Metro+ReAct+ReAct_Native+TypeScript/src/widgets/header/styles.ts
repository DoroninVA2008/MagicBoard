import { StyleSheet } from 'react-native'
import { COLORS } from '@/shared/constant'

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        height: 50,
        marginTop: 25,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: COLORS.HEADER_BACKGROUND,
        justifyContent: "center",
        alignItems: "center",
    },
    box: {
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
    }
})