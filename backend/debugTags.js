const mongoose = require('mongoose');
require('dotenv').config();

const Tag = require('./src/models/appModels/Tag');

async function debugTags() {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.DATABASE || 'mongodb://localhost:27017/brava-sales';
    await mongoose.connect(mongoUri);
    console.log('✓ Conectado a MongoDB\n');

    // Obtener TODOS los tags sin filtro
    const allTags = await Tag.find({});
    console.log(`Total de tags en BD: ${allTags.length}\n`);

    // Agrupar por categoría
    const byCategory = {};
    allTags.forEach((tag) => {
      if (!byCategory[tag.category]) {
        byCategory[tag.category] = [];
      }
      byCategory[tag.category].push({
        _id: tag._id,
        name: tag.name,
        enabled: tag.enabled,
        removed: tag.removed,
      });
    });

    console.log('Tags por categoría:\n');
    Object.keys(byCategory).sort().forEach((category) => {
      console.log(`\n📁 ${category.toUpperCase()} (${byCategory[category].length} tags)`);
      byCategory[category].forEach((tag) => {
        console.log(
          `   - ${tag.name} (enabled: ${tag.enabled}, removed: ${tag.removed})`
        );
      });
    });

    console.log(`\n════════════════════════════════════════`);
    console.log(`Total: ${allTags.length} tags`);
    console.log(`════════════════════════════════════════\n`);

    await mongoose.connection.close();
    console.log('✓ Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

debugTags();
