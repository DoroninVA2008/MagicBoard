import { useNavigation } from "@react-navigation/native";
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Entities
import { Tale } from "@/entities/tale/ui";
// Widgets
import { Footer } from "@/widgets/footer";
// Get data from API
import { COLORS } from "@/shared/constant";
import { useTale } from "../model";
// Backgrounds
import { BackgroundSun } from "@/entities/background/Sun";
import { BackgroundMoon } from "@/entities/background/Moon";
// Заглушка
import Search from "@/shared/images/search.svg"

export default () => {
  const { dataSheet, dataTale } = useTale()
  const navigation = useNavigation<any>()
  const dateLogin = new Date().getHours()

  return (
    <View style={{ flex: 1, 
      backgroundColor: 
        (dateLogin < 19 && dateLogin > 7)
          ? COLORS.HOME_BACKGROUND_SUN 
          : COLORS.HOME_BACKGROUND_MOON }}>
      {(dateLogin < 19 && dateLogin > 7) ? <BackgroundSun/> : <BackgroundMoon/>}
      <TouchableOpacity style={{marginHorizontal: 'auto', paddingTop: 40}}>
        <Search/>
      </TouchableOpacity>
      <ScrollView>
        <View style={{ marginTop: 30, marginHorizontal: "6%" }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={style.text}>{`${dataSheet}`}</Text>
            <Text style={style.text}>Все</Text>
          </View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ columnGap: 20, }}
            style={{marginVertical: 10}}
          >
            {dataTale.map((item) => (
              <TouchableOpacity onPress={() => {
                navigation.navigate("TaleScreen", {
                  imageUrl: item.imageUrl,
                  name: item.name,
                  author: item.author
                })
              } }>
                <Tale imageUrl={item.imageUrl} name={item.name} author={item.author} />
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