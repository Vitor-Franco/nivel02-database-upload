import csvParse from 'csv-parse';
import fs from 'fs';
import { getCustomRepository, getRepository, In } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  public async execute(filePath: string): Promise<Transaction[]> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const arrayTransactions: CSVTransaction[] = [];
    const categories: string[] = [];

    const contactsReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      from_line: 2,
      delimiter: ',',
    });

    const parseCSV = contactsReadStream.pipe(parsers);

    parseCSV.on('data', async csvLine => {
      const [title, type, value, category] = csvLine.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      arrayTransactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitles = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({ title })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    const createdTransactions = transactionsRepository.create(
      arrayTransactions.map(({ title, value, type, category }) => ({
        title,
        type,
        value,
        category: finalCategories.find(
          categoryFinal => categoryFinal.title === category,
        ),
      })),
    );

    await transactionsRepository.save(createdTransactions);
    await fs.promises.unlink(filePath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
