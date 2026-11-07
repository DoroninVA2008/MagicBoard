import { COLORS } from "@/shared/constant";
import { text } from "@/shared/styles/Text.styles";
import { StyleSheet, Text, View } from "react-native";

export const Header = () => {
    return (
        <View style={style.container}>
            <View style={style.box}>
                <Text style={text.dark}>Индикатор подключения</Text>
            </View>
            <View style={style.box}>
                <Text style={text.dark}>Индикатор заряда</Text>
            </View>
        </View>
    );
};

const style = StyleSheet.create({
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