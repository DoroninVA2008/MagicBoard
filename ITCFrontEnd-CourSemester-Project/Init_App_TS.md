Ниже приведена полная последовательность операций, которую можно выполнить непосредственно в терминале.
Шаг первый: создание базового проекта (включая Metro + TypeScript)
bash

npx @react-native-community/cli@latest init MagicBoard
cd MagicBoard

    Новые проекты React Native по умолчанию используют TypeScript, отдельный параметр --template не требуется.

Шаг второй: добавление поддержки SCSS

Установка зависимостей:
bash

npm install --save-dev react-native-sass-transformer sass

Изменение metro.config.js (для React Native v0.72.1+):
js

const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const { sourceExts } = defaultConfig.resolver;

const config = {
  transformer: {
    babelTransformerPath: require.resolve("react-native-sass-transformer"),
  },
  resolver: {
    sourceExts: [...sourceExts, "scss", "sass"],
  },
};

module.exports = mergeConfig(defaultConfig, config);

Шаг третий: выбор и установка UI-библиотеки

В качестве примера рассмотрим React Native Paper (самая популярная UI-библиотека Material Design):
bash

npm install react-native-paper react-native-safe-area-context
npm install @react-native-vector-icons/material-design-icons
npx pod-install   # macOS/iOS требуется

    Версия v5 требует установки react-native-safe-area-context и библиотеки иконок. Если не хотите устанавливать библиотеку иконок, можно настроить babel-plugin-optional-require для её пропуска.

Оберните корневой компонент в PaperProvider.
Шаг четвёртый (опционально): установка тестовой библиотеки

Вы ранее говорили, что тесты пока не нужны, поэтому этот шаг можно пропустить. Если понадобится позже:
bash

npm install --save-dev @testing-library/react-native

Итоговая структура стека
Компонент	Источник	Требуется ручная настройка
Metro	Автоматически при создании CLI	Нет
TypeScript	Автоматически при создании CLI (по умолчанию)	Нет
React Native	Автоматически при создании CLI	Нет
SCSS	react-native-sass-transformer	Да (изменение metro.config.js)
UI-библиотека	Выбрать и установить вручную (например, Paper)	Да (обернуть Provider)

Таким образом, «одной командой» можно сделать только первые три пункта, остальные два придётся настроить вручную.