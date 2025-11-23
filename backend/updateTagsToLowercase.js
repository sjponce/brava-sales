const mongoose = require('mongoose');
require('dotenv').config();

const Tag = require('./src/models/appModels/Tag');

async function updateTagsToLowercase() {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.DATABASE || 'mongodb://localhost:27017/brava-sales';
    await mongoose.connect(mongoUri);
    console.log('✓ Conectado a MongoDB\n');

    // Obtener todos los tags
    const allTags = await Tag.find({});
    console.log(`Total de tags encontrados: ${allTags.length}\n`);

    let updatedCount = 0;

    for (const tag of allTags) {
      const nameLower = tag.name.toLowerCase();
      const categoryLower = tag.category ? tag.category.toLowerCase() : tag.category;

      // Si necesita actualización
      if (tag.name !== nameLower || tag.category !== categoryLower) {
        tag.name = nameLower;
        tag.category = categoryLower;
        await tag.save();

        console.log(
          `✓ Actualizado: "${tag.name}" - categoría: "${tag.category}"`
        );
        updatedCount += 1;
      } else {
        console.log(
          `⊘ Ya está en minúsculas: "${tag.name}" - categoría: "${tag.category}"`
        );
      }
    }

    console.log(`\n════════════════════════════════════════`);
    console.log(`Total tags procesados: ${allTags.length}`);
    console.log(`Tags actualizados: ${updatedCount}`);
    console.log(`════════════════════════════════════════\n`);

    await mongoose.connection.close();
    console.log('✓ Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error al ejecutar la actualización:', error.message);
    process.exit(1);
  }
}

updateTagsToLowercase();
