const mongoose = require('mongoose');
require('dotenv').config();

const Tag = require('./src/models/appModels/Tag');

async function removeDuplicateTags() {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.DATABASE || 'mongodb://localhost:27017/brava-sales';
    await mongoose.connect(mongoUri);
    console.log('✓ Conectado a MongoDB\n');

    // Encontrar duplicados agrupando por nombre y categoría (case-insensitive)
    const allTags = await Tag.find({});
    const tagMap = {};
    const tagsToDelete = [];

    for (const tag of allTags) {
      const key = `${tag.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}|${(tag.category || '').toLowerCase()}`;

      if (tagMap[key]) {
        // Ya existe un tag con este nombre y categoría
        const existing = tagMap[key];
        let tagToDelete;

        // Eliminar el que tiene createdAt (el nuevo creado por el script)
        if (tag.createdAt && !existing.createdAt) {
          // El nuevo es este, eliminar este
          tagToDelete = tag;
          console.log(
            `⊘ Eliminando duplicado NUEVO (ID: ${tag._id}): "${tag.name}" (${tag.category}) - tiene createdAt`
          );
        } else if (!tag.createdAt && existing.createdAt) {
          // El nuevo es el existente, eliminar el existente y actualizar el map
          tagToDelete = existing.tag;
          tagMap[key] = { tag, createdAt: tag.createdAt };
          console.log(
            `⊘ Eliminando duplicado NUEVO (ID: ${existing.tag._id}): "${existing.tag.name}" (${existing.tag.category}) - tiene createdAt`
          );
        } else {
          // Ambos tienen o no tienen createdAt, eliminar el más reciente
          const existingTime = existing.tag.updatedAt || existing.tag.createdAt || 0;
          const tagTime = tag.updatedAt || tag.createdAt || 0;

          if (tagTime > existingTime) {
            tagToDelete = tag;
            console.log(
              `⊘ Eliminando duplicado más reciente (ID: ${tag._id}): "${tag.name}" (${tag.category})`
            );
          } else {
            tagToDelete = existing.tag;
            tagMap[key] = { tag, createdAt: tag.createdAt };
            console.log(
              `⊘ Eliminando duplicado más reciente (ID: ${existing.tag._id}): "${existing.tag.name}" (${existing.tag.category})`
            );
          }
        }

        if (tagToDelete) {
          tagsToDelete.push(tagToDelete._id);
        }
      } else {
        // Primer tag con este nombre y categoría
        tagMap[key] = { tag, createdAt: tag.createdAt };
        console.log(
          `✓ Tag principal (ID: ${tag._id}): "${tag.name}" (${tag.category})`
        );
      }
    }

    console.log(`\n════════════════════════════════════════`);
    console.log(`Total tags únicos: ${Object.keys(tagMap).length}`);
    console.log(`Duplicados encontrados: ${tagsToDelete.length}`);
    console.log(`════════════════════════════════════════\n`);

    if (tagsToDelete.length > 0) {
      console.log('Eliminando duplicados...\n');
      const deleteResult = await Tag.deleteMany({
        _id: { $in: tagsToDelete },
      });

      console.log(
        `✓ ${deleteResult.deletedCount} tags duplicados eliminados\n`
      );
    }

    // Ahora eliminar tags que no estén en la lista oficial
    const officialTags = [
      'zapatos', 'botas', 'zapatillas', 'sandalias', 'mocasines',
      'cuero', 'gamuza', 'sintético', 'lona', 'tela', 'malla', 'plástico', 'caucho',
      'casual', 'deportivo', 'elegante', 'urbano', 'clásico', 'moderno',
      'negro', 'blanco', 'marrón', 'azul', 'plata', 'rojo', 'verde', 'gris', 'beige', 'camel', 'ceniza',
      'impermeable', 'transpirable', 'antideslizante',
      'hombre', 'mujer', 'unisex', 'niños',
      'sportech', 'lady', 'urban', 'kids',
    ];

    const tagsToRemove = [];
    const remainingTags = await Tag.find({});
    
    for (const tag of remainingTags) {
      const tagNameNormalized = tag.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (!officialTags.includes(tagNameNormalized)) {
        tagsToRemove.push(tag._id);
        console.log(
          `⊘ Tag no oficial encontrado (ID: ${tag._id}): "${tag.name}" (${tag.category})`
        );
      }
    }

    if (tagsToRemove.length > 0) {
      console.log('\nEliminando tags no oficiales...\n');
      const removeResult = await Tag.deleteMany({
        _id: { $in: tagsToRemove },
      });

      console.log(
        `✓ ${removeResult.deletedCount} tags no oficiales eliminados\n`
      );
    }

    await mongoose.connection.close();
    console.log('✓ Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error al ejecutar la eliminación de duplicados:', error.message);
    process.exit(1);
  }
}

removeDuplicateTags();
