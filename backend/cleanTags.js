const mongoose = require('mongoose');
require('dotenv').config();

const Tag = require('./src/models/appModels/Tag');

async function cleanTags() {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.DATABASE || 'mongodb://localhost:27017/brava-sales';
    await mongoose.connect(mongoUri);
    console.log('✓ Conectado a MongoDB');

    // Buscar tags sin categoría (category es null, undefined o no existe)
    const tagsWithoutCategory = await Tag.find({
      $or: [
        { category: null },
        { category: undefined },
        { category: { $exists: false } },
      ],
    });

    console.log(`\nTags encontrados sin categoría: ${tagsWithoutCategory.length}`);

    if (tagsWithoutCategory.length > 0) {
      console.log('\nTags a eliminar:');
      tagsWithoutCategory.forEach((tag) => {
        console.log(`  - ${tag._id}: "${tag.name}"`);
      });

      // Eliminar los tags
      const deleteResult = await Tag.deleteMany({
        $or: [
          { category: null },
          { category: undefined },
          { category: { $exists: false } },
        ],
      });

      console.log(
        `\n✓ ${deleteResult.deletedCount} tags eliminados correctamente`
      );
    } else {
      console.log('✓ No hay tags sin categoría para eliminar');
    }

    await mongoose.connection.close();
    console.log('✓ Conexión cerrada\n');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error al ejecutar la limpieza:', error.message);
    process.exit(1);
  }
}

cleanTags();
