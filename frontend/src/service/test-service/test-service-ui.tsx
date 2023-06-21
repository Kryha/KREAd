/// <reference types="ses"/>
import { E } from "@endo/eventual-send";
import { useEffect } from "react";

import { useAgoricContext } from "../../context/agoric";
import { useCharacterMarketState } from "../../context/character-shop";
import { useUserState } from "../../context/user";
import { useWalletState } from "../../context/wallet";
import { useCreateCharacter } from "../character";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { useDataMode } from "../../hooks/use-data-mode";
import { routes } from "../../navigation";
import { KreadLogo } from "../../pages/onboarding/styles";
import StatusIndicator from "./service-status-indicator";
import { fontSize } from "../../design";


export const TestServiceUI = () => {
  const [service] = useAgoricContext();
  const { characters } = useUserState();
  const shop = useCharacterMarketState();
  const createCharacter = useCreateCharacter();
  const navigate = useNavigate();
  const { mockData} = useDataMode();

  console.log("---------------TESTUI", shop);
  const publicFacet = service.contracts.characterBuilder.publicFacet;

  useEffect(() => {
    console.log("SERVICE:", service);
    console.log("CHARACTERS: ", characters);
    console.log("Data Mode: ", mockData);
  }, [service, characters, mockData]);

  const mintCharacterNFT = async () => {
    await createCharacter.mutateAsync({
      // Random 5 letter string
      name: Array.from(
        { length: 5 },
        () =>
          Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, "")[0]
      ).join(""),
    });
  };

  const purses = useWalletState();

  const topUp = async () => {
    const invitation = await E(publicFacet).makeTokenFacetInvitation();
    const tokenPurse = purses.token;

    if (!tokenPurse) return;

    console.log(
      await E(service.agoric.walletP).addOffer(
        harden({
          id: Date.now().toString(),
          invitation: invitation,
          proposalTemplate: {
            want: {
              Token: {
                pursePetname: tokenPurse.pursePetname,
                value: 1000n,
              },
            },
            dappContext: true,
          },
        })
      )
    );
  };

  const removeItemFromInventory = async () => {
    const { items: equippedItems } = await E(service.contracts.characterBuilder.publicFacet).getCharacterInventory(characters[0].nft.name);

    const item = equippedItems[0];
    const character = characters[0];
    console.log(item);
    console.log(character);
    // await unequipItem(service, item, character.nft.name);
    console.log("done");
  };

  const test = async () => {
    const powers = await E(publicFacet).getCount();
    console.log(powers);
  };

  const getCharacterInventory = async () => {
    if (!characters[0].nft.name) {
      console.log("no characters owned");
      return;
    }
    console.log(await E(service.contracts.characterBuilder.publicFacet).getCharacterInventory(characters[0].nft.name));
  };

  const goHome = () => {
    navigate(routes.root);
  }

  const buttons = [
    { text: "MINT CHARACTER", onClick: mintCharacterNFT },
    { text: "TOP UP", onClick: topUp },
    { text: "REMOVE FROM INVENTORY", onClick: removeItemFromInventory },
    { text: "GET CHARACTER INVENTORY", onClick: async () => await getCharacterInventory},
    { text: "CHARACTERS", onClick: () => console.log("Characters:", characters) },
    { text: "TEST", onClick: test },
    // Add more buttons here
  ];

  return (
    <>
      <Container>
        <AppBar>
          <LogoContainer onClick={goHome}>
            <KreadLogo />
          </LogoContainer>
          <Title>🔧 Test Service UI </Title>
        </AppBar>
        <Main>
          <Section>
            <SectionTitle>Agoric Service Status:</SectionTitle>
            <StatusIndicator statusObject={service.status}/>
          </Section>
          <Section>
            <SectionTitle>Statistics:</SectionTitle>

          </Section>
          <Section>
            <SectionTitle>Controls:</SectionTitle>
            <SectionControls>
              <ButtonContainer>
                {buttons.map((button, index) => (
                  <Button key={index} onClick={button.onClick}>
                    <ButtonText>{button.text}</ButtonText>
                  </Button>
                ))}
              </ButtonContainer>
            </SectionControls>
          </Section>
          <Section>
            <SectionTitle>Results:</SectionTitle>

          </Section>
        </Main>
      </Container>
    </>
  );
};


const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0;
  position: relative;
  min-height: 100vh;
  height: 100%;
  isolation: isolate;
  background: hsl(216, 17%, 17%);
  color: #fff;
  `;

const Section = styled.div`
  position: relative;
  z-index: 2;
  `;
const SectionTitle = styled.div`
  display: flex;
  -moz-box-pack: justify;
  justify-content: space-between;
  -moz-box-align: center;
  align-items: center;
  margin-bottom: 4px;
  `;

const SectionControls = styled.div`
  display: flex;
  flex-direction: column;
  -moz-box-pack: center;
  justify-content: center;
  min-height: 1.625rem;
  `;

const AppBar = styled.header`
  --color-primary: hsl(53deg,100%,50%);
  display: flex;
  flex-direction: column;
  -moz-box-pack: justify;
  -moz-box-align: baseline;
  align-items: center;
  padding: 18px;
  border-bottom: 1px solid hsl(210deg, 15%, 20%);
 `;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  gap: 32px;
  padding: 16px;
  isolation: isolate;
  max-width: 800px;
  `;
const LogoContainer = styled.a`
  width: 100px;
  height: 24px;
  background: white;
  `;



const Title = styled.h1`
  position: relative;
  z-index: 2;
  font-size: ${fontSize.title};
  font-weight: 600;
  line-height: 1.2;
  color: initial;
  background-color: rgb(255, 255, 255);
  background-size: 100%;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 8px;
  margin-bottom: 0;
`;

const ButtonText = styled.span`
  margin-top: 8px;
`;


const Button = styled.button`
  display: flex;
  -moz-box-pack: center;
  justify-content: center;
  -moz-box-align: center;
  align-items: center;
  height: 4rem;
  border-style: solid;
  border-width: 3px;
  border-image: none 100% / 1 / 0 stretch;
  border-radius: 6px;
  border-color: hsl(210deg,15%,20%);;
  color: hsl(210deg,8%,50%);
  background: none;
  cursor: pointer;
  user-select: none;

  &:hover {
    border-color: hsl(210deg,15%,30%);
    color: hsl(210deg,8%,80%);
  }

  &:active {
    background: #76d397;
    color: #fff;
  }
  `;

const ButtonContainer = styled.ul`
  display: flex;
  gap: 16px;
  list-style-type: none;
  isolation: isolate;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
