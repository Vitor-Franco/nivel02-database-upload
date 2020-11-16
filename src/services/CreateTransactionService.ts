import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  category: string;
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

class CreateTransactionService {
  public async execute({
    category,
    value,
    title,
    type,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);
    const { total } = await transactionsRepository.getBalance();

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('The type is invalid');
    }

    if (total < value && type === 'outcome') {
      throw new AppError('The balance is insufficient', 400);
    }

    const checkExistsCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    const categoryHandled = !checkExistsCategory
      ? categoriesRepository.create({ title: category })
      : checkExistsCategory;

    if (!checkExistsCategory) {
      await categoriesRepository.save(categoryHandled);
    }

    const transaction = transactionsRepository.create({
      value,
      category: categoryHandled,
      title,
      type,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
