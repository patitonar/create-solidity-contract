# Create Solidity Contract

Start creating solidity smart contracts with the best tools by running one command.

## Creating a solidity project

To create a new solidity project, you may use the following commands:

#### Yarn

```sh
yarn create solidity-contract my-contract
```

#### npm

```sh
npm init solidity-contract my-contract
```

#### npx

```sh
npx create-solidity-contract my-contract
```

It will create a directory called `my-contract` inside the current folder.<br>

Inside that directory, it will generate the initial project structure, assuming you did not provide a custom [template](https://github.com/patitonar/create-solidity-contract#templates):

### Templates

Create Solidity Contract comes with templates with different tools. Peek into the [templates](/templates) folder to see what options are available and pass the name of the folder as the value for the `--template` argument.

As an example:

```sh
yarn create solidity-contract my-contract --with-template truffle
```

```sh
npx create-solidity-contract my-contract --template truffle
```
