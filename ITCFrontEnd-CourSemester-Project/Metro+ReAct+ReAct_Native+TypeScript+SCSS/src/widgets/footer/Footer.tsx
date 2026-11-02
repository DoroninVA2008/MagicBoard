import { StyleSheet, Text, TouchableOpacity, View, Button } from "react-native"
import React, { useState } from 'react';
import { COLORS } from "@/shared/constant"

import { useNavigation, useRoute } from "@react-navigation/native"
import Book from "@/shared/images/book.svg"
import Bluetooth from "@/shared/images/bluetooth.svg"

export const Footer = () => {
    const navigation: any = useNavigation()
    const route: any = useRoute()

    const loadHome = () => {
        if (route.name !== "HomeScreen" && route.params !== undefined) {
            navigation.goBack(), navigation.goBack()
        } else if (route.name !== "HomeScreen" && route.params == undefined) {
            navigation.goBack()
        }
    }
    
    const loadManagement = () => {
        route.name == "ManagementScreen" ? null : navigation.navigate("ManagementScreen")
    }

    return (
        <View style={style.container}>
            <TouchableOpacity style={ route.name == "HomeScreen" ? style.boxActive : style.box } onPress={() => loadHome()}>
                <Book height={ route.name == "HomeScreen" ? "100%" : "50%" }/>
            </TouchableOpacity>
            <TouchableOpacity style={ route.name !== "HomeScreen" ? style.boxActive : style.box } onPress={() => loadManagement()}>
                <Bluetooth height={ route.name == "HomeScreen" ? "50%" : "100%" }/>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
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