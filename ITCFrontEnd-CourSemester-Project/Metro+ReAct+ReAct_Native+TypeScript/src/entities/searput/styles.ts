import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 'clamp(128px, 50vw, 640px)',
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