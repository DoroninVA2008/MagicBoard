const dateLogin = new Date().getHours()

export const COLORS = {
    TEXT: (dateLogin < 19 && dateLogin > 7) ? "#181818" : "#EFEFEF",
    BLACK_TEXT: "#181818",
    // WHITE_TEXT: "#FFFFFF",
    // HEADER_BACKGROUND: "#D9D9D9",
    // FOOTER_BACKGROUND: "#E9E9E9",
    // BUTTON_BACKGROUND: "#6e6e6e",
    HOME_BACKGROUND_SUN: "#89CCFF",
    HOME_BACKGROUND_MOON: "#171A62",
    AUTOR_TEXT: (dateLogin < 19 && dateLogin > 7) ? "#666666" : "#D9D9D9",
    FOOTER_ACTIVE: (dateLogin < 19 && dateLogin > 7) ? "#FFAA68" : "#FFB276",
    FOOTER_INACTIVE: (dateLogin < 19 && dateLogin > 7) ? "#FFC79C": "#FFDABD",
    BORDER_COLOR: "#FF923E",
    MANAGEMENR_BACKGROUND_BIG: (dateLogin < 19 && dateLogin > 7) ? "#FFC79C" : "#FFDABD",
    MANAGEMENR_BACKGROUND_SMALE: (dateLogin < 19 && dateLogin > 7) ? "#FFAA68" : "#FFB276",
    TALE_SCREEN_BACKGROUND: (dateLogin < 19 && dateLogin > 7) ? "#FFC79C" : "#FFB276",
    BACKGROUND_ACCENT: "#92FF8A",
    BUTTON_TEXT: "#1F641A",
    MANAGEMENT_AUTOR: "#424242"
}