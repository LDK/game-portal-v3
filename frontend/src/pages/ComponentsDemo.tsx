import { Title, Grid } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";
import { ArcadeButton } from "../components/buttons/ArcadeButton";
import { PlayingCard, ClassicFace, CardBack, OhnoFace, BattleFace, CardHand, CardPack } from "../components/cards";
import type { ColorName } from "../tailwind-colors";
import FeltSection from "../components/FeltSection";

const ComponentsDemoPage = () => {
  return (
    <Fragment>
      <FeltSection color="green" colorLevel={7}>
          <Title my={12} className="text-white">Small Arcade Buttons</Title>
          <div className="mb-4 flex flex-wrap @xs:justify-center @xl:justify-start gap-3 @sm:gap-2">
            {
              ['sky','red','yellow','lime','gray','green','purple','orange','black','white','cyan','pink','teal','violet','amber','fuchsia','indigo','emerald','rose'].map((color, idx) => (
                <ArcadeButton key={idx} size="sm" label={color.toLocaleUpperCase()} color={color as ColorName} callback={() => console.log("JUMP")} />
              ))
            }
          </div>

          <Title my={12} className="text-white">Medium Arcade Buttons</Title>
          <div className="mb-4 flex flex-wrap @xs:justify-center @xl:justify-start gap-3 @sm:gap-2">
            {
              ['sky','red','yellow','lime','gray','green','purple','orange','black','white','cyan','pink','teal','violet','amber','fuchsia','indigo','emerald','rose'].map((color, idx) => (
                <ArcadeButton key={idx} size="md" label={color.toLocaleUpperCase()} color={color as ColorName} callback={() => console.log("JUMP")} />
              ))
            }
          </div>

          <Title my={12} className="text-white">Large Arcade Buttons</Title>
          <div className="mb-4 flex flex-wrap @xs:justify-center @xl:justify-start gap-3 @sm:gap-2">
            {
              ['sky','red','yellow','lime','gray','green','purple','orange','black','white','cyan','pink','teal','violet','amber','fuchsia','indigo','emerald','rose'].map((color, idx) => (
                <ArcadeButton key={idx} size="lg" label={color.toLocaleUpperCase()} color={color as ColorName} callback={() => console.log("JUMP")} />
              ))
            }
          </div>
      </FeltSection>

      <FeltSection color="sky" colorLevel={6}>
        <Title my={12} className="text-white">Playing Cards</Title>

        <Grid justify="center" align="center" gutter="xl" className="mb-4" columns={3}>
          <PlayingCard>
            <ClassicFace suit="hearts" value="Ace" />
            <CardBack />
          </PlayingCard>

          <PlayingCard>
            <OhnoFace />
          </PlayingCard>

          <PlayingCard>
            <BattleFace />
          </PlayingCard>
        </Grid>

        <CardHand>
          <PlayingCard><OhnoFace /></PlayingCard>
          <PlayingCard><OhnoFace /></PlayingCard>
          <PlayingCard><OhnoFace /></PlayingCard>
          <PlayingCard><OhnoFace /></PlayingCard>
          <PlayingCard><OhnoFace /></PlayingCard>
        </CardHand>

        <CardHand fan={true}>
          <PlayingCard inHand={true}><OhnoFace /></PlayingCard>
          <PlayingCard inHand={true}><OhnoFace /></PlayingCard>
          <PlayingCard inHand={true}><OhnoFace /></PlayingCard>
          <PlayingCard inHand={true}><OhnoFace /></PlayingCard>
          <PlayingCard inHand={true}><OhnoFace /></PlayingCard>
          <PlayingCard inHand={true}><OhnoFace /></PlayingCard>
          <PlayingCard inHand={true}><OhnoFace /></PlayingCard>
          <PlayingCard inHand={true}><OhnoFace /></PlayingCard>
          <PlayingCard inHand={true}><OhnoFace /></PlayingCard>
          <PlayingCard inHand={true}><OhnoFace /></PlayingCard>
          <PlayingCard inHand={true}><OhnoFace /></PlayingCard>
          <PlayingCard inHand={true}><OhnoFace /></PlayingCard>
          <PlayingCard inHand={true}><OhnoFace /></PlayingCard>
          <PlayingCard inHand={true}><OhnoFace /></PlayingCard>
          <PlayingCard inHand={true}><OhnoFace /></PlayingCard>
        </CardHand>

      </FeltSection>

      <FeltSection color="red" colorLevel={8}>
        <Title my={12} className="text-white">Card Packs</Title>
        <Grid justify="center" align="center" gutter="xl" className="mb-4" columns={3}>
          <CardPack />
          <CardPack variant="bobs" />
          <CardPack variant="special" foil='platinum' />
          <CardPack variant="prestige" />
          <CardPack variant="deluxe" />
        </Grid>
      </FeltSection>
    </Fragment>
  );
};

export default ComponentsDemoPage;