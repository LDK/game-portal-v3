import { Title } from "@mantine/core";
import { Fragment } from "react/jsx-runtime";
import FeltSection from "../components/FeltSection";

const HomePage = () => {
  return (
    <Fragment>
      <FeltSection color="green" colorLevel={7}>
        <Title className="text-white" order={2}>Welcome to Rainy Days Game Portal!</Title>
      </FeltSection>
    </Fragment>
  );
};

export default HomePage;