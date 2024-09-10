const getColors = (color) => {
  const colors = {
    Negro: '#2D2926', // Pantone Black 6 C
    Blanco: '#F2F0EB', // Pantone 11-0601 TCX Bright White
    Rojo: '#EF3340', // Pantone 18-1664 TCX Fiery Red
    Azul: '#5B7F95', // Pantone 18-4029 TCX Blue Wing Teal
    Verde: '#00A78E', // Pantone 17-5734 TCX Arcadia
    Amarillo: '#F7EA48', // Pantone 13-0755 TCX Lemon Chrome
    Rosa: '#F49AC2', // Pantone 13-2804 TCX Pink Lavender
    Morado: '#9B5FC0', // Pantone 18-3838 TCX Ultra Violet
    Camel: '#D2B48C', // Pantone 16-1334 TCX Camel
    Marrón: '#8B4513', // Pantone 18-1140 TCX Carafe
    Gris: '#A0A0A0', // Pantone 17-5102 TCX Harbor Mist
    Turquesa: '#45B8AC', // Pantone 15-5519 TCX Turquoise
    Beige: '#F5F5DC', // Pantone 12-0605 TCX Birch
    Dorado: '#FFD700', // Pantone 13-0858 TCX Lemon Zest
    Plata: '#C0C0C0', // Pantone 14-5002 TCX Silver
  };
  return colors[color] || color;
};

export default getColors;
