const generateInitialAvatar = (name = "") => {
    const letter = name.trim()[0]?.toUpperCase() || "U"
    const color = stringToColor(name)

    return `data:image/svg+xml;utf8,
  <svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>
    <rect width='100%' height='100%' fill='${color}'/>
    <text
      x='50%'
      y='50%'
      text-anchor='middle'
      dominant-baseline='central'
      font-size='64'
      font-family='Arial, sans-serif'
      font-weight='600'
      fill='white'
    >${letter}</text>
  </svg>`
}

export default generateInitialAvatar

const stringToColor = (str = "") => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return `hsl(${hash % 360}, 65%, 45%)`
}
