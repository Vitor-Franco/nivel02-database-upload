import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionVerify = await transactionsRepository.findOne(id);

    if (!transactionVerify) {
      throw new AppError('The transactions does not exists', 400);
    }

    await transactionsRepository.remove(transactionVerify);
  }
}

export default DeleteTransactionService;
