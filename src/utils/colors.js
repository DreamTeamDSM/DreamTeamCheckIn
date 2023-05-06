export const darken = (color, amount) => {
    let r = parseInt(color.substr(1, 2), 16);
    let g = parseInt(color.substr(3, 2), 16);
    let b = parseInt(color.substr(5, 2), 16);
    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);
    let hex =
      "#" +
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0");
    return hex;
  };

 export const stringToColor = (str) => {
    // Generate a hash value from the string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert the hash value to a hex color code
    let color = "#";
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }

    // Check if the color is too bright for white lettering
    let brightness = Math.round(
      (parseInt(color.substr(1, 2), 16) * 299 +
        parseInt(color.substr(3, 2), 16) * 587 +
        parseInt(color.substr(5, 2), 16) * 114) /
      1000
    );
    if (brightness > 125) {
      const difference = brightness - 125 + 5;
      // If the color is too bright, darken it
      return darken(color, difference);
    }

    return color;
  };