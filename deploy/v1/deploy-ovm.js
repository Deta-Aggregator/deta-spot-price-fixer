const { getChainId } = require('hardhat');
const {
    idempotentDeploy,
} = require('../utils.js');

const WETH = '0x4200000000000000000000000000000000000006';
const NONE = '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF';

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running ovm deploy script');
    console.log('network id ', await getChainId());

    const { deployer } = await getNamedAccounts();

    const skipVerify = true;

    const multiWrapper = await idempotentDeploy(
        'MultiWrapper',
        [[]],
        deployments,
        deployer,
        'MultiWrapper',
        skipVerify,
    );

    const uniswapV3Oracle = await idempotentDeploy(
        'UniswapV3Oracle',
        [],
        deployments,
        deployer,
        'UniswapV3Oracle',
        skipVerify,
    );

    await idempotentDeploy(
        'OffchainOracle',
        [multiWrapper.address, [uniswapV3Oracle.address], ['0'], [NONE, WETH], WETH],
        deployments,
        deployer,
        'OffchainOracle',
        skipVerify,
    );
};

module.exports.skip = async () => true;
