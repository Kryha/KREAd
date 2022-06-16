# Introduction

TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project.

# Getting Started

TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:

1. Installation process
2. Software dependencies
3. Latest releases
4. API references

# Build and Test

TODO: Describe and show how to build your code and run the tests.

# Contribute

TODO: Explain how other users and developers can contribute to make your code better.

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:

- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)

# To Run a local AG-Solo + Wallet + frontend

## Terminal 1 - agoric

1. `agoric start -v --reset`

## Terminal 2 - agoric

1. `agoric deploy contract/nft-maker-contract-deploy.js api/nft-maker-deploy-api.js`
2. `agoric open --repl`

## Terminal 3 - frontend

1. Remove `type: module` from `package.json`
2. yarn start
3. Remember to put back the `type: module` before commiting your changes
