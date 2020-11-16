import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import multer from 'multer';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';

import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);
const transactionsRouter = Router();

transactionsRouter.get('/', async (_, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const TransactionsAndCategoriesRelations = await transactionsRepository.find({
    relations: ['category'],
  });

  const balance = await transactionsRepository.getBalance();

  return response.json({
    transactions: TransactionsAndCategoriesRelations,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransactions = new CreateTransactionService();

  const transaction = await createTransactions.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();
  await deleteTransactionService.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();
    const handleFileCsv = await importTransactionsService.execute(
      request.file.path,
    );

    return response.json(handleFileCsv);
  },
);

export default transactionsRouter;
