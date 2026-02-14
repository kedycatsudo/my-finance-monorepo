import { Test, TestingModule } from '@nestjs/testing';
import { IncomesSourcesService } from './incomes-sources.service';

describe('IncomesSourcesService', () => {
  let service: IncomesSourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncomesSourcesService],
    }).compile();

    service = module.get<IncomesSourcesService>(IncomesSourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
