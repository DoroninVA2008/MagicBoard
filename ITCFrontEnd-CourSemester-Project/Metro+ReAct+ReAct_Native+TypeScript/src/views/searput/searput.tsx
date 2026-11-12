import React, { useRef, useState } from 'react'
import { View, TextInput, Image, TouchableWithoutFeedback } from 'react-native'
import { styles } from '@/views/searput/styles'
import { COLORS } from '@/shared/constant'
import Search from '@/shared/images/lupa.png'

interface SearPutProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearPut: React.FC<SearPutProps> = ({
  value,
  onChangeText,
  placeholder = 'поиск',
}) => {
  const inputRef = useRef<TextInput>(null)
  const [isFocused, setIsFocused] = useState(false)

  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
      <View style={[styles.container, isFocused && styles.containerFocused]}>
        <View pointerEvents="none" style={styles.iconContainer}>
          <Image source={Search} style={{ width: 16, height: 16 }} resizeMode="contain" />
        </View>

        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9A9A9A"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          underlineColorAndroid="transparent"
          selectionColor={COLORS.BORDER_COLOR ?? '#FF923E'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}