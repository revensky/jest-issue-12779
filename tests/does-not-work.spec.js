const { InvalidRequestException } = require('../src/exceptions/invalid-request.exception');
const { InvalidGrantException } = require('../src/exceptions/invalid-grant.exception');
const { exec, Executor } = require('../src/test');

const clients = [
  {
    id: 'client_id',
    scopes: ['foo', 'bar', 'baz'],
    grantTypes: ['authorization_code', 'refresh_token'],
    redirectUris: ['https://example.com/callback'],
  },
  {
    id: 'client2',
    scopes: ['foo', 'bar', 'baz'],
    grantTypes: ['password'],
    redirectUris: ['https://foobar.com/callback'],
  },
];

const authorizationCodes = [{ code: 'code', codeChallenge: 'code_challenge', codeChallengeMethod: 'plain' }];

const authorizationCodeServiceMock = {
  findAuthorizationCode: jest.fn().mockImplementation(async (code) => {
    return authorizationCodes.find((authorizationCode) => authorizationCode.code === code);
  }),
  revokeAuthorizationCode: jest.fn(),
};

const executor = new Executor(authorizationCodeServiceMock);

describe('Not Working Executor', () => {
  describe('createTokenResponse()', () => {
    const revokeSpy = jest.spyOn(authorizationCodeServiceMock, 'revokeAuthorizationCode');

    let parameters;

    beforeEach(() => {
      parameters = {
        grant_type: 'authorization_code',
        code: 'code',
        code_verifier: 'code_challenge',
        redirect_uri: 'https://example.com/callback',
      };
    });

    it('should test for the "codeChallengeMethod".', async () => {
      const oldCodeChallengeMethod = authorizationCodes[0].codeChallengeMethod;

      Reflect.set(authorizationCodes[0], 'codeChallengeMethod', 'S256');

      await expect(executor.createTokenResponse(parameters, clients[0])).rejects.toThrow(InvalidGrantException);

      expect(revokeSpy).toHaveBeenCalled();

      Reflect.set(authorizationCodes[0], 'codeChallengeMethod', oldCodeChallengeMethod);
    });

    it('should test for the "codeChallenge".', async () => {
      const oldCodeChallenge = authorizationCodes[0].codeChallenge;

      Reflect.set(authorizationCodes[0], 'codeChallenge', 'sjpqhDnA3eVRWJPnyQweMjO4YW5jRHDyDcSSi882Cbw');

      await expect(executor.createTokenResponse(parameters, clients[0])).rejects.toThrow(InvalidGrantException);

      expect(revokeSpy).toHaveBeenCalled();

      Reflect.set(authorizationCodes[0], 'codeChallenge', oldCodeChallenge);
    });
  });
});
