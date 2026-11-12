import React, { useState } from 'react'
import { Text, TouchableOpacity, View, Button } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { styles } from '@/widgets/footer/styles'
import Book from '@/shared/images/book.svg'
import Bluetooth from '@/shared/images/bluetooth.svg'

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
        <View style={styles.container}>
            <TouchableOpacity style={ route.name == "HomeScreen" ? styles.boxActive : styles.box } onPress={() => loadHome()}>
                <Book height={ route.name == "HomeScreen" ? "100%" : "50%" }/>
            </TouchableOpacity>
            <TouchableOpacity style={ route.name !== "HomeScreen" ? styles.boxActive : styles.box } onPress={() => loadManagement()}>
                <Bluetooth height={ route.name == "HomeScreen" ? "50%" : "100%" }/>
            </TouchableOpacity>
        </View>
    )
}