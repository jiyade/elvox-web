// Check if running inside React Native WebView
export const isReactNativeApp = () => {
    return (
        typeof window !== "undefined" &&
        typeof window.ReactNativeWebView !== "undefined"
    )
}

export const notifyMobileLogin = (userId) => {
    if (!userId) {
        return
    }

    if (isReactNativeApp()) {
        const message = JSON.stringify({
            type: "USER_LOGGED_IN",
            userId: userId
        })

        window.ReactNativeWebView.postMessage(message)
    }
}

export const notifyMobileLogout = () => {
    if (isReactNativeApp()) {
        const message = JSON.stringify({
            type: "USER_LOGGED_OUT"
        })

        window.ReactNativeWebView.postMessage(message)
    }
}

export const notifyMobileIfLoggedIn = (userId) => {
    if (userId && isReactNativeApp()) {
        notifyMobileLogin(userId)
    }
}
