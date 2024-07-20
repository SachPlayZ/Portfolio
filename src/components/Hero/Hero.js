import React from "react";

import {
  Section,
  SectionText,
  SectionTitle,
} from "../../styles/GlobalComponents";
import Button from "../../styles/GlobalComponents/Button";
import { LeftSection } from "./HeroStyles";

const Hero = (props) => (
  <>
    <Section row nopadding>
      <LeftSection>
        <SectionTitle main center>
          Sachindra Kumar Singh <br />
          Full-Stack and Web3 Dev
        </SectionTitle>
        <SectionText>
          A passionate Full-Stack Developer and Web3 enthusiast, always looking
          for opportunities to learn and grow.
        </SectionText>
        <Button onClick={props.handleClick}>Learn More</Button>
      </LeftSection>
    </Section>
  </>
);

export default Hero;
