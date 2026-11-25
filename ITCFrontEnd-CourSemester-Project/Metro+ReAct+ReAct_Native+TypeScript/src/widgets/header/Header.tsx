import React, { type FC } from 'react'
import { Text, View } from 'react-native'
import { COLORS } from '@/constant'
import { text } from '@/shared/styles/Text.styles'
import { styles } from '@/widgets/header/styles'

export const Header: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={text.dark}>
                    Индикатор подключения
                </Text>
            </View>
            <View style={styles.box}>
                <Text style={text.dark}>
                    Индикатор заряда
                </Text>
            </View>
        </View>
    );
};