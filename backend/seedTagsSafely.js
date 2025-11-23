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

async function seedTagsSafely() {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.DATABASE || 'mongodb://localhost:27017/brava-sales';
    await mongoose.connect(mongoUri);
    console.log('✓ Conectado a MongoDB\n');

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const tagData of tagsToSeed) {
      const tagNameLower = tagData.name.toLowerCase();
      const categoryLower = tagData.category.toLowerCase();

      // Buscar por nombre Y categoría (case-insensitive)
      const existingTag = await Tag.findOne({
        name: { $regex: `^${tagNameLower}$`, $options: 'i' },
        category: { $regex: `^${categoryLower}$`, $options: 'i' },
      });

      if (existingTag) {
        // Si existe, verificar si necesita actualización
        let needsUpdate = false;

        if (existingTag.name !== tagNameLower) {
          existingTag.name = tagNameLower;
          needsUpdate = true;
        }

        if (existingTag.category !== categoryLower) {
          existingTag.category = categoryLower;
          needsUpdate = true;
        }

        if (needsUpdate) {
          await existingTag.save();
          console.log(
            `✓ Tag actualizado (ID: ${existingTag._id}): "${tagNameLower}" (${categoryLower})`
          );
          updatedCount += 1;
        } else {
          console.log(
            `⊘ Tag ya existe (ID: ${existingTag._id}): "${tagNameLower}" (${categoryLower})`
          );
          skippedCount += 1;
        }
      } else {
        // Crear nuevo tag
        const newTag = new Tag({
          name: tagNameLower,
          category: categoryLower,
          enabled: true,
          removed: false,
        });

        await newTag.save();
        console.log(
          `✓ Tag creado (ID: ${newTag._id}): "${tagNameLower}" (${categoryLower})`
        );
        createdCount += 1;
      }
    }

    console.log(`\n════════════════════════════════════════`);
    console.log(`Total tags procesados: ${tagsToSeed.length}`);
    console.log(`Tags creados: ${createdCount}`);
    console.log(`Tags actualizados: ${updatedCount}`);
    console.log(`Tags omitidos: ${skippedCount}`);
    console.log(`════════════════════════════════════════\n`);

    await mongoose.connection.close();
    console.log('✓ Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error al ejecutar el seed:', error.message);
    process.exit(1);
  }
}

seedTagsSafely();
