const { InvalidGrantException } = require('./exceptions/invalid-grant.exception');
const { InvalidRequestException } = require('./exceptions/invalid-request.exception');

class Executor {
  authorizationCodeService;

  constructor(authorizationCodeService) {
    this.authorizationCodeService = authorizationCodeService;
  }

  async createTokenResponse(params, client) {
    let authorizationCode;

    try {
      authorizationCode = await this.authorizationCodeService.findAuthorizationCode(params.code);

      if (authorizationCode.codeChallengeMethod === 'S256') {
        throw new InvalidRequestException({ error_description: 'Unsupported PKCE Method "S256".' });
      }

      if (authorizationCode.codeChallenge !== params.code_verifier) {
        throw new InvalidGrantException({ error_description: 'Mismatching Code Challenge.' });
      }

      return { access_token: 'access_token', token_type: 'Bearer', expires_in: 3600, scope: 'foo bar' };
    } finally {
      if (authorizationCode !== undefined) {
        this.authorizationCodeService.revokeAuthorizationCode(authorizationCode);
      }
    }
  }
}

module.exports = { Executor };
