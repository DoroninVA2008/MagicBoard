import { StyleSheet } from 'react-native'
import { COLORS } from '@/shared/constant'

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: 'none',
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: "5%"
    },
    box: {
        width: "45%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.FOOTER_INACTIVE,
        height: 60,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        marginTop: 20
    },
    boxActive: {
        width: "45%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.FOOTER_ACTIVE,
        height: 80,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
    }
})