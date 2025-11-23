const mongoose = require('mongoose');
require('dotenv').config();

const Tag = require('./src/models/appModels/Tag');

const tagsToSeed = [
  { name: 'Zapatos', category: 'TIPO' },
  { name: 'Botas', category: 'TIPO' },
  { name: 'Zapatillas', category: 'TIPO' },
  { name: 'Sandalias', category: 'TIPO' },
  { name: 'Mocasines', category: 'TIPO' },
  { name: 'Cuero', category: 'MATERIAL' },
  { name: 'Gamuza', category: 'MATERIAL' },
  { name: 'Sintético', category: 'MATERIAL' },
  { name: 'Lona', category: 'MATERIAL' },
  { name: 'Tela', category: 'MATERIAL' },
  { name: 'Malla', category: 'MATERIAL' },
  { name: 'Plástico', category: 'MATERIAL' },
  { name: 'Caucho', category: 'MATERIAL' },
  { name: 'Casual', category: 'ESTILO' },
  { name: 'Deportivo', category: 'ESTILO' },
  { name: 'Elegante', category: 'ESTILO' },
  { name: 'Urbano', category: 'ESTILO' },
  { name: 'Clásico', category: 'ESTILO' },
  { name: 'Moderno', category: 'ESTILO' },
  { name: 'Negro', category: 'COLOR' },
  { name: 'Blanco', category: 'COLOR' },
  { name: 'Marrón', category: 'COLOR' },
  { name: 'Azul', category: 'COLOR' },
  { name: 'Plata', category: 'COLOR' },
  { name: 'Rojo', category: 'COLOR' },
  { name: 'Verde', category: 'COLOR' },
  { name: 'Gris', category: 'COLOR' },
  { name: 'Beige', category: 'COLOR' },
  { name: 'Camel', category: 'COLOR' },
  { name: 'Ceniza', category: 'COLOR' },
  { name: 'Impermeable', category: 'CARACTERISTICAS' },
  { name: 'Transpirable', category: 'CARACTERISTICAS' },
  { name: 'Antideslizante', category: 'CARACTERISTICAS' },
  { name: 'Hombre', category: 'GENERO' },
  { name: 'Mujer', category: 'GENERO' },
  { name: 'Unisex', category: 'GENERO' },
  { name: 'Niños', category: 'GENERO' },
  { name: 'Sportech', category: 'LINEA' },
  { name: 'Lady', category: 'LINEA' },
  { name: 'Casual', category: 'LINEA' },
  { name: 'Urban', category: 'LINEA' },
  { name: 'Kids', category: 'LINEA' },
];

async function seedTags() {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.DATABASE || 'mongodb://localhost:27017/brava-sales';
    await mongoose.connect(mongoUri);
    console.log('✓ Conectado a MongoDB');

    let createdCount = 0;
    let skippedCount = 0;

    for (const tagData of tagsToSeed) {
      const tagNameLower = tagData.name.toLowerCase();
      const categoryLower = tagData.category.toLowerCase();

      // Verificar si el tag existe (búsqueda case-insensitive)
      const existingTag = await Tag.findOne({
        name: { $regex: `^${tagNameLower}$`, $options: 'i' },
      });

      if (existingTag) {
        console.log(`⊘ Tag ya existe: "${tagData.name}" (${categoryLower})`);
        skippedCount += 1;
      } else {
        // Crear el nuevo tag con nombre y categoría en minúsculas
        const newTag = new Tag({
          name: tagNameLower,
          category: categoryLower,
          enabled: true,
          removed: false,
        });

        await newTag.save();
        console.log(`✓ Tag creado: "${tagData.name}" (${categoryLower})`);
        createdCount += 1;
      }
    }

    console.log(`\n════════════════════════════════════════`);
    console.log(`Total tags procesados: ${tagsToSeed.length}`);
    console.log(`Tags creados: ${createdCount}`);
    console.log(`Tags omitidos (ya existentes): ${skippedCount}`);
    console.log(`════════════════════════════════════════\n`);

    await mongoose.connection.close();
    console.log('✓ Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error al ejecutar el seed:', error.message);
    process.exit(1);
  }
}

seedTags();
