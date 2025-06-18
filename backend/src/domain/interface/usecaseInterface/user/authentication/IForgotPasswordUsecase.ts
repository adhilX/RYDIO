export interface IForgotPasswordUsecase {
    execute(email: string): Promise<void>;
}
