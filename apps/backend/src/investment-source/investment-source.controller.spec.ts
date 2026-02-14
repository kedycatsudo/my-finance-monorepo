import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentSourceController } from './investment-source.controller';

describe('InvestmentSourceController', () => {
  let controller: InvestmentSourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestmentSourceController],
    }).compile();

    controller = module.get<InvestmentSourceController>(InvestmentSourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
