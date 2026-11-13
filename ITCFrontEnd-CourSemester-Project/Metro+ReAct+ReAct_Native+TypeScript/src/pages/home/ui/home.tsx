import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Tale } from '@/views/tale/ui'
import { Footer } from '@/widgets/footer'
import { SearPut } from '@/views/searput'
import { COLORS } from '@/shared/constant'
import { useTale } from '@/pages/home/model'
import { BackgroundSun } from '@/views/background/Sun'
import { BackgroundMoon } from '@/views/background/Moon'
import { filterTales } from '@/shared/filput'
import { styles } from '@/pages/home/ui/styles'

export default () => {
  const { dataSheet, dataTale } = useTale()
  const navigation = useNavigation<any>()
  const dateLogin = new Date().getHours()

  const [query, setQuery] = useState('')

  const filtered = filterTales(dataTale, query)

  return (
    <View style={{
      flex: 1,
      backgroundColor:
        (dateLogin < 19 && dateLogin > 7)
          ? COLORS.HOME_BACKGROUND_SUN
          : COLORS.HOME_BACKGROUND_MOON
    }}>
      {(dateLogin < 19 && dateLogin > 7) ? <BackgroundSun /> : <BackgroundMoon />}

      <View style={{ marginTop: 40, marginBottom: 10 }}>
        <SearPut value={query} onChangeText={setQuery} />
      </View>

      <ScrollView>
        <View style={{ marginTop: 20, marginHorizontal: "6%" }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.text}>{`${dataSheet}`}</Text>
            <Text style={styles.text}>Все</Text>
          </View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ columnGap: 20 }}
            style={{ marginVertical: 10 }}
          >
            {filtered.map((item: any, index: number) => (
              <TouchableOpacity
                key={item.id ? String(item.id) : `${item.name}-${index}`}
                onPress={() => {
                  navigation.navigate("TaleScreen", {
                    id: item.id,
                    inDev: item.inDev,
                    imageUrl: item.imageUrl,
                    name: item.name,
                    author: item.author
                  })
                }}
              >
                <Tale inDev={item.inDev} imageUrl={item.imageUrl} name={item.name} author={item.author} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <Footer />
    </View>
  )
}