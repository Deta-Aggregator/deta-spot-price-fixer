const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether } = require('@deta/solidity-utils');
const { tokens, deployContract } = require('./helpers.js');

const mooniswapFactory = '0xbAF9A5d4b0052359326A6CDAb54BABAa3a3A9643';

describe('MooniswapOracle', function () {
    async function initContracts () {
        const mooniswapOracle = await deployContract('MooniswapOracle', [mooniswapFactory]);
        return { mooniswapOracle };
    }

    it('eth -> dai', async function () {
        const { mooniswapOracle } = await loadFixture(initContracts);
        const rate = await mooniswapOracle.getRate(tokens.ETH, tokens.DAI, tokens.NONE);
        expect(rate.rate).to.gt(ether('1000'));
    });

    it('eth -> usdc -> deta', async function () {
        const { mooniswapOracle } = await loadFixture(initContracts);
        const rate = await mooniswapOracle.getRate(tokens.ETH, tokens['deta'], tokens.USDC);
        expect(rate.rate).to.gt(ether('200'));
    });
});
