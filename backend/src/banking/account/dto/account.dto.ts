export class CreateAccountDto {
  userId: string;
  type?: string;
}

export class DepositDto {
  amount: number;
  description?: string;
}

export class WithdrawalDto {
  amount: number;
  description?: string;
}
