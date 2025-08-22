export interface ISecurityDepositRepository {
    getSecurityDeposit(): Promise<number>
}