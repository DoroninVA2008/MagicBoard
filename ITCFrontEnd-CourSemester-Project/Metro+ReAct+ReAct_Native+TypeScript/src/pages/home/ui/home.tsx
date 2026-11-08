import { useNavigation } from "@react-navigation/native";
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Entities
import { Tale } from "@/entities/tale/ui";
// Widgets
import { Footer } from "@/widgets/footer";
// UI
import { SearPut } from '@/entities/searput/searput';
// Get data from API
import { COLORS } from "@/shared/constant";
import { useTale } from "../model";
// Backgrounds
import { BackgroundSun } from "@/entities/background/Sun";
import { BackgroundMoon } from "@/entities/background/Moon";
// Filter
import { filterTales } from '@/shared/filput'

export default () => {
  const { dataSheet, dataTale } = useTale()
  const navigation = useNavigation<any>()
  const dateLogin = new Date().getHours()

  // ← состояние поиска
  const [query, setQuery] = useState('')

  // ← фильтрация через filterTales
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
            <Text style={style.text}>{`${dataSheet}`}</Text>
            <Text style={style.text}>Все</Text>
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

const style = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: 600,
    color: COLORS.TEXT
  }
})