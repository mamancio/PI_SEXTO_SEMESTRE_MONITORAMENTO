import { ConfigService } from '@nestjs/config';
export declare class EncryptionService {
    private configService;
    private readonly algorithm;
    private readonly key;
    private readonly iv;
    constructor(configService: ConfigService);
    encrypt(text: string): string;
    decrypt(encryptedText: string): string;
}
