import { User } from '../user.entity';
import * as bcrypt from 'bcrypt';


describe('User entity', () => {
    let user: User;

    beforeEach(() => {
        user = new User();
        user.password = 'testPassword'
        user.salt = 'testSalt';
        bcrypt.hash = jest.fn();
    })

    describe('ValidatePassword',  () => {
        it('returns true as passsword is valid', async () => {
            bcrypt.hash.mockReturnValue('testPassword');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            
            const result = await user.validatePassword('testPassword');
            expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
            expect(result).toEqual(true);

        })

        it('returns false as passsword is invalid', async () => {
            bcrypt.hash.mockReturnValue('wrong');
            expect(bcrypt.hash).not.toHaveBeenCalled();
           
            const result = await user.validatePassword('wrong');
            expect(bcrypt.hash).toHaveBeenCalledWith('wrong', 'testSalt');
            expect(result).toEqual(false);
        })
    })
})