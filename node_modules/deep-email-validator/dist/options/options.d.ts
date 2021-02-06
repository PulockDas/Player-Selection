declare type Options = {
    sender: string;
    validateRegex: boolean;
    validateMx: boolean;
    validateTypo: boolean;
    validateDisposable: boolean;
    validateSMTP: boolean;
};
export declare type ValidatorOptions = Partial<Options> & {
    email: string;
};
declare type ValidatorOptionsFinal = Options & {
    email: string;
};
export declare function getOptions(emailOrOptions: string | ValidatorOptions): ValidatorOptionsFinal;
export {};
