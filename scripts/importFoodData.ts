import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importData() {
  const filePath = path.join(__dirname, '../data/food_data.csv');

  const results: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const row of results) {
        await prisma.food.create({
          data: {
            name: row.name,
            calories: parseFloat(row.calories),
            protein: parseFloat(row.protein),
            carbs: parseFloat(row.carbs),
            fat: parseFloat(row.fat),
          },
        });
      }
      console.log('Food data imported successfully!');
      await prisma.$disconnect();
    });
}

importData().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});