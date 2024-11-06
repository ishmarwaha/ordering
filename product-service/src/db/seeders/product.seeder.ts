import { DataSource } from 'typeorm';
import { dataSourceOptions } from './../data-source';
import { ProductEntity } from '../entities/product.entity';

const dataSource = new DataSource(dataSourceOptions);
const userRepository = dataSource.getRepository(ProductEntity);

async function connect() {
  try {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await dataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source connect', err);
  }
}

async function disconnect() {
  try {
    await dataSource.destroy();

    console.log('Data Source disconnected!');
  } catch (err) {
    console.error('Error during Data Source disconnect', err);
  }
}

async function seed() {
  const ProductSeed = () => [
    {
      name: 'Product name 1',
      description: 'Product 1 some description',
      availableQuantity: 100,
      price: 1010.1,
    },
    {
      name: 'Product name 2',
      description: 'Product 2 some description',
      availableQuantity: 101,
      price: 1020.1,
    },
    {
      name: 'Product name 3',
      description: 'Product 3 some description',
      availableQuantity: 100,
      price: 1030.1,
    },
    {
      name: 'Product name 4',
      description: 'Product 4 some description',
      availableQuantity: 104,
      price: 1040.1,
    },
    {
      name: 'Product name 5',
      description: 'Product 5 some description',
      availableQuantity: 105,
      price: 1050.1,
    },
  ];

  await userRepository.save(ProductSeed());
  console.log('created seeds');
}

async function runSeed() {
  await connect();
  console.log('connected');
  await seed();
  console.log('seed done');
  await disconnect();
  console.log('disconnected');
}

runSeed();
