import { Test } from "@nestjs/testing";
import { UserRepository } from '../user.repository';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { User } from '../user.entity';
import * as bcrypt from 'bcrypt';

const mockCredentialsDto = {
    username: 'TestUsername',
    password: 'TestPassword'
};

describe('UserRepository', () => {
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UserRepository]
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('signUp', () => {

        beforeEach(() => {
            userRepository.create = jest.fn().mockResolvedValue({
                ...mockCredentialsDto
            });
        })

        it('successfully signs up the user', async () => {
            userRepository.save = jest.fn().mockResolvedValue(undefined);

            await userRepository.signUp(mockCredentialsDto)


            expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
            expect(userRepository.save).toHaveBeenCalledWith(mockCredentialsDto);
        })

        it('throws a conflic exception as username already exists', async () => {
            userRepository.save = jest.fn().mockRejectedValue({ code: '23505' });

            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);

        })

        it('throws a conflic exception as username already exists', async () => {
            userRepository.save = jest.fn().mockRejectedValue({ code: '3131231' }); //unhadle error code

            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);

        })
    })

    describe('validate user password', () => {
        let user

        beforeEach(() => {
            user = new User();
            user.username = 'TestUsername';
            user.validatePassword = jest.fn();
        })


        it('returns the username as validation is successful', async () => {
            userRepository.findOne = jest.fn().mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);

            const result = await userRepository.validateUserPassword(mockCredentialsDto);
            expect(result).toEqual(user)
        });

        it('returns null as user cannot be found',async () => {
            userRepository.findOne = jest.fn().mockResolvedValue(null);

            const result = await userRepository.validateUserPassword(mockCredentialsDto);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toEqual(null);
        });

        it('returns null as as password is invalid', async() => {
            userRepository.findOne = jest.fn().mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(false);

            const result = await userRepository.validateUserPassword(mockCredentialsDto);
            expect(user.validatePassword).toHaveBeenCalled();
            expect(result).toBeNull();
        });

    })

    describe('hashPassword', () => {
        it('calls bcrypt.has to generate a hash', async() => {
            bcrypt.hash = jest.fn().mockResolvedValue('testHash');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await userRepository.hashPassword('testPassword', 'testSalt');
            expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
            expect(result).toEqual('testHash');
        })
    })
})