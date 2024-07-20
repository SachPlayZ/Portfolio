import React from "react";
import { DiFirebase, DiReact, DiZend } from "react-icons/di";
import {
  Section,
  SectionDivider,
  SectionText,
  SectionTitle,
} from "../../styles/GlobalComponents";
import {
  List,
  ListContainer,
  ListItem,
  ListParagraph,
  ListTitle,
} from "./TechnologiesStyles";

const Technologies = () => (
  <Section id="tech">
    <SectionDivider divider />
    <SectionTitle>Technologies</SectionTitle>
    <SectionText>
      I've worked with a range a technologies in the web development world. From
      Back-end To Design
    </SectionText>
    <List>
      <ListItem>
        <picture>
          <DiReact size="3rem" />
        </picture>
        <ListContainer>
          <ListTitle>Front-End</ListTitle>
          <ListParagraph>
            Experiece with <br />
            React.js & Next.js
          </ListParagraph>
        </ListContainer>
      </ListItem>
      <ListItem>
        <picture>
          <DiFirebase size="3rem" />
        </picture>
        <ListContainer>
          <ListTitle>Back-End</ListTitle>
          <ListParagraph>
            Experience with <br />
            Node and MongoDB
          </ListParagraph>
        </ListContainer>
      </ListItem>
      <ListItem>
        <picture>
          <DiZend size="3rem" />
        </picture>
        <ListContainer>
          <ListTitle>UI/UX</ListTitle>
          <ListParagraph>
            Experience with <br />
            tools like Figma
          </ListParagraph>
        </ListContainer>
      </ListItem>
      <ListItem>
        <picture>
          <img
            src="https://cdn.discordapp.com/attachments/1260761382371196928/1262506766986379315/ethereum-eth-logo.png?ex=6696d88d&is=6695870d&hm=326e37572ca61697f4b4a8065e67bd101b924f4d76df679ce1c972f81e301486&"
            alt=""
            height={24}
            width={24}
          />
        </picture>
        <ListContainer>
          <ListTitle>Web3</ListTitle>
          <ListParagraph>
            Experience with <br />
            Solidity and Smart Contracts
          </ListParagraph>
        </ListContainer>
      </ListItem>
      <ListItem>
        <picture>
          <img
            src="https://cdn.discordapp.com/attachments/1260761382371196928/1262506767363870811/tailwind-logo.png?ex=6696d88d&is=6695870d&hm=aed4356e4ff2454e21cae44cbdcbf6640d0f3ab44f82fb51ef035336136a31d0&"
            alt=""
            height={24}
            width={24}
          />
        </picture>
        <ListContainer>
          <ListTitle>UI Libraries</ListTitle>
          <ListParagraph>
            Experience with <br />
            Tailwind CSS & Bootstrap
          </ListParagraph>
        </ListContainer>
      </ListItem>
    </List>
    <SectionDivider colorAlt />
  </Section>
);

export default Technologies;
