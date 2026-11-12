import { Text, View } from 'react-native'
import { COLORS } from '@/shared/constant'
import { text } from '@/shared/styles/Text.styles'
import { style } from '@/widgets/header/styles'

export const Header = () => {
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={text.dark}>Индикатор подключения</Text>
            </View>
            <View style={styles.box}>
                <Text style={text.dark}>Индикатор заряда</Text>
            </View>
        </View>
    );
};