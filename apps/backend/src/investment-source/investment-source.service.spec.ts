import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentSourceService } from './investment-source.service';

describe('InvestmentSourceService', () => {
  let service: InvestmentSourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestmentSourceService],
    }).compile();

    service = module.get<InvestmentSourceService>(InvestmentSourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
