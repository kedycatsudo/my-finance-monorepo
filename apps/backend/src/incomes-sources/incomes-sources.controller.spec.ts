import { Test, TestingModule } from '@nestjs/testing';
import { IncomesSourcesController } from './incomes-sources.controller';

describe('IncomesSourcesController', () => {
  let controller: IncomesSourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncomesSourcesController],
    }).compile();

    controller = module.get<IncomesSourcesController>(IncomesSourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
