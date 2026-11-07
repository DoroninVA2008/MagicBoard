import React, { useRef, useState } from 'react'
import { View, TextInput, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native'
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 480,
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'black',
    columnGap: 10,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  containerFocused: {
    borderColor: 'black',   // если не хочешь менять цвет — убери
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 36,
    fontSize: 14,
    color: 'black',
    padding: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    // @ts-ignore web-only
    outlineStyle: 'none',
    outlineWidth: 0,
    // @ts-ignore web-only
    outlineColor: 'transparent',
    underlineColorAndroid: 'transparent',
    shadowColor: 'transparent',
    elevation: 0,
  },
})